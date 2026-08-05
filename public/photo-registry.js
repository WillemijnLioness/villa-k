/* =============================================================================
   PHOTO REGISTRY  —  production build
   Shared across index.html (VKF), retreats.html (CDR) and admin.html.

   Storage: server-side via /api/photos (Express + overrides.json on Railway volume).
   Admin writes use PUT /api/photos/:site/:slot and DELETE /api/photos/:site/:slot.
   ============================================================================= */

const PHOTO_REGISTRY = {
  /* ---------- Villa Koukouvayia Farms ---------- */
  vkf: {
    hero: {
      label: 'Hero — landing slideshow',
      hint: 'Upload in this order: (1) estate wide shot — long linger opener, (2–3) aerial drone estate N→S and S→N, (4) both buildings together, (5) Guest House feature, (6) Garden Suite. Landscape 2400×1600px. Auto-advances every 7s.',
      multiple: true,
      defaults: ['https://images.squarespace-cdn.com/content/v1/693ebd5cd625ea5b123f1a7e/1765913265474-7GSHD4W7HHH1ORTASBW5/VKF1.png']
    },
    intro: {
      label: 'Welcome / About panel',
      hint: 'Vertical 4:5 portrait orientation works best.',
      multiple: false,
      defaults: ['https://images.squarespace-cdn.com/content/v1/693ebd5cd625ea5b123f1a7e/1765912097838-BPPGSEP2YNM8MGDA01PK/Main+House4.jpeg']
    },
    directions_arrival: {
      label: 'Directions page — arrival photo',
      hint: 'Placeholder is the estate aerial shot. H&R suggested something thematically connected to "arriving" — e.g. the drone footage of the coast road, a shot of the Sfakia road, or a slideshow from the "Roads & Byways" folder in the Visual Media Catalog. Landscape, wide crop.',
      multiple: false,
      defaults: ['https://images.squarespace-cdn.com/content/v1/693ebd5cd625ea5b123f1a7e/1765913273406-LERF3E0TYHOX4KIQ1B46/VKF7.png']
    },
    mh_main: {
      label: 'Main House — slideshow',
      hint: 'Upload in order: exterior verandas, interior living spaces, kitchen, bedrooms (Koukouvayia Suite, Gryphon\'s Nest, Falcon\'s Nest), bathrooms, roof terrace. 4:3 landscape.',
      multiple: true,
      defaults: ['https://images.squarespace-cdn.com/content/v1/693ebd5cd625ea5b123f1a7e/1765912097838-BPPGSEP2YNM8MGDA01PK/Main+House4.jpeg']
    },
    gh_main: {
      label: 'Guest House — slideshow',
      hint: 'Upload in order: exterior verandas, southeast patio, interior living, kitchen, Hawk\'s Nest master bedroom, Crow\'s Nest bedroom, roof terrace, private garden. 4:3 landscape.',
      multiple: true,
      defaults: ['https://images.squarespace-cdn.com/content/v1/693ebd5cd625ea5b123f1a7e/1765912538543-OD3YLBKMIUQNS2PI8BMA/GH2.png']
    },
    gs_main: {
      label: 'Garden Suite — slideshow',
      hint: 'Upload in order: (1) living room configured as living area, (2) living room configured as bedroom, (3) exterior garden view, (4) grove access, (5) kitchen/dining, (6) bedrooms, (7) bathrooms, (8) outdoor garden. Omit Tea Terrace downshot. For pool: use poolside lounge angle, not aerial downshot. 4:3 landscape.',
      multiple: true,
      defaults: ['https://images.squarespace-cdn.com/content/v1/693ebd5cd625ea5b123f1a7e/1765913265386-JXN9VM21R4GNDPH7I3EP/VKF2.png']
    },
    estate_main: {
      label: 'Entire Estate — slideshow',
      hint: 'Upload in order: aerial/drone overview, pool area, ceremony grove, roof terraces, social spaces. Wide/aerial shots work best. 4:3 landscape.',
      multiple: true,
      defaults: ['https://images.squarespace-cdn.com/content/v1/693ebd5cd625ea5b123f1a7e/1765913273406-LERF3E0TYHOX4KIQ1B46/VKF7.png']
    },
    combo_mgh_left: {
      label: 'Combo card — Main + Guest (left tile)',
      hint: 'Square-ish image of the Main House.',
      multiple: false,
      defaults: ['https://images.squarespace-cdn.com/content/v1/693ebd5cd625ea5b123f1a7e/1765912097838-BPPGSEP2YNM8MGDA01PK/Main+House4.jpeg']
    },
    combo_mgh_right: {
      label: 'Combo card — Main + Guest (right tile)',
      hint: 'Square-ish image of the Guest House.',
      multiple: false,
      defaults: ['https://images.squarespace-cdn.com/content/v1/693ebd5cd625ea5b123f1a7e/1765912538543-OD3YLBKMIUQNS2PI8BMA/GH2.png']
    },
    combo_mgs_left: {
      label: 'Combo card — Main + Garden (left tile)',
      hint: 'Square-ish image of the Main House.',
      multiple: false,
      defaults: ['https://images.squarespace-cdn.com/content/v1/693ebd5cd625ea5b123f1a7e/1765912097838-BPPGSEP2YNM8MGDA01PK/Main+House4.jpeg']
    },
    combo_mgs_right: {
      label: 'Combo card — Main + Garden (right tile)',
      hint: 'Square-ish image of the Garden Suite.',
      multiple: false,
      defaults: ['https://images.squarespace-cdn.com/content/v1/693ebd5cd625ea5b123f1a7e/1765913265386-JXN9VM21R4GNDPH7I3EP/VKF2.png']
    },
    combo_ggs_left: {
      label: 'Combo card — Guest + Garden (left tile)',
      hint: 'Square-ish image of the Guest House.',
      multiple: false,
      defaults: ['https://images.squarespace-cdn.com/content/v1/693ebd5cd625ea5b123f1a7e/1765912538543-OD3YLBKMIUQNS2PI8BMA/GH2.png']
    },
    combo_ggs_right: {
      label: 'Combo card — Guest + Garden (right tile)',
      hint: 'Square-ish image of the Garden Suite.',
      multiple: false,
      defaults: ['https://images.squarespace-cdn.com/content/v1/693ebd5cd625ea5b123f1a7e/1765913265386-JXN9VM21R4GNDPH7I3EP/VKF2.png']
    },
    location: {
      label: 'Crete location panel',
      hint: 'Vertical 5:6. Landscape, sea, mountains, or estate exterior.',
      multiple: false,
      defaults: ['https://images.squarespace-cdn.com/content/v1/693ebd5cd625ea5b123f1a7e/1765913276068-WMFI73UGU4W9E032AF91/VKF9.png']
    },
    hosts_portrait: {
      label: 'About page — Heidi, Richard & Logan portrait',
      hint: 'Warm, candid photo of the hosts at the property. 4:5 portrait works best. Can also be a lifestyle shot of the estate.',
      multiple: false,
      defaults: ['https://images.squarespace-cdn.com/content/v1/693ebd5cd625ea5b123f1a7e/1765912097838-BPPGSEP2YNM8MGDA01PK/Main+House4.jpeg']
    },
    reviews_banner: {
      label: 'Reviews section — banner photo',
      hint: 'Full-width landscape photo shown above the guest reviews. Best: pool terrace, olive grove canopy, or estate overview at golden hour. Wide 16:9 or 3:1 crop. Candidate shots: 2021-0909 (114), 2017-1004 (101), 2021-0925 (100).',
      multiple: false,
      defaults: ['https://images.squarespace-cdn.com/content/v1/693ebd5cd625ea5b123f1a7e/1765913273406-LERF3E0TYHOX4KIQ1B46/VKF7.png']
    }
  },

  /* ---------- Cretan Destination Retreats ---------- */
  rpl: {
    hero: {
      label: 'Hero — main banner',
      hint: 'Wide landscape image at the top of the homepage. 2400×1600px ideal.',
      multiple: false,
      defaults: ['https://retreatplaylove.com/assets/images/image01.png?v=7758b6f7']
    },
    intro: {
      label: 'About / Hosts panel',
      hint: 'Photo of Heidi & Richard, or a candid hosting moment. 4:5 portrait.',
      multiple: false,
      defaults: ['https://retreatplaylove.com/assets/images/image02.jpg?v=7758b6f7']
    },
    photography: {
      label: 'Photography Retreat — feature image',
      hint: 'Should evoke landscape photography on Crete.',
      multiple: false,
      defaults: ['https://retreatplaylove.com/assets/images/image06.jpg?v=7758b6f7']
    },
    trek: {
      label: 'White Mountain Trek — feature image',
      hint: 'High alpine, dramatic. Lefka Ori scenery.',
      multiple: false,
      defaults: ['https://retreatplaylove.com/assets/images/image05.jpg?v=7758b6f7']
    },
    cities: {
      label: 'Cities of History — feature image',
      hint: 'Thessaloniki, Olympus or ancient sites.',
      multiple: false,
      defaults: ['https://retreatplaylove.com/assets/images/image04.jpg?v=7758b6f7']
    },
    harvest: {
      label: 'Cretan Harvest — feature image',
      hint: 'Olive groves, harvest, vineyards, food.',
      multiple: false,
      defaults: ['https://retreatplaylove.com/assets/images/image07.jpg?v=7758b6f7']
    },
    custom: {
      label: 'Custom itinerary — feature image',
      hint: 'Something evocative of personal, off-the-beaten-path travel.',
      multiple: false,
      defaults: ['https://images.squarespace-cdn.com/content/v1/693ebd5cd625ea5b123f1a7e/1765913276068-WMFI73UGU4W9E032AF91/VKF9.png']
    }
  }
};

/* ---------- API helpers ---------- */

let _cachedOverrides = null;

async function loadOverrides() {
  if (_cachedOverrides) return _cachedOverrides;
  try {
    const res = await fetch('/api/photos');
    _cachedOverrides = await res.json();
    return _cachedOverrides;
  } catch {
    return {};
  }
}

async function putPhotoSlot(site, slot, file) {
  const fd = new FormData();
  fd.append('image', file);
  const res = await fetch(`/api/photos/${site}/${slot}`, { method: 'PUT', body: fd });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  const data = await res.json();
  if (_cachedOverrides) {
    if (!_cachedOverrides[site]) _cachedOverrides[site] = {};
    _cachedOverrides[site][slot] = [data.url];
  }
  return data.url;
}

async function appendPhotoSlot(site, slot, file) {
  const fd = new FormData();
  fd.append('image', file);
  const res = await fetch(`/api/photos/${site}/${slot}`, { method: 'POST', body: fd });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  const data = await res.json();
  if (_cachedOverrides) {
    if (!_cachedOverrides[site]) _cachedOverrides[site] = {};
    _cachedOverrides[site][slot] = data.urls;
  }
  return data.urls;
}

async function deletePhotoSlot(site, slot) {
  const res = await fetch(`/api/photos/${site}/${slot}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(res.statusText);
  if (_cachedOverrides?.[site]) delete _cachedOverrides[site][slot];
}

async function deletePhotoSlotAt(site, slot, index) {
  const res = await fetch(`/api/photos/${site}/${slot}/${index}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(res.statusText);
  if (_cachedOverrides?.[site]?.[slot]) {
    _cachedOverrides[site][slot].splice(index, 1);
    if (_cachedOverrides[site][slot].length === 0) delete _cachedOverrides[site][slot];
  }
}

async function resetAllPhotos() {
  const res = await fetch('/api/photos', { method: 'DELETE' });
  if (!res.ok) throw new Error(res.statusText);
  _cachedOverrides = null;
}

/* ---------- Resolution helpers ---------- */

function getPhotoUrlFromOverrides(siteKey, slotKey, overrides, index = 0) {
  const userUrls = overrides[siteKey]?.[slotKey];
  if (userUrls && userUrls[index]) return userUrls[index];
  const slot = PHOTO_REGISTRY[siteKey]?.[slotKey];
  if (!slot) return null;
  return slot.defaults[index] || slot.defaults[0] || null;
}

function getAllUrlsForSlot(siteKey, slotKey, overrides) {
  const userUrls = overrides[siteKey]?.[slotKey];
  if (userUrls && userUrls.length) return userUrls;
  return PHOTO_REGISTRY[siteKey]?.[slotKey]?.defaults || [];
}

/* Apply overrides to all data-photo-slot images on the page. Async — called once on load. */
async function applyPhotoOverrides(root = document) {
  const imgs = root.querySelectorAll('img[data-photo-slot]');
  if (!imgs.length) return;
  const overrides = await loadOverrides();
  imgs.forEach(img => {
    const [siteKey, slotKey] = img.dataset.photoSlot.split(':');
    const urls = getAllUrlsForSlot(siteKey, slotKey, overrides);
    if (!urls.length) return;
    if (urls.length > 1 && typeof window.buildCarousel === 'function') {
      window.buildCarousel(img, urls);
    } else {
      if (img.src !== urls[0]) img.src = urls[0];
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => {
        if (typeof window.openLightbox === 'function') window.openLightbox(urls, 0);
      });
    }
  });
}

/* Auto-apply on load. */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => applyPhotoOverrides());
} else {
  applyPhotoOverrides();
}
