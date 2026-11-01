/* Enhancements: accessibility, skip link, language fixes, image placeholders, reveal animations */

function __initEnhance() {
    /* ── skip link + landmark ── */
    const skip = document.createElement('a'); skip.href = '#products'; skip.className = 'skip-link'; skip.textContent = 'Skip to content';
    document.body.prepend(skip);

    /* ── failsafe: never trap visitors behind the preloader ── */
    setTimeout(() => {
        const p = document.getElementById('preloader');
        if (p && p.style.display !== 'none') {
            p.style.display = 'none';
            document.querySelectorAll('.hero-year,.hero-h1,.hero-sub,.hero-cta-row,.hero-stats').forEach(e => { e.style.opacity = 1; e.style.transform = 'none' });
        }
    }, 6000);

    /* ── lazy-load images ── */
    document.querySelectorAll('img').forEach(i => { if (!i.hasAttribute('loading')) i.loading = 'lazy'; i.decoding = 'async' });

    /* ── tel: links for phone numbers ── */
    const callTel = document.querySelector('.callout-tel');
    if (callTel) callTel.innerHTML = '<a href="tel:+919894861777" style="color:inherit;text-decoration:none">📞 98948 61777</a>';
    const fp = document.querySelector('.footer-phone');
    if (fp) fp.innerHTML = '<a href="tel:+919894861777" style="color:inherit;text-decoration:none">98948 61777</a> &nbsp;|&nbsp; <a href="tel:+919486321681" style="color:inherit;text-decoration:none">94863 21681</a>';

    /* ── floating call button ── */
    const call = document.createElement('a'); call.id = 'call-float'; call.href = 'tel:+919894861777'; call.title = 'Call us';
    call.setAttribute('aria-label', 'Call Supreme Rolling Shutters'); call.innerHTML = '<i class="fas fa-phone-alt"></i>';
    document.body.appendChild(call);

    /* ── mobile menu ── */
    const nav = document.getElementById('navbar') || document.querySelector('nav'), menu = document.createElement('div');
    menu.id = 'mobile-menu'; document.body.appendChild(menu);
    const burger = document.createElement('button'); burger.className = 'nav-burger';
    burger.setAttribute('aria-label', 'Open menu'); burger.setAttribute('aria-expanded', 'false');
    burger.innerHTML = '<i class="fas fa-bars"></i>'; if (nav) nav.appendChild(burger);
    function setMenu(open) {
        if (open) {
            menu.innerHTML = '';
            document.querySelectorAll('.nav-links a').forEach(a => {
                const l = document.createElement('a'); l.href = a.getAttribute('href'); l.textContent = a.textContent;
                l.addEventListener('click', () => setMenu(false)); menu.appendChild(l);
            });
        }
        menu.classList.toggle('open', open); burger.setAttribute('aria-expanded', open);
        burger.innerHTML = open ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        document.body.style.overflow = open ? 'hidden' : '';
    }
    burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false) });
    window.addEventListener('resize', () => { if (innerWidth > 900) setMenu(false) });

    /* ── accessible FAQ ── */
    document.querySelectorAll('.faq-q').forEach(q => {
        q.setAttribute('role', 'button'); q.tabIndex = 0; q.setAttribute('aria-expanded', 'false');
        const sync = () => q.setAttribute('aria-expanded', q.parentElement.classList.contains('open'));
        q.addEventListener('click', () => setTimeout(() => document.querySelectorAll('.faq-q').forEach(x => x.setAttribute('aria-expanded', x.parentElement.classList.contains('open'))), 0));
        q.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); q.click(); } });
    });

    /* ── keep <html lang> in sync with the language toggle ── */
    const _sw = window.switchLang;
    window.switchLang = function (l) { document.documentElement.lang = (l === 'ta') ? 'ta' : 'en'; return _sw(l); };
    document.documentElement.lang = (localStorage.getItem('supreme-lang') === 'ta') ? 'ta' : 'en';

    /* ── shutter configurator: built-in fallback art if the PNGs are missing ── */
    function shutterSVG(type) {
        let s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 400"><rect width="480" height="400" fill="#0a0a0a"/>'
            + '<rect x="60" y="40" width="360" height="40" rx="6" fill="#3a3a3a"/><rect x="50" y="36" width="380" height="8" fill="#555"/>'
            + '<rect x="70" y="80" width="340" height="290" fill="#161616"/>';
        for (let y = 84; y < 360; y += 16)s += '<rect x="74" y="' + y + '" width="332" height="13" rx="2" fill="hsl(42,75%,' + (46 + ((y / 16) % 2) * 5) + '%)"/>';
        s += '<rect x="64" y="362" width="352" height="14" rx="3" fill="#777"/>';
        if (type === 'gear') s += '<circle cx="445" cy="110" r="22" fill="none" stroke="#FFD700" stroke-width="5" stroke-dasharray="7 5"/><circle cx="445" cy="110" r="6" fill="#FFD700"/>';
        if (type === 'motor') s += '<rect x="395" y="48" width="48" height="26" rx="4" fill="#FFD700"/><path d="M425 52l-9 12h7l-4 9 12-13h-8z" fill="#000"/>';
        return 'data:image/svg+xml;utf8,' + encodeURIComponent(s + '</svg>');
    }
    const cfg = document.getElementById('main-shutter-img');
    if (cfg) {
        cfg.addEventListener('error', () => {
            if (cfg.src.startsWith('data:')) return;
            const m = (cfg.getAttribute('src') || '').match(/(manual|gear|motor)/); cfg.src = shutterSVG(m ? m[1] : 'manual');
        });
        if (cfg.complete && cfg.naturalWidth === 0) cfg.dispatchEvent(new Event('error'));
    }

    /* ── calculator: GST toggle, live recalculation, cost breakdown, copy ── */
    const form = document.querySelector('.calc-form');
    if (form) {
        const row = document.createElement('label'); row.className = 'calc-gst';
        row.innerHTML = '<input type="checkbox" id="c-gst"> Add 18% GST to estimate';
        form.querySelector('.calc-err').before(row);
        const ids = ['c-op', 'c-mat', 'c-w', 'c-h', 'c-gst'];
        let calculated = false;
        const run = () => {
            const w = +c('c-w').value, h = +c('c-h').value;
            if (c('c-op').value && c('c-mat').value && w > 0 && h > 0) { calcRun(); calculated = true; }
        };
        function c(id) { return document.getElementById(id) }
        ids.forEach(id => c(id).addEventListener('input', () => { if (calculated || id === 'c-w' || id === 'c-h') run(); }));
        c('c-mat').addEventListener('change', () => { if (calculated) run(); });

        const res = c('c-res'), bd = document.createElement('div'); bd.className = 'res-breakdown';
        res.querySelector('.res-divider').before(bd);
        const act = document.createElement('div'); act.className = 'res-actions';
        const wa = c('c-wa'); wa.parentNode.insertBefore(act, wa); act.appendChild(wa);
        const cp = document.createElement('button'); cp.type = 'button'; cp.className = 'wa-btn'; cp.innerHTML = '<i class="far fa-copy"></i> Copy';
        act.appendChild(cp);

        const tot = c('c-total'); let base = 0;
        new MutationObserver(() => {
            const sq = parseFloat(c('c-sqft').textContent), rate = parseFloat(c('c-rate').textContent.replace(/,/g, ''));
            if (!sq || !rate) return;
            base = Math.round(sq * rate);
            const gst = c('c-gst').checked, g = Math.round(base * .18), final = gst ? base + g : base;
            if (!mutLock) { mutLock = true; tot.textContent = final.toLocaleString('en-IN'); mutLock = false; }
            bd.innerHTML = 'Supply + install: <b>₹' + base.toLocaleString('en-IN') + '</b>' + (gst ? ' &nbsp;·&nbsp; GST 18%: <b>₹' + g.toLocaleString('en-IN') + '</b>' : '');
            const url = new URL(wa.href), t = url.searchParams.get('text') || '';
            wa.href = 'https://wa.me/919894861777?text=' + encodeURIComponent(t.replace(/Estimated Cost:\*? ?₹[\d,]+/, 'Estimated Cost:* ₹' + final.toLocaleString('en-IN')));
        }).observe(tot, { childList: true, characterData: true, subtree: true });
        let mutLock = false;
        cp.addEventListener('click', () => {
            const txt = 'Supreme Rolling Shutters estimate: ₹' + tot.textContent + ' (' + c('c-sw').textContent + ' × ' + c('c-sh').textContent + ', ' + c('c-smat').textContent + ', ' + c('c-sop').textContent + '). Final price after free site visit. Call 98948 61777.';
            (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => { cp.innerHTML = '<i class="fas fa-check"></i> Copied'; setTimeout(() => cp.innerHTML = '<i class="far fa-copy"></i> Copy', 2000) }).catch(() => { });
        });
    }

    /* ── contact form: phone sanity check ── */
    const ph = document.querySelector('.contact-form input[name="phone"]');
    if (ph) { ph.setAttribute('pattern', '^[+]?[0-9 ]{10,14}$'); ph.setAttribute('inputmode', 'tel'); ph.setAttribute('title', 'Enter a valid 10-digit mobile number'); }

    /* ── fix: Tamil placeholder typo ── */
    const loc = document.getElementsByName('location')[0];
    if (loc) new MutationObserver(() => { if (loc.placeholder.includes('சிவகasi')) loc.placeholder = loc.placeholder.replace('சிவகasi', 'சிவகாசி') }).observe(loc, { attributes: true, attributeFilter: ['placeholder'] });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', __initEnhance); else __initEnhance();

function __initPolish() {
    /* ═══ 1) PUT YOUR IMAGES HERE — leave '' to keep the placeholder ═══ */
    const IMAGES = {
        'material': '',   // 4:5 portrait, ~800×1000
        'ba1-before': 'before1.png', 'ba1-after': 'after1.jpeg',   // Raja Textiles   (4:3, ~1200×900)
        'ba2-before': 'before2.png', 'ba2-after': 'after2.jpeg',   // Sri Krishna Pharma
        'ba3-before': 'before3.png', 'ba3-after': 'after3.jpeg',   // Lakshmi Crackers Godown
        'ba4-before': 'before4.png', 'ba4-after': 'after4.jpeg',   // Fashion Hub Boutique
        'cfg-manual': '', 'cfg-gear': '', 'cfg-motor': ''  // transparent PNG, ~900×750
    };

    /* placeholder artwork */
    const NAMES = { 'material': 'Workshop / Fabrication', 'cfg-manual': 'Manual Push Shutter', 'cfg-gear': 'Gear Box Shutter', 'cfg-motor': 'Electric Motor Shutter' };
    function art(slot, w, h, after) {
        const label = (NAMES[slot] || slot.replace(/^ba(\d)-(before|after)$/, (m, n, s) => 'Project ' + n + ' · ' + s.toUpperCase())).toUpperCase();
        const c = after ? '#FFD700' : '#8a8a8a';
        const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '"><defs><pattern id="p" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="22" height="22" fill="' + (after ? '#13110a' : '#0d0d0d') + '"/><rect width="2" height="22" fill="' + (after ? '#2a2308' : '#1a1a1a') + '"/></pattern></defs>'
            + '<rect width="100%" height="100%" fill="url(#p)"/><rect x="14" y="14" width="' + (w - 28) + '" height="' + (h - 28) + '" fill="none" stroke="' + c + '" stroke-opacity=".55" stroke-dasharray="10 8" stroke-width="2"/>'
            + '<g transform="translate(' + (w / 2) + ',' + (h / 2 - 26) + ')" fill="none" stroke="' + c + '" stroke-width="3" stroke-linejoin="round"><rect x="-38" y="-28" width="76" height="56" rx="6"/><circle cx="-16" cy="-10" r="7"/><path d="M-38 20l24-22 18 16 12-10 22 16"/></g>'
            + '<text x="50%" y="' + (h / 2 + 34) + '" fill="' + c + '" font-family="monospace" font-size="' + Math.max(14, w / 38) + '" letter-spacing="4" text-anchor="middle" font-weight="700">' + label + '</text>'
            + '<text x="50%" y="' + (h / 2 + 34 + Math.max(22, w / 32)) + '" fill="#666" font-family="monospace" font-size="' + Math.max(11, w / 54) + '" letter-spacing="3" text-anchor="middle">IMAGE PLACEHOLDER · ' + w + ' × ' + h + '</text></svg>';
        return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    }
    function apply(img, slot, w, h, after) {
        img.dataset.slot = slot; img.title = 'Image slot: ' + slot; img.alt = NAMES[slot] || ('Image slot ' + slot); img.removeAttribute('srcset');
        img.src = IMAGES[slot] || art(slot, w, h, after);
    }

    /* material photo */
    const mat = document.querySelector('.material-visual img'); if (mat) apply(mat, 'material', 800, 1000);
    /* before / after sliders */
    document.querySelectorAll('.ba-slider-wrap').forEach(s => {
        const n = s.dataset.slider;
        const b = s.querySelector('.ba-before'), a = s.querySelector('.ba-after');
        if (b) apply(b, 'ba' + n + '-before', 1200, 900, false);
        if (a) apply(a, 'ba' + n + '-after', 1200, 900, true);
    });
    /* configurator — intercept the .png names set by updateShutter() */
    const cfg = document.getElementById('main-shutter-img');
    if (cfg) {
        const fix = () => {
            const cur = cfg.getAttribute('src') || '';
            if (cur === cfg.dataset.applied) return;
            const m = cur.match(/(manual|gear|motor)-shutter\.png$/); if (!m) return;
            const slot = 'cfg-' + m[1]; cfg.dataset.slot = slot; cfg.alt = NAMES[slot];
            const out = IMAGES[slot] || art(slot, 900, 750, true); cfg.dataset.applied = out; cfg.src = out;
        };
        new MutationObserver(fix).observe(cfg, { attributes: true, attributeFilter: ['src'] }); fix();
        cfg.style.filter = 'hue-rotate(0deg)';
    }
    /* any other <img> that slipped through */
    document.querySelectorAll('img:not([data-slot]):not(#main-shutter-img)').forEach((img, i) => apply(img, 'image-' + (i + 1), 1200, 900));

    /* click a placeholder → copies its slot name */
    const note = document.createElement('div'); note.className = 'ph-note'; document.body.appendChild(note);
    document.addEventListener('dblclick', e => {
        const i = e.target.closest && e.target.closest('img[data-slot]'); if (!i) return;
        note.textContent = 'SLOT: ' + i.dataset.slot; note.classList.add('show'); setTimeout(() => note.classList.remove('show'), 2200);
    });

    /* spotlight follows the pointer */
    document.querySelectorAll('.product-card,.metric-cell,.pillar,.area-stat,.map-stat-card,.testi-card').forEach(el => {
        el.addEventListener('pointermove', e => {
            const r = el.getBoundingClientRect();
            el.style.setProperty('--mx', (e.clientX - r.left) + 'px'); el.style.setProperty('--my', (e.clientY - r.top) + 'px');
        });
    });

    /* gentle 3D tilt on product cards (desktop only) */
    if (matchMedia('(hover:hover) and (pointer:fine)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
        document.querySelectorAll('.product-card').forEach(el => {
            el.addEventListener('pointermove', e => {
                const r = el.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
                el.style.transform = 'perspective(900px) rotateX(' + (-y * 5) + 'deg) rotateY(' + (x * 6) + 'deg) translateY(-8px)';
            });
            el.addEventListener('pointerleave', () => el.style.transform = '');
        });
    }

    /* reveal for sections that had no entrance animation */
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: .12 });
    document.querySelectorAll('.trust-item,.warranty-icon-item,.ba-caption,.cmp-outer,.branch-card,.contact-row,.config-controls').forEach(el => { el.classList.add('rv'); io.observe(el) });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', __initPolish); else __initPolish();
