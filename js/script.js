window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('page').classList.add('loaded');
});

const page = document.getElementById('page');
const exploreBtn = document.getElementById('exploreBtn');
const overlay = document.getElementById('overlay');
const menuPanel = document.getElementById('menuPanel');
const backHome = document.getElementById('backHome');


// Full country list — edit this one array to add/remove countries anywhere on the site
const COUNTRIES = ["Nigeria","Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo (Brazzaville)","Congo (DRC)","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","North Korea","North Macedonia","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe","Other"];

document.querySelectorAll('select[name="country"]').forEach(select => {
  COUNTRIES.forEach(country => {
    const opt = document.createElement('option');
    opt.textContent = country;
    select.appendChild(opt);
  });
});


function openMenu(){ overlay.classList.add('open'); menuPanel.classList.add('open'); }
function closeMenu(){ overlay.classList.remove('open'); menuPanel.classList.remove('open'); }

exploreBtn.addEventListener('click', openMenu);
overlay.addEventListener('click', closeMenu);


// global tap-to-smoke
document.addEventListener('click', (e) => {
  if (e.target.closest('.menu-panel') || e.target.closest('header') || e.target === exploreBtn) return;
  spawnSmoke(e.clientX, e.clientY, 7);
});


// Unified smoke system — one canvas, one engine, used everywhere
const canvas = document.getElementById('effects');
let spawnSmoke = () => {}; // no-op fallback if a page has no canvas yet

if (canvas) {
  const ctx = canvas.getContext('2d');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '40';

  function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const particles = [];
  spawnSmoke = function (x, y, count = 8) {
    for (let i = 0; i < count; i++) {
      particles.push({
        x, y,
        size: Math.random() * 9 + 5,
        alpha: 0.75,
        vx: (Math.random() - 0.5) * 1.1,
        vy: -(Math.random() * 1.3 + 0.4),
        growth: Math.random() * 0.35 + 0.2,
        color: Math.random() > 0.5 ? '212,164,100' : '242,232,216' // ember + cream mix
      });
    }
  };

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy; p.size += p.growth; p.alpha -= 0.012;
      if (p.alpha <= 0) { particles.splice(i, 1); continue; }
      ctx.beginPath();
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.shadowColor = `rgba(${p.color},.6)`;
      ctx.shadowBlur = 18;
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(animate);
  }
  animate();
}


const logoTap = document.getElementById('logoTap');
logoTap.addEventListener('click', (e) => {
  e.stopPropagation();
  const rect = logoTap.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  spawnSmoke(cx, cy, 16);
});


// Music page slider — draggable carousel (loops continuously both ways)
const slider = document.getElementById('slider');
if (slider) {
  const track = document.getElementById('slideTrack');
  const nextBtn = document.getElementById('slideNext');
  const prevBtn = document.getElementById('slidePrev');

  // Clone the first and last slide so the track can loop seamlessly
  const realSlides = Array.from(track.querySelectorAll('.slide'));
  const firstClone = realSlides[0].cloneNode(true);
  const lastClone = realSlides[realSlides.length - 1].cloneNode(true);
  firstClone.removeAttribute('id');
  lastClone.removeAttribute('id');
  track.appendChild(firstClone);
  track.insertBefore(lastClone, realSlides[0]);

  const slides = track.querySelectorAll('.slide'); // real slides + 2 clones
  let current = 1; // start on the real first slide
  let autoplay;

  function setPosition(withTransition) {
    track.style.transition = withTransition ? '' : 'none';
    track.style.transform = `translateX(-${current * 100}%)`;
  }
  function setActive(i) {
    slides.forEach(s => s.classList.remove('active'));
    slides[i].classList.add('active');
  }
  function goTo(i) {
    current = i;
    setPosition(true);
    setActive(current);
  }
  function nextSlide() { goTo(current + 1); }
  function prevSlide() { goTo(current - 1); }
  function startAutoplay() { autoplay = setInterval(nextSlide, 5000); }
  function resetAutoplay() { clearInterval(autoplay); startAutoplay(); }

  // When the track lands on a clone, jump invisibly to the matching real slide
  track.addEventListener('transitionend', () => {
    if (current === slides.length - 1) { current = 1; setPosition(false); setActive(current); }
    else if (current === 0) { current = slides.length - 2; setPosition(false); setActive(current); }
  });

  setActive(current);
  setPosition(false);

  nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
  prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });
  slider.addEventListener('mouseenter', () => clearInterval(autoplay));
  slider.addEventListener('mouseleave', startAutoplay);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { nextSlide(); resetAutoplay(); }
    if (e.key === 'ArrowLeft') { prevSlide(); resetAutoplay(); }
  });

  // unified drag — mouse and touch both work
  let startX = 0, dragging = false, dragDelta = 0;
  function dragStart(x) { dragging = true; startX = x; clearInterval(autoplay); track.style.transition = 'none'; }
  function dragMove(x) {
    if (!dragging) return;
    dragDelta = x - startX;
    track.style.transform = `translateX(calc(-${current * 100}% + ${dragDelta}px))`;
  }
  function dragEnd() {
    if (!dragging) return;
    dragging = false;
    if (Math.abs(dragDelta) > 60) { dragDelta < 0 ? nextSlide() : prevSlide(); }
    else { goTo(current); }
    dragDelta = 0;
    resetAutoplay();
  }
  slider.addEventListener('touchstart', (e) => dragStart(e.touches[0].clientX));
  slider.addEventListener('touchmove', (e) => dragMove(e.touches[0].clientX));
  slider.addEventListener('touchend', dragEnd);
  slider.addEventListener('mousedown', (e) => { e.preventDefault(); dragStart(e.clientX); });
  window.addEventListener('mousemove', (e) => dragMove(e.clientX));
  window.addEventListener('mouseup', dragEnd);

  startAutoplay();
}


// Video page — pulls from Supabase 'videos' table (managed in admin/videos.html)
(async () => {
  const videoGrid = document.getElementById('videoGrid');
  if (!videoGrid) return;

  const { data: videos, error } = await supabaseClient
    .from('videos')
    .select('*')
    .order('position', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: true });

  if (error || !videos) return;

  videos.forEach((v, i) => {
    const card = document.createElement('a');
    card.href = `https://youtu.be/${v.youtube_id}`;
    card.target = '_blank';
    card.className = 'video-card';
    card.style.animationDelay = (0.3 + i * 0.1) + 's';
    card.innerHTML = `
      <div class="video-thumb">
        <img src="https://img.youtube.com/vi/${v.youtube_id}/hqdefault.jpg" alt="${v.title}" loading="lazy">
        <span class="video-play">▶</span>
        <span class="video-watch">Watch on YouTube</span>
      </div>
      <h3>${v.title}</h3>
      <p class="video-channel">${v.channel}</p>
    `;
    videoGrid.appendChild(card);
  });
})();

// Catalog pages (Singles / Collabs / Albums) — reads from Supabase 'songs' table
const catalogGrid = document.getElementById('catalogGrid');
if (catalogGrid) {
  const categoryByPage = { 'browse-singles': 'single', 'browse-collabs': 'collab', 'browse-albums': 'album' };
  // Cloudflare Pages strips .html from URLs in production, so match on the
  // filename without extension to work both locally and once deployed.
  const page = window.location.pathname.split('/').pop().replace(/\.html$/, '');
  const category = categoryByPage[page];

  (async () => {
    if (!category) return;
    const { data: songs, error } = await supabaseClient
      .from('songs')
      .select('*')
      .eq('category', category)
      .order('position', { ascending: true, nullsFirst: false });

    if (error || !songs) return;

    songs.forEach(s => {
      const card = document.createElement('a');
      card.className = 'catalog-card';
      card.href = s.link;
      card.target = '_blank';
      card.innerHTML = `
        <div class="catalog-cover"><img src="${s.cover_url}" alt="${s.title}"></div>
        <h3>${s.title}</h3>
        <p class="catalog-date">${s.year}</p>
      `;
      catalogGrid.appendChild(card);
    });
  })();
}

// Music page — keep the "Latest Release" slide in sync with whichever song is flagged in admin
(async () => {
  const titleEl = document.getElementById('latestReleaseTitle');
  const linkEl = document.getElementById('latestReleaseLink');
  if (!titleEl || !linkEl) return;

  const { data, error } = await supabaseClient
    .from('songs')
    .select('*')
    .eq('is_latest_release', true)
    .maybeSingle();

  if (error || !data) return;
  titleEl.textContent = data.title;
  linkEl.href = data.link;
})();


// ============================================================
// LIVE PERFORMANCES — admin-ready link list
// ------------------------------------------------------------
// Leave this array empty ( [] ) to keep showing the "Coming Soon"
// spotlight scene on live.html. The moment you add an entry here,
// the page automatically switches to a clean list of shows — no
// other file needs to change.
//
// Each entry looks like:
// {
//   title: 'OTEEZY Live at The Shrine',   // event name
//   venue: 'The Shrine, Lagos',           // venue / city
//   date: '2026-09-14',                   // ISO date (YYYY-MM-DD)
//   link: 'https://your-ticket-or-stream-link.com'
// }
// ============================================================
// ============================================================
// LIVE PERFORMANCES — loads from Supabase 'live_events' table
// Stays on the "Coming Soon" stage until an entry exists.
// ============================================================
(async () => {
  const stageScene = document.getElementById('stageScene');
  const liveEventsGrid = document.getElementById('liveEventsGrid');
  if (!stageScene || !liveEventsGrid) return;

  const { data: LIVE_EVENTS, error } = await supabaseClient
    .from('live_events')
    .select('*')
    .order('position', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: true });

  if (!error && LIVE_EVENTS && LIVE_EVENTS.length > 0) {
    stageScene.style.display = 'none';
    liveEventsGrid.style.display = 'block';
    const list = document.getElementById('liveEventsList');
    const monthNames = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    LIVE_EVENTS.forEach((ev, i) => {
      const d = ev.event_date ? new Date(ev.event_date + 'T00:00:00') : null;
      const day = d ? d.getDate() : '--';
      const mon = d ? monthNames[d.getMonth()] : '';
      const card = document.createElement('a');
      card.href = ev.link || '#';
      card.target = '_blank';
      card.className = 'live-event-card';
      card.style.animationDelay = (0.2 + i * 0.08) + 's';
      card.innerHTML = `
        <div class="live-event-date"><div class="day">${day}</div><div class="mon">${mon}</div></div>
        <div class="live-event-info">
          <h3>${ev.title || ''}</h3>
          <p class="live-event-venue">${ev.venue || ''}</p>
        </div>
        <span class="live-event-cta">Details →</span>
      `;
      list.appendChild(card);
    });
  } else {
    // Coming-soon spotlight interaction
    const stageOverlayMsg = document.getElementById('stageOverlayMsg');
    stageScene.addEventListener('click', (e) => {
      if (e.target.closest('.stage-overlay-msg') || stageScene.classList.contains('stage-active')) return;
      const stageFlash = document.getElementById('stageFlash');
      stageFlash.classList.add('flash');
      setTimeout(() => stageFlash.classList.remove('flash'), 500);
      stageScene.classList.add('stage-active');
      const rect = stageScene.getBoundingClientRect();
      const cx = rect.left + rect.width / 2,
        cy = rect.top + rect.height * 0.3;
      spawnSmoke(cx, cy, 24);
      setTimeout(() => { stageOverlayMsg.classList.add('show'); }, 2400);
    });
  }
})();


// ============================================================
// TOUR DATES — admin-ready link list
// ------------------------------------------------------------
// Leave this array empty ( [] ) to keep showing the "NO EVENTS AT
// THIS TIME" state on tour.html. The moment you add an entry here,
// the page automatically switches to a ticketed tour-date list —
// no other file needs to change.
//
// Each entry looks like:
// {
//   date: 'SEP 14, 2026',                 // shown as-is, any format
//   title: 'OTEEZY Live at The Shrine',    // event name
//   city: 'Lagos, Nigeria',                // venue / city
//   link: 'https://your-ticket-link.com'
// }
// ============================================================
(async () => {
  const tourEmptyView = document.getElementById('tourEmptyView');
  const tourListPage = document.getElementById('tourListPage');
  if (!tourEmptyView || !tourListPage) return;

  const { data: TOUR_DATES, error } = await supabaseClient
    .from('tour_events')
    .select('*')
    .order('created_at', { ascending: true });

  if (error || !TOUR_DATES || TOUR_DATES.length === 0) return; // stays on the "NO EVENTS" view

  tourEmptyView.style.display = 'none';
  tourListPage.style.display = 'block';
  const list = document.getElementById('tourDatesList');
  TOUR_DATES.forEach((t, i) => {
    const row = document.createElement('div');
    row.className = 'tour-date-row';
    row.style.animationDelay = (0.2 + i * 0.08) + 's';
        row.innerHTML = `
      <p class="td-date">${t.event_date || ''}</p>
      <div class="td-info">
        <h3>${t.title || ''}</h3>
        <p class="td-city">${t.city || ''}</p>
      </div>
      <a href="${t.ticket_link || '#'}" target="_blank" class="td-tix">Tickets</a>
    `;

    list.appendChild(row);
  });
})();


// Gallery — loads from Supabase 'gallery' table
(async () => {
  const galleryMasonry = document.getElementById('galleryMasonry');
  if (!galleryMasonry) return;
  
  const { data: photos, error } = await supabaseClient
    .from('gallery')
    .select('*')
    .order('position', { ascending: true, nullsFirst: false });
  
  if (error || !photos || photos.length === 0) return;
  
  photos.forEach((p, i) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.style.animationDelay = (0.1 + i * 0.05) + 's';
    item.innerHTML = `<img src="${p.image_url}" alt="${p.alt_text || ''}">`;
    galleryMasonry.appendChild(item);
  });
  
  const items = [...galleryMasonry.querySelectorAll('.gallery-item')];
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  let current = 0;
  
  function openLightbox(index) {
    current = index;
    lightboxImg.src = items[current].querySelector('img').src;
    lightbox.classList.add('open');
  }
  
  function showDelta(d) {
    current = (current + d + items.length) % items.length;
    lightboxImg.src = items[current].querySelector('img').src;
  }
  
  items.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));
  document.getElementById('lightboxClose').addEventListener('click', () => lightbox.classList.remove('open'));
  document.getElementById('lightboxPrev').addEventListener('click', () => showDelta(-1));
  document.getElementById('lightboxNext').addEventListener('click', () => showDelta(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('open'); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') lightbox.classList.remove('open');
    if (e.key === 'ArrowLeft') showDelta(-1);
    if (e.key === 'ArrowRight') showDelta(1);
  });
})();

// News page — fan sign-up, saves to Supabase 'subscribers' table
const newsForm = document.getElementById('newsForm');
if (newsForm) {
  newsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const statusEl = document.getElementById('formStatus');
    const fd = new FormData(newsForm);
    const payload = {
      first_name: fd.get('first_name') || null,
      email: fd.get('email'),
      whatsapp: fd.get('whatsapp') || null,

      date_of_birth: fd.get('date_of_birth') || null,
      country: fd.get('country') || null,
      whatsapp_opt_in: fd.get('whatsapp_opt_in') === 'on',
      email_opt_in: fd.get('email_opt_in') === 'on',
      consent: fd.get('consent') === 'on'
    };

        statusEl.textContent = 'Joining...';
    const { error } = await supabaseClient.from('subscribers').insert([payload]);

    if (error) {
      statusEl.textContent = "Something went wrong — please try again.";
      console.error(error);
    } else {
      window.location.href = 'success.html';
    }

  });
}
