import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import { copyFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import basicAuth from 'express-basic-auth';

/* Sharp is optional — available on linux (Railway/Docker), may be absent on Windows ARM64 dev machines. */
let sharp;
try { ({ default: sharp } = await import('sharp')); } catch { /* falls back to raw copy below */ }

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '../public');
const TMP_DIR = path.join(__dirname, '../tmp');

/* --- Persistent storage paths ---
   In Railway: mount a volume at /data and set DATA_DIR=/data
   Locally:    falls back to server/data/ with uploads inside public/uploads/ */
const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(__dirname, 'data');

const OVERRIDES_FILE = path.join(DATA_DIR, 'overrides.json');
const UPLOADS_DIR = process.env.DATA_DIR
  ? path.join(DATA_DIR, 'uploads')
  : path.join(PUBLIC_DIR, 'uploads');

/* --- Ensure runtime dirs exist --- */
await fs.mkdir(DATA_DIR, { recursive: true });
await fs.mkdir(UPLOADS_DIR, { recursive: true });
await fs.mkdir(TMP_DIR, { recursive: true });

const app = express();
const upload = multer({ dest: TMP_DIR });

/* --- Admin auth --- */
const adminAuth = basicAuth({
  users: { admin: process.env.ADMIN_PASSWORD || 'change-me' },
  challenge: true,
  realm: 'Villa K Admin'
});

/* --- Middleware --- */
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));

/* --- Named page routes --- */
app.get('/', (_req, res) => res.sendFile(path.join(PUBLIC_DIR, 'index.html')));
app.get('/retreats', (_req, res) => res.sendFile(path.join(PUBLIC_DIR, 'retreats.html')));
app.get('/admin', adminAuth, (_req, res) => res.sendFile(path.join(__dirname, '../admin.html')));

/* --- Static assets (js, fonts, uploads fallback) --- */
app.use(express.static(PUBLIC_DIR));

/* ================================================================
   PHOTO API
   GET    /api/photos               → current overrides (public)
   PUT    /api/photos/:site/:slot   → upload + resize (admin)
   DELETE /api/photos/:site/:slot   → remove slot override (admin)
   DELETE /api/photos               → reset all overrides (admin)
   POST   /api/photos/import        → replace overrides with JSON body (admin)
================================================================ */

app.get('/api/photos', async (_req, res) => {
  res.json(await readOverrides());
});

app.put('/api/photos/:site/:slot', adminAuth, upload.single('image'), async (req, res) => {
  const { site, slot } = req.params;
  if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

  const filename = `${site}-${slot}-${Date.now()}.jpg`;
  const finalPath = path.join(UPLOADS_DIR, filename);

  try {
    if (sharp) {
      await sharp(req.file.path)
        .resize({ width: 2000, withoutEnlargement: true })
        .jpeg({ quality: 88, mozjpeg: true })
        .toFile(finalPath);
      await fs.unlink(req.file.path);
    } else {
      await copyFile(req.file.path, finalPath);
      await fs.unlink(req.file.path);
    }

    const url = `/uploads/${filename}`;
    const overrides = await readOverrides();
    if (!overrides[site]) overrides[site] = {};
    overrides[site][slot] = [url];
    await writeOverrides(overrides);

    res.json({ url });
  } catch (err) {
    await fs.unlink(req.file.path).catch(() => {});
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/photos/:site/:slot', adminAuth, async (req, res) => {
  const { site, slot } = req.params;
  const overrides = await readOverrides();
  if (overrides[site]) {
    delete overrides[site][slot];
    if (Object.keys(overrides[site]).length === 0) delete overrides[site];
    await writeOverrides(overrides);
  }
  res.json({ ok: true });
});

app.delete('/api/photos', adminAuth, async (_req, res) => {
  await writeOverrides({});
  res.json({ ok: true });
});

/* Import: accepts { overrides: { vkf: { hero: ['/uploads/...'] } } } or the bare object.
   Only URL strings are valid — base64 data URIs are rejected. */
app.post('/api/photos/import', adminAuth, async (req, res) => {
  const raw = req.body.overrides ?? req.body;
  const sanitised = sanitiseOverrides(raw);
  await writeOverrides(sanitised);
  res.json({ ok: true, slots: countSlots(sanitised) });
});

/* ================================================================
   CONTACT / BOOKING API
   POST /api/contact
   Body: { site: 'vkf'|'rpl', ...formFields }
================================================================ */

app.post('/api/contact', async (req, res) => {
  const { site, ...fields } = req.body ?? {};

  const toEmail = site === 'rpl'
    ? (process.env.RPL_CONTACT_EMAIL || 'info@retreatplaylove.com')
    : (process.env.VKF_CONTACT_EMAIL || 'info@koukouvayia.com');

  const subject = site === 'rpl'
    ? `New CDR Enquiry — ${fields.retreat || 'General'}`
    : `New VKF Booking Request — ${fields.property || 'General'} (${fields.checkIn || '?'} → ${fields.checkOut || '?'})`;

  const textBody = Object.entries(fields)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');

  if (!process.env.RESEND_API_KEY) {
    console.log(`[contact] Would send to ${toEmail}:\n${subject}\n${textBody}`);
    return res.json({ ok: true });
  }

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.MAIL_FROM || 'noreply@koukouvayia.com',
      to: toEmail,
      replyTo: fields.email,
      subject,
      text: textBody
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('[contact] Resend error:', err.message);
    res.status(500).json({ error: 'Email delivery failed. Please try again or contact us directly.' });
  }
});

/* ================================================================
   Helpers
================================================================ */

async function readOverrides() {
  try { return JSON.parse(await fs.readFile(OVERRIDES_FILE, 'utf8')); }
  catch { return {}; }
}

async function writeOverrides(obj) {
  await fs.writeFile(OVERRIDES_FILE, JSON.stringify(obj, null, 2));
}

function sanitiseOverrides(raw) {
  if (typeof raw !== 'object' || raw === null) return {};
  const out = {};
  for (const [site, slots] of Object.entries(raw)) {
    if (typeof slots !== 'object' || slots === null) continue;
    out[site] = {};
    for (const [slot, urls] of Object.entries(slots)) {
      if (!Array.isArray(urls)) continue;
      const cleaned = urls.filter(u => typeof u === 'string' && u.startsWith('/'));
      if (cleaned.length) out[site][slot] = cleaned;
    }
  }
  return out;
}

function countSlots(overrides) {
  return Object.values(overrides).reduce((n, slots) => n + Object.keys(slots).length, 0);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`villa-k running on :${PORT}`));
