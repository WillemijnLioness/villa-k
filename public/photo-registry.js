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
    },

    /* ---- Rooms page (/rooms): living spaces + one slideshow per bedroom. Defaults from the pre-ML site. ---- */
    rooms_main_house: {
      label: "Rooms page — Main House living spaces",
      hint: "Slideshow beside the Main House description on /rooms (living room, kitchen, baths, terraces). 4:3 landscape.",
      multiple: true,
      defaults: ["/rooms/225-2022-1003-101.jpg", "/rooms/14-2019-0729-208.jpg", "/rooms/140-2019-0704-174.jpg", "/rooms/110-2018-1003-168.jpg", "/rooms/115-2019-0426-204.jpg", "/rooms/200-2021-0213-101.jpg", "/rooms/180-2019-0704-178.jpg", "/rooms/40-2019-1129-216.jpg", "/rooms/135-2019-1129-211.jpg", "/rooms/140-2019-1129-214.jpg", "/rooms/230-2019-1129-226.jpg", "/rooms/130-2022-1124-100.jpg", "/rooms/30-2021-0120-100.jpg", "/rooms/160-2019-1204-100-scaled.jpg", "/rooms/100-2019-1204-101.jpg", "/rooms/170-2019-1204-106.jpg", "/rooms/175-2019-1204-107.jpg", "/rooms/100-2019-1204-201.jpg", "/rooms/110-2019-1127-100.jpg", "/rooms/105-2019-1120-104.jpg", "/rooms/115-2019-1121-107.jpg", "/rooms/65-2019-1105-106.jpg", "/rooms/140-2019-1106-104.jpg", "/rooms/79-2019-1105-119.jpg", "/rooms/215-2019-1203-302.jpg", "/rooms/220-2022-1003-100.jpg"]
    },
    rooms_guest_house: {
      label: "Rooms page — Guest House living spaces",
      hint: "Slideshow beside the Guest House description on /rooms (living room, kitchen, baths, terraces). 4:3 landscape.",
      multiple: true,
      defaults: ["/rooms/185-2019-1019-110-2.jpg", "/rooms/16-2019-0729-201.jpg", "/rooms/115-2019-0704-179.jpg", "/rooms/31-2019-0728-104.jpg", "/rooms/32-2019-0728-100.jpg", "/rooms/210-2022-0612-202.jpg", "/rooms/83-2018-0922-102.jpg", "/rooms/125-2020-0131-104.jpg", "/rooms/130-2018-1003-164.jpg", "/rooms/135-2019-0728-119.jpg", "/rooms/255-2019-0728-116.jpg", "/rooms/110-2019-1019-122.jpg", "/rooms/150-2019-1019-129.jpg", "/rooms/155-2018-1003-190.jpg", "/rooms/80-2019-0727-106.jpg", "/rooms/130-2019-1019-113.jpg", "/rooms/170-2019-1019-116.jpg", "/rooms/82-2020-0131-101.jpg", "/rooms/78-2019-1019-111.jpg"]
    },
    rooms_garden_house: {
      label: "Rooms page — Garden Suite living spaces",
      hint: "Slideshow beside the Garden Suite description on /rooms (living room, kitchen, baths, terraces). 4:3 landscape.",
      multiple: true,
      defaults: ["/rooms/200-2022-1120-284.jpg", "/rooms/93-2021-0711-114.jpg", "/rooms/155-2021-0609-105.jpg", "/rooms/110-2019-0821-100.jpg", "/rooms/115-2022-0904-218.jpg", "/rooms/120-2022-1120-211.jpg", "/rooms/125-2022-1120-206.jpg", "/rooms/130-2022-0904-219.jpg", "/rooms/105-2019-0418-115.jpg", "/rooms/142-2023-0128-109.jpg", "/rooms/142-2023-0128-117a.jpg", "/rooms/150-2022-1120-235-scaled.jpg", "/rooms/330-2022-1120-236.jpg", "/rooms/335-2022-1120-242.jpg", "/rooms/125-2022-1120-243.jpg", "/rooms/165-2022-1120-249.jpg", "/rooms/170-2022-1120-261.jpg", "/rooms/125-2022-1120-259.jpg", "/rooms/180-2022-1120-267.jpg", "/rooms/185-2022-1120-270.jpg", "/rooms/190-2022-1120-266.jpg", "/rooms/2023-0619-112.jpg", "/rooms/110-2023-0618-221.jpg", "/rooms/115-2023-0618-210.jpg", "/rooms/130-2023-0618-215-1.jpg", "/rooms/145-2023-0618-135.jpg", "/rooms/145-2022-1120-273.jpg"]
    },
    rooms_common: {
      label: "Rooms page — Common Spaces",
      hint: "Pool, patio, exercise room, gear, gardens. 4:3 landscape.",
      multiple: true,
      defaults: ["/rooms/115-2021-0125-102.jpg", "/rooms/100-2019-0704-168.jpg", "/rooms/20-2018-1003-197.jpg", "/rooms/110-2019-0704-137.jpg", "/rooms/145-2019-0704-186.jpg", "/rooms/115-2019-0704-177.jpg", "/rooms/120-2019-0710-204.jpg", "/rooms/125-2019-0727-116.jpg", "/rooms/130-2019-0710-201.jpg", "/rooms/135-2019-0710-202.jpg", "/rooms/140-2018-1003-185.jpg", "/rooms/120-2018-0108-107.jpg", "/rooms/205-2021-0626-100.jpg"]
    },
    room_koukouvayia: {
      label: "Rooms page — Koukouvayia Suite (Main House)",
      hint: "Slideshow for the Koukouvayia Suite, shown in its house and in the Entire Estate list. 4:3 landscape.",
      multiple: true,
      defaults: ["/rooms/79-2019-1105-119.jpg", "/rooms/65-2019-1105-106.jpg", "/rooms/100-2019-1105-116.jpg", "/rooms/110-2019-1105-101.jpg", "/rooms/115-2019-1122-105.jpg", "/rooms/120-2019-1105-113.jpg", "/rooms/125-2019-1108-100.jpg", "/rooms/130-2019-1105-108.jpg", "/rooms/90-2019-1105-124.jpg", "/rooms/150-2019-1106-108.jpg", "/rooms/145-2019-1106-101.jpg", "/rooms/75-2019-1106-104.jpg"]
    },
    room_falcon: {
      label: "Rooms page — Falcon Nest (Main House)",
      hint: "Slideshow for the Falcon Nest, shown in its house and in the Entire Estate list. 4:3 landscape.",
      multiple: true,
      defaults: ["/rooms/120-2015-0815-116.jpg", "/rooms/110-2019-1127-100.jpg", "/rooms/105-2019-1127-107.jpg", "/rooms/81-2019-1030-119.jpg", "/rooms/115-2019-1030-121.jpg"]
    },
    room_griffon: {
      label: "Rooms page — Griffon Nest (Main House)",
      hint: "Slideshow for the Griffon Nest, shown in its house and in the Entire Estate list. 4:3 landscape.",
      multiple: true,
      defaults: ["/rooms/72-2019-1121-102.jpg", "/rooms/105-2019-1120-104.jpg", "/rooms/71-2019-1120-105.jpg"]
    },
    room_hawk: {
      label: "Rooms page — Hawk’s Nest (Guest House)",
      hint: "Slideshow for the Hawk’s Nest, shown in its house and in the Entire Estate list. 4:3 landscape.",
      multiple: true,
      defaults: ["/rooms/120-2020-0131-110.jpg", "/rooms/66-2019-0727-103.jpg", "/rooms/105-2019-1019-102.jpg", "/rooms/80-2019-0727-106.jpg", "/rooms/115-2020-0131-105.jpg"]
    },
    room_crow: {
      label: "Rooms page — Crow’s Nest (Guest House)",
      hint: "Slideshow for the Crow’s Nest, shown in its house and in the Entire Estate list. 4:3 landscape.",
      multiple: true,
      defaults: ["/rooms/82-2020-0131-101.jpg", "/rooms/130-2019-1019-113.jpg", "/rooms/170-2019-1019-116.jpg"]
    },
    room_pheasant: {
      label: "Rooms page — Pheasant Nest (Garden Suite)",
      hint: "Slideshow for the Pheasant Nest, shown in its house and in the Entire Estate list. 4:3 landscape.",
      multiple: true,
      defaults: ["/rooms/150-2022-1105-106.jpg", "/rooms/100-2022-1120-254.jpg", "/rooms/105-2022-1116-201.jpg", "/rooms/110-2022-1105-105.jpg", "/rooms/115-2022-1105-109.jpg", "/rooms/150-2022-1120-235-scaled.jpg", "/rooms/330-2022-1120-236.jpg", "/rooms/130-2022-1120-248.jpg", "/rooms/165-2022-1120-249.jpg", "/rooms/335-2022-1120-242.jpg", "/rooms/125-2022-1120-243.jpg"]
    },
    room_partridge: {
      label: "Rooms page — Partridge Nest (Garden Suite)",
      hint: "Slideshow for the Partridge Nest, shown in its house and in the Entire Estate list. 4:3 landscape.",
      multiple: true,
      defaults: ["/rooms/2023-0619-112.jpg", "/rooms/100-2022-1105-113.jpg", "/rooms/105-2022-1120-259.jpg", "/rooms/125-2022-1120-259.jpg", "/rooms/110-2022-1120-261.jpg", "/rooms/115-2022-1120-262.jpg", "/rooms/120-2022-1120-263.jpg", "/rooms/190-2022-1120-266.jpg", "/rooms/180-2022-1120-267.jpg", "/rooms/355-2022-1120-268.jpg", "/rooms/185-2022-1120-270.jpg", "/rooms/135-2022-1120-271.jpg", "/rooms/2023-0619-111.jpg"]
    },
    room_swallow: {
      label: "Rooms page — Swallow’s Nest (Garden Suite)",
      hint: "Slideshow for the Swallow’s Nest, shown in its house and in the Entire Estate list. 4:3 landscape.",
      multiple: true,
      defaults: ["/rooms/230-2023-0618-703.jpg", "/rooms/100-2023-0618-100.jpg", "/rooms/105-2023-0619-110.jpg", "/rooms/110-2023-0618-221.jpg", "/rooms/115-2023-0618-210.jpg", "/rooms/120-2023-0618-406.jpg", "/rooms/125-2023-0618-405.jpg", "/rooms/130-2023-0618-215-1.jpg", "/rooms/135-2023-0618-600.jpg", "/rooms/140-2023-0618-110.jpg", "/rooms/145-2023-0618-135.jpg", "/rooms/150-2023-0618-223.jpg", "/rooms/155-2023-0618-401.jpg", "/rooms/220-2023-0618-702.jpg", "/rooms/225-2023-0618-704.jpg"]
    },
    room_chaperone: {
      label: "Rooms page — Chaperone Quarters (Garden Suite)",
      hint: "Slideshow for the Chaperone Quarters, shown in its house and in the Entire Estate list. 4:3 landscape.",
      multiple: true,
      defaults: ["/rooms/120-2022-1120-214.jpg", "/rooms/125-2022-1120-206.jpg", "/rooms/135-2022-1120-219.jpg", "/rooms/110-2022-1120-232.jpg", "/rooms/115-2022-1120-205.jpg"]
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
