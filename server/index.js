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
/* One canonical host for search engines: www → apex */
app.use((req, res, next) => {
  if (req.hostname === 'www.koukouvayia.com') return res.redirect(301, `https://koukouvayia.com${req.originalUrl}`);
  next();
});
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));

/* --- Named page routes --- */
app.get('/', (_req, res) => res.sendFile(path.join(PUBLIC_DIR, 'index.html')));
app.get('/retreats',   (_req, res) => res.sendFile(path.join(PUBLIC_DIR, 'retreats.html')));
app.get('/about',      (_req, res) => res.sendFile(path.join(PUBLIC_DIR, 'about.html')));
app.get('/policy',     (_req, res) => res.sendFile(path.join(PUBLIC_DIR, 'policy.html')));
app.get('/privacy',    (_req, res) => res.sendFile(path.join(PUBLIC_DIR, 'privacy.html')));
app.get('/directions', (_req, res) => res.sendFile(path.join(PUBLIC_DIR, 'directions.html')));
app.get('/admin',      adminAuth, (_req, res) => res.sendFile(path.join(__dirname, '../admin.html')));

/* --- Superseded documents → current editions --- */
app.get('/42-island-faqs.pdf', (_req, res) => res.redirect(301, '/42-crete-travel-faqs.pdf'));

/* --- Static assets (js, fonts, uploads fallback) --- */
app.use(express.static(PUBLIC_DIR));

/* ================================================================
   PHOTO API
   GET    /api/photos                     → current overrides (public)
   PUT    /api/photos/:site/:slot         → replace slot with single image (admin)
   POST   /api/photos/:site/:slot         → append image to slot array (admin)
   DELETE /api/photos/:site/:slot         → remove entire slot override (admin)
   DELETE /api/photos/:site/:slot/:index  → remove one image from slot (admin)
   DELETE /api/photos                     → reset all overrides (admin)
   POST   /api/photos/import              → replace overrides with JSON body (admin)
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

/* Append one image to a slot's array (POST) */
app.post('/api/photos/:site/:slot', adminAuth, upload.single('image'), async (req, res) => {
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
    if (!Array.isArray(overrides[site][slot])) overrides[site][slot] = [];
    overrides[site][slot].push(url);
    await writeOverrides(overrides);

    res.json({ url, urls: overrides[site][slot] });
  } catch (err) {
    await fs.unlink(req.file.path).catch(() => {});
    res.status(500).json({ error: err.message });
  }
});

/* Remove entire slot override */
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

/* Remove one image by index from a slot */
app.delete('/api/photos/:site/:slot/:index', adminAuth, async (req, res) => {
  const { site, slot } = req.params;
  const idx = parseInt(req.params.index, 10);
  if (isNaN(idx)) return res.status(400).json({ error: 'Invalid index' });

  const overrides = await readOverrides();
  const urls = overrides[site]?.[slot];
  if (Array.isArray(urls) && urls[idx] !== undefined) {
    urls.splice(idx, 1);
    if (urls.length === 0) {
      delete overrides[site][slot];
      if (Object.keys(overrides[site]).length === 0) delete overrides[site];
    }
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
    : `New VKF Booking Request — ${fields.property || 'General'} (${formatDate(fields.checkIn) || '?'}${fields.checkOut ? ` → ${formatDate(fields.checkOut)}` : ''})`;

  const rows = enquiryRows(site === 'rpl' ? RPL_FIELDS : VKF_FIELDS, fields);
  const textBody = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
  const htmlBody = enquiryHtml(subject, rows);

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
      text: textBody,
      html: htmlBody
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('[contact] Resend error:', err.message);
    res.status(500).json({ error: 'Email delivery failed. Please try again or contact us directly.' });
  }
});

/* ================================================================
   Enquiry email formatting
   Labels match what the guest sees on the form; dates are spelled out
   (2028-May-14 (Sun)) so day and month can't be confused.
================================================================ */

const VKF_FIELDS = [
  ['checkIn',            'Check-In',             'date'],
  ['checkOut',           'Check-Out',            'date'],
  ['nights',             'Nights'],
  ['adultGuests',        'Adult Guests'],
  ['childGuests',        'Children (2–16)'],
  ['infantGuests',       'Infants (under 2)'],
  ['property',           'Residence'],
  ['occasion',           "What's the Occasion?"],
  ['celebrationOptions', 'Celebration Options'],
  ['celebrationDate',    'Celebration Date',     'date'],
  ['celebrationGuests',  'Celebration Guests Onsite'],
  ['name',               'Name'],
  ['email',              'Email'],
  ['phone',              'Phone'],
  ['foundUs',            'Found Us Via'],
  ['quotedTotal',        'Website Quote (total)'],
  ['quotedDeposit',      'Refundable Security Deposit'],
  ['notes',              'Notes']
];

const RPL_FIELDS = [
  ['retreat', 'Retreat'],
  ['group',   'Group Size'],
  ['dates',   'Preferred Dates'],
  ['name',    'Name'],
  ['email',   'Email'],
  ['foundUs', 'Found Us Via'],
  ['message', 'Message']
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso ?? ''));
  if (!m) return iso ? String(iso) : '';
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return `${m[1]}-${MONTHS[+m[2] - 1]}-${m[3]} (${WEEKDAYS[d.getUTCDay()]})`;
}

/* Known fields in form order; anything unexpected is appended so nothing is lost */
function enquiryRows(schema, fields) {
  const known = new Set(schema.map(([key]) => key));
  const rows = schema
    .filter(([key]) => fields[key] !== undefined && String(fields[key]).trim() !== '')
    .map(([key, label, type]) => [label, type === 'date' ? formatDate(fields[key]) : String(fields[key]).trim()]);
  for (const [key, value] of Object.entries(fields)) {
    if (!known.has(key) && value !== undefined && String(value).trim() !== '') rows.push([key, String(value).trim()]);
  }
  return rows;
}

const escapeHtml = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function enquiryHtml(title, rows) {
  const tr = rows.map(([label, value]) =>
    `<tr><th style="text-align:left;vertical-align:top;padding:6px 16px 6px 0;white-space:nowrap;color:#555;">${escapeHtml(label)}</th>` +
    `<td style="padding:6px 0;white-space:pre-wrap;">${escapeHtml(value)}</td></tr>`).join('');
  return `<div style="font-family:Arial,sans-serif;font-size:14px;color:#222;">` +
    `<h2 style="font-size:16px;margin:0 0 12px;">${escapeHtml(title)}</h2>` +
    `<table style="border-collapse:collapse;">${tr}</table></div>`;
}

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
