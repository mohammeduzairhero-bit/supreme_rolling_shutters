if (!window.gsap) {
    const chain = { to() { return this; }, from() { return this; }, fromTo() { return this; }, set() { return this; }, add() { return this; }, call() { return this; }, play() { return this; }, pause() { return this; }, reverse() { return this; }, kill() { return this; }, eventCallback() { return this; }, progress() { return this; } };
    window.ScrollTrigger = window.ScrollTrigger || { refresh() { }, create() { return { kill() { } } } };
    window.gsap = { registerPlugin() { }, timeline() { return Object.create(chain) }, to() { return Object.create(chain) }, from() { return Object.create(chain) }, fromTo() { return Object.create(chain) }, set() { }, utils: { toArray(v) { return typeof v === "string" ? Array.from(document.querySelectorAll(v)) : Array.from(v || []) } } };
}
if (!window.ScrollTrigger) window.ScrollTrigger = { refresh() { }, create() { return { kill() { } } } };
gsap.registerPlugin(ScrollTrigger);

/* ── Preloader ── */
(function () {
    let pct = 0;
    const fill = document.getElementById('plFill');
    const pctEl = document.getElementById('plPct');
    const interval = setInterval(() => {
        pct += Math.random() * 18;
        if (pct >= 100) {
            pct = 100;
            clearInterval(interval);
            if (fill) fill.style.width = '100%';
            if (pctEl) pctEl.textContent = '100%';
            setTimeout(() => {
                gsap.to('#preloader', {
                    yPercent: -100, 
                    duration: 0.9, 
                    ease: 'power3.inOut',
                    onComplete: () => {
                        const pl = document.getElementById('preloader');
                        if (pl) pl.style.display = 'none';
                        initHeroAnim();
                    }
                });
            }, 350);
            return;
        }
        if (fill) fill.style.width = pct + '%';
        if (pctEl) pctEl.textContent = Math.floor(pct) + '%';
    }, 80);
})();

/* ── Cursor ── */
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

function handleMouseMove(e) {
    mx = e.clientX;
    my = e.clientY;
}
document.addEventListener('mousemove', handleMouseMove);

(function animCursor() {
    if (cursor && ring) {
        rx += (mx - rx) * 0.15;
        ry += (my - ry) * 0.15;
        cursor.style.left = mx + 'px';
        cursor.style.top = my + 'px';
        ring.style.left = rx + 'px';
        ring.style.top = ry + 'px';
    }
    requestAnimationFrame(animCursor);
})();

const hoverElements = ['a', 'button', '.product-card', '.why-item', '.faq-q', '.area-tag', '.metric-cell', '.pillar', '.craft-cell', '.swatch'];

function handleMouseEnter(e) {
    if (!cursor || !ring) return;
    cursor.style.width = '18px';
    cursor.style.height = '18px';
    ring.style.width = '54px';
    ring.style.height = '54px';
    ring.style.borderColor = 'rgba(232,0,15,0.8)';
}

function handleMouseLeave(e) {
    if (!cursor || !ring) return;
    cursor.style.width = '12px';
    cursor.style.height = '12px';
    ring.style.width = '38px';
    ring.style.height = '38px';
    ring.style.borderColor = 'rgba(232,0,15,0.5)';
}

function bindCursorHover() {
    const elements = document.querySelectorAll(hoverElements.join(', '));
    elements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
    });
}
bindCursorHover();

/* ── Nav scroll ── */
const navbar = document.getElementById('navbar');
let navScrolled = false;
window.addEventListener('scroll', () => {
    const didScroll = window.scrollY > 60;
    if (navbar && didScroll !== navScrolled) {
        navbar.classList.toggle('scrolled', didScroll);
        navScrolled = didScroll;
    }
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progressEl = document.getElementById("progress");
    if (progressEl && height > 0) {
        progressEl.style.width = (winScroll / height) * 100 + "%";
    }
});

/* ── Hero Animation ── */
function initHeroAnim() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('.hero-year', { opacity: 1, y: 0, duration: 0.8 })
        .to('.hero-h1', { opacity: 1, y: 0, duration: 1.1, stagger: 0.05 }, '-=0.4')
        .to('.hero-sub', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
        .to('.hero-cta-row', { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')
        .to('.hero-stats', { opacity: 1, x: 0, duration: 0.8 }, '-=0.5');
    animateCounters();
}

/* ── Scroll reveals ── */
function createReveal(selector, x = 0) {
    gsap.utils.toArray(selector).forEach(el => {
        const anim = { opacity: 0, x: x, y: x ? 0 : 40 };
        gsap.fromTo(el, anim, {
            opacity: 1, x: 0, y: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
        });
    });
}

function initScrollAnims() {
    createReveal('.reveal');
    createReveal('.reveal-left', -50);
    createReveal('.reveal-right', 50);
    
    document.querySelectorAll('.products-grid, .process-steps, .why-list, .area-stats, .metrics-strip').forEach(container => {
        const children = container.querySelectorAll('.stagger-child');
        gsap.fromTo(children, { opacity: 0, y: 35 }, {
            opacity: 1, y: 0, duration: 0.75, stagger: 0.12, ease: 'power3.out',
            scrollTrigger: { trigger: container, start: 'top 85%', toggleActions: 'play none none none' }
        });
    });
    
    document.querySelectorAll('.materials-layout .stagger-child').forEach((el, i) => {
        gsap.fromTo(el, { opacity: 0, x: -30 }, {
            opacity: 1, x: 0, duration: 0.7, delay: i * 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
        });
    });
}
initScrollAnims();

/* ── Reliable Counter Animation Helper ── */
function animateCounter(el, target, duration = 1.2) {
    if (!el || isNaN(target)) return;
    
    if (typeof gsap !== 'undefined') {
        const state = { count: 0 };
        gsap.to(state, {
            count: target,
            duration: duration,
            ease: 'power2.out',
            onUpdate: () => {
                el.textContent = Math.floor(state.count).toLocaleString('en-IN');
            },
            onComplete: () => {
                el.textContent = target.toLocaleString('en-IN');
            }
        });
    } else {
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 40));
        const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = current.toLocaleString('en-IN');
            if (current >= target) clearInterval(timer);
        }, 25);
    }
}

ScrollTrigger.create({
    trigger: '.craft-strip',
    start: 'top 80%',
    once: true,
    onEnter: () => {
        document.querySelectorAll('.craft-cell').forEach(cell => {
            cell.classList.add('in-view');
        });
    }
});

ScrollTrigger.create({
    trigger: '#showcase',
    start: 'top 80%',
    once: true,
    onEnter: () => {
        document.querySelectorAll('.showcase-counter').forEach(el => {
            const target = parseInt(el.dataset.target, 10);
            animateCounter(el, target);
        });
    }
});

function animateCounters() {
    document.querySelectorAll('#hero-stats-en .counter-num').forEach(el => {
        const target = parseInt(el.dataset.target, 10);
        if (!isNaN(target)) animateCounter(el, target);
    });
}

ScrollTrigger.create({
    trigger: '#service-area',
    start: 'top 80%',
    once: true,
    onEnter: () => {
        document.querySelectorAll('#service-area .counter-num').forEach(el => {
            const target = parseInt(el.dataset.target, 10);
            if (!isNaN(target)) animateCounter(el, target);
        });
    }
});

/* ── FAQ Accordion ── */
document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
        const item = q.parentElement;
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
    });
});

/* ── Hero Parallax ── */
gsap.to('.hero-h1', {
    y: -80, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
});

/* ── Section Labels & Titles ── */
gsap.utils.toArray('.section-title').forEach(el => {
    gsap.fromTo(el, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
    });
});
gsap.utils.toArray('.section-label').forEach(el => {
    gsap.fromTo(el, { opacity: 0, x: -20 }, {
        opacity: 1, x: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
    });
});

/* ── Form Submit ── */
function handleFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    const message = `New Shutter Inquiry\n\n` +
        `*Name:* ${data.name}\n` +
        `*Phone:* ${data.phone}\n` +
        `*Shutter Type:* ${data.shutter_type}\n` +
        `*Size:* ${data.size}\n` +
        `*Location:* ${data.location}\n` +
        `*Details:* ${data.details || 'Not provided'}`;

    const whatsappUrl = `https://wa.me/919894861777?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    const submitBtn = event.target.querySelector('.form-submit');
    const isTa = (localStorage.getItem('supreme-lang') === 'ta');
    submitBtn.innerHTML = isTa ? '<i class="fas fa-check"></i> வணக்கம் — நாங்கள் அழைப்போம்!' : '<i class="fas fa-check"></i> Inquiry Sent — We\'ll Call You!';
    submitBtn.style.background = '#28a745';
    submitBtn.disabled = true;

    setTimeout(() => {
        event.target.reset();
        submitBtn.innerHTML = isTa ? '<i class="fas fa-paper-plane"></i> விவரங்களை அனுப்பவும்' : '<i class="fas fa-paper-plane"></i> Send Inquiry';
        submitBtn.style.background = '';
        submitBtn.disabled = false;
    }, 5000);
}

/* ── PRICE CALCULATOR DATA ── */
const PRICES = {
    manual: [
        { label: 'MS Rolling Shutter', labelTa: 'எம்.எஸ் ரோலிங் ஷட்டர்', rate: 220 },
        { label: 'GI Colour Coated', labelTa: 'ஜி.ஐ வண்ண பூசப்பட்டது', rate: 310 },
        { label: 'GI Colour Coated Jumbo (5" leaf)', labelTa: 'ஜி.ஐ ஜம்போ (5 அங்குலம்)', rate: 330 },
        { label: 'MS Perforated', labelTa: 'எம்.எஸ் துளையிடப்பட்டது', rate: 240 },
        { label: 'GI Colour Perforated', labelTa: 'ஜி.ஐ வண்ண துளையிடப்பட்டது', rate: 330 },
        { label: 'Aluminium', labelTa: 'அலுமினியம்', rate: 850 },
        { label: 'Polycarbonate', labelTa: 'பாலிகார்பனேட்', rate: 1000 }
    ],
    gear: [
        { label: 'MS Rolling Shutter', labelTa: 'எம்.எஸ் ரோலிங் ஷட்டர்', rate: 320 },
        { label: 'GI Colour Coated', labelTa: 'ஜி.ஐ வண்ண பூசப்பட்டது', rate: 410 },
        { label: 'GI Jumbo (5" leaf)', labelTa: 'ஜி.ஐ ஜம்போ (5 அங்குலம்)', rate: 430 },
        { label: 'MS Perforated', labelTa: 'எம்.எஸ் துளையிடப்பட்டது', rate: 340 },
        { label: 'GI Colour Perforated', labelTa: 'ஜி.ஐ வண்ண துளையிடப்பட்டது', rate: 430 },
        { label: 'Aluminium', labelTa: 'அலுமினியம்', rate: 1000 },
        { label: 'Polycarbonate', labelTa: 'பாலிகார்பனேட்', rate: 1200 }
    ],
    motor: [
        { label: 'MS Rolling Shutter', labelTa: 'எம்.எஸ் ரோலிங் ஷட்டர்', rate: 470 },
        { label: 'GI Colour Coated', labelTa: 'ஜி.ஐ வண்ண பூசப்பட்டது', rate: 550 },
        { label: 'GI Jumbo (5" leaf)', labelTa: 'ஜி.ஐ ஜம்போ (5 அங்குலம்)', rate: 580 },
        { label: 'MS Perforated', labelTa: 'எம்.எஸ் துளையிடப்பட்டது', rate: 490 },
        { label: 'GI Colour Perforated', labelTa: 'ஜி.ஐ வண்ண துளையிடப்பட்டது', rate: 570 },
        { label: 'Aluminium', labelTa: 'அலுமினியம்', rate: 1200 },
        { label: 'Polycarbonate', labelTa: 'பாலிகார்பனேட்', rate: 1500 }
    ]
};
const OP_LABELS = { manual: 'Manual (Push)', gear: 'Gear Operated', motor: 'Motor (Automatic)' };
const OP_LABELS_TA = { manual: 'மேனுவல் புஷ் (Normal)', gear: 'கியர் இயக்கப்பட்டது', motor: 'தானியங்கி மோட்டார்' };

function calcPopulateMat() {
    const op = document.getElementById('c-op').value;
    const sel = document.getElementById('c-mat');
    const isTa = (localStorage.getItem('supreme-lang') === 'ta');
    sel.innerHTML = `<option value="">${isTa ? 'வகையைத் தேர்ந்தெடுக்கவும்…' : 'Select type…'}</option>`;
    if (!op) return;
    const prices = PRICES[op];
    for (let i = 0; i < prices.length; i++) {
        const item = prices[i];
        const option = document.createElement('option');
        option.value = item.rate;
        const activeLabel = isTa ? item.labelTa : item.label;
        option.setAttribute('data-label', item.label);
        option.setAttribute('data-label-ta', item.labelTa);
        option.textContent = activeLabel + '  —  ₹' + item.rate + (isTa ? '/ச.அடி' : '/sqft');
        sel.appendChild(option);
    }
    const cRes = document.getElementById('c-res');
    if (cRes) cRes.classList.remove('show');
    const cIdle = document.getElementById('c-idle');
    if (cIdle) cIdle.style.display = 'flex';
    bindCursorHover();
}

function calcRun() {
    const op = document.getElementById('c-op').value;
    const matSel = document.getElementById('c-mat');
    const rate = parseFloat(matSel.value);
    const w = parseFloat(document.getElementById('c-w').value);
    const h = parseFloat(document.getElementById('c-h').value);
    const err = document.getElementById('c-err');
    const isTa = (localStorage.getItem('supreme-lang') === 'ta');

    if (!op || !rate || !w || !h || w <= 0 || h <= 0) {
        if (err) err.classList.add('show');
        return;
    }
    if (err) err.classList.remove('show');
    const area = w * h, total = Math.round(area * rate);

    const selectedOpt = matSel.options[matSel.selectedIndex];
    const matLabel = isTa ? selectedOpt.getAttribute('data-label-ta') : selectedOpt.getAttribute('data-label');
    const opLabel = isTa ? OP_LABELS_TA[op] : OP_LABELS[op];

    document.getElementById('c-total').textContent = total.toLocaleString('en-IN');
    document.getElementById('c-rate').textContent = rate.toLocaleString('en-IN');
    document.getElementById('c-sqft').textContent = area.toFixed(2) + (isTa ? ' ச.அடி' : ' sqft');
    document.getElementById('c-sw').textContent = w + (isTa ? ' அடி' : ' ft');
    document.getElementById('c-sh').textContent = h + (isTa ? ' அடி' : ' ft');
    document.getElementById('c-sop').textContent = opLabel;
    document.getElementById('c-smat').textContent = matLabel;

    const waMsg = encodeURIComponent(' *Supreme Rolling Shutters — Price Enquiry*\n\n *Type:* ' + selectedOpt.getAttribute('data-label') + '\n *Operation:* ' + OP_LABELS[op] + '\n *Size:* ' + w + 'ft × ' + h + 'ft (' + area.toFixed(2) + ' sqft)\n *Estimated Cost:* ₹' + total.toLocaleString('en-IN') + '\n\nPlease arrange a free site visit to confirm the final quote.');
    document.getElementById('c-wa').href = 'https://wa.me/919894861777?text=' + waMsg;
    document.getElementById('c-idle').style.display = 'none';
    const res = document.getElementById('c-res');
    res.classList.remove('show');
    void res.offsetWidth;
    res.classList.add('show');
}

document.querySelectorAll('#c-w, #c-h').forEach(el => el.addEventListener('keydown', e => {
    if (e.key === 'Enter') calcRun();
}));

/* ── Extras setup ── */
const _btt = document.getElementById('btt-btn');
if (_btt) {
    window.addEventListener('scroll', () => _btt.classList.toggle('show', scrollY > 500), { passive: true });
}

/* ── Button tilt effect ── */
document.querySelectorAll('.btn-primary, .btn-outline, .form-submit, .calc-submit, .wa-btn').forEach(btn => {
    btn.addEventListener('mousemove', function (e) {
        const r = this.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        this.style.transform = `translate(${dx * 0.15}px, ${dy * 0.15}px)`;
    });
    btn.addEventListener('mouseleave', function () { this.style.transform = ''; });
});

/* ── Trust bar reveal ── */
(function () {
    const tb = document.getElementById('trustBar');
    if (!tb) return;
    const io = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) { tb.classList.add('tb-visible'); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(tb);
})();

/* ── Comparison table reveal ── */
(function () {
    const table = document.getElementById('cmpTable');
    if (!table) return;
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const bars = table.querySelectorAll('.cmp-bar');

    const io = new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting) return;
        rows.forEach((row, i) => {
            setTimeout(() => row.classList.add('row-visible'), i * 90);
        });
        setTimeout(() => {
            bars.forEach(b => b.classList.add('animated'));
        }, rows.length * 90 + 100);
        io.disconnect();
    }, { threshold: 0.15 });

    io.observe(table);
})();

/* ── GSAP advanced animations ── */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    ['#testimonials', '#compare'].forEach(sel => {
        const title = document.querySelector(sel + ' .section-title');
        if (title) gsap.to(title, { yPercent: -8, ease: 'none', scrollTrigger: { trigger: sel, start: 'top bottom', end: 'bottom top', scrub: 1.5 } });
    });
    gsap.fromTo('.testi-card', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: '#testimonials', start: 'top 80%', once: true } });
}

/* ── Nav link additions ── */
(function () {
    const ul = document.querySelector('.nav-links');
    if (!ul) return;
    const cta = ul.querySelector('li:last-child');
    [{ href: '#testimonials', label: 'Reviews', id: 'nav-link-reviews' }, { href: '#compare', label: 'Compare', id: 'nav-link-compare' }].forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.href;
        a.textContent = item.label;
        a.id = item.id;
        li.appendChild(a);
        ul.insertBefore(li, cta);
    });
})();

/* ── Scroll spy navigation ── */
(function () {
    const allSections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(a => {
                    const active = a.getAttribute('href') === '#' + entry.target.id;
                    a.style.color = active ? '#FFD700' : '';
                });
            }
        });
    }, { threshold: 0.4 });
    allSections.forEach(s => io.observe(s));
})();

/* ── Shutter type image switcher ── */
function updateShutter(type, label, element) {
    const imgEl = document.getElementById('main-shutter-img');
    const badge = document.getElementById('type-badge');
    const isTa = (localStorage.getItem('supreme-lang') === 'ta');

    let activeLabel = label;
    if (isTa) {
        if (type === 'manual') activeLabel = 'மேனுவல் முறை';
        if (type === 'gear') activeLabel = 'கியர் அமைப்பு';
        if (type === 'motor') activeLabel = 'மின்சார மோட்டார்';
    }

    if (typeof gsap !== 'undefined') {
        gsap.to(imgEl, {
            opacity: 0, duration: 0.2, onComplete: () => {
                if (type === 'manual') imgEl.src = 'manual-shutter.png';
                if (type === 'gear') imgEl.src = 'gear-shutter.png';
                if (type === 'motor') imgEl.src = 'motor-shutter.png';
                if (badge) badge.innerText = activeLabel;
                gsap.to(imgEl, { opacity: 1, duration: 0.4 });
            }
        });
    } else {
        imgEl.style.opacity = '0';
        setTimeout(() => {
            if (type === 'manual') imgEl.src = 'manual-shutter.png';
            if (type === 'gear') imgEl.src = 'gear-shutter.png';
            if (type === 'motor') imgEl.src = 'motor-shutter.png';
            if (badge) badge.innerText = activeLabel;
            imgEl.style.opacity = '1';
        }, 200);
    }
    document.querySelectorAll('.config-btn').forEach(btn => btn.classList.remove('active'));
    if (element) element.classList.add('active');
}

function applyTint(degrees) {
    const imgEl = document.getElementById('main-shutter-img');
    if (!imgEl) return;
    if (typeof gsap !== 'undefined') {
        gsap.to(imgEl, { filter: `hue-rotate(${degrees}deg) saturate(0.8)`, duration: 0.5 });
    } else {
        imgEl.style.filter = `hue-rotate(${degrees}deg) saturate(0.8)`;
    }
}

/* ── Before/After Slider ── */
(function initBeforeAfter() {
    const sliders = document.querySelectorAll('.ba-slider-wrap');
    sliders.forEach(slider => {
        const after = slider.querySelector('.ba-after');
        const handle = slider.querySelector('.ba-handle');
        const divider = slider.querySelector('.ba-divider');
        let isDragging = false;

        function updateSlider(x) {
            const rect = slider.getBoundingClientRect();
            let pos = ((x - rect.left) / rect.width) * 100;
            pos = Math.max(0, Math.min(100, pos));
            if (after) after.style.clipPath = `inset(0 0 0 ${pos}%)`;
            if (handle) handle.style.left = pos + '%';
            if (divider) divider.style.left = pos + '%';
        }

        slider.addEventListener('mousedown', (e) => { isDragging = true; updateSlider(e.clientX); });
        document.addEventListener('mousemove', (e) => { if (!isDragging) return; updateSlider(e.clientX); });
        document.addEventListener('mouseup', () => { isDragging = false; });
        slider.addEventListener('touchstart', (e) => { isDragging = true; updateSlider(e.touches[0].clientX); });
        document.addEventListener('touchmove', (e) => { if (!isDragging) return; updateSlider(e.touches[0].clientX); });
        document.addEventListener('touchend', () => { isDragging = false; });
    });
})();

/* ── Service Map District Data ── */
const districtData = {
    rajapalayam: {
        enDesc: "Our headquarters and primary fabrication unit. Fastest response time, largest inventory, and direct access to our senior technicians.",
        taDesc: "எங்கள் தலைமையகம் மற்றும் முதன்மை உற்பத்தி பிரிவு. அதிவேக பதிலளிப்பு நேரம், மிகப்பெரிய இருப்பு மற்றும் எங்கள் மூத்த தொழில்நுட்ப வல்லுநர்களின் நேரடி அணுகல்.",
        response: "2hr", responseTa: "2 மணி நேரம்"
    },
    madurai: {
        enDesc: "Branch office with full installation capabilities. Serves central Tamil Nadu with dedicated stock and service team.",
        taDesc: "முழு நிறுவல் திறன்களைக்கொண்ட கிளை அலுவலகம். அர்ப்பணிக்கப்பட்ட இருப்பு மற்றும் சேவைக் குழுவுடன் மத்திய தமிழ்நாட்டுக்கு சேவை செய்கிறது.",
        response: "4hr", responseTa: "4 மணி நேரம்"
    },
    chennai: {
        enDesc: "Metropolitan coverage with commercial and industrial focus. Regular dispatch from Rajapalayam HQ.",
        taDesc: "வணிக மற்றும் தொழில்துறை மையத்துடன் பெருநகர கவரேஜ். ராஜபாளையம் தலைமையகத்தில் இருந்து வழக்கமான விநியோகம்.",
        response: "24hr", responseTa: "24 மணி நேரம்"
    },
    coimbatore: {
        enDesc: "Western Tamil Nadu hub. Strong presence in textile, manufacturing, and retail sectors.",
        taDesc: "மேற்கு தமிழ்நாடு மையம். ஜவுளி, உற்பத்தி மற்றும் சில்லறை விற்பனைத் துறைகளில் வலுவான இருப்பு.",
        response: "12hr", responseTa: "12 மணி நேரம்"
    },
    trichy: {
        enDesc: "Central region coverage. Popular among warehouses, godowns, and industrial clients.",
        taDesc: "மத்திய பிராந்திய கவரேஜ். கிடங்குகள், கோடவுன்கள் மற்றும் தொழில்துறை வாடிக்கையாளர்கள் மத்தியில் பிரபலமானது.",
        response: "8hr", responseTa: "8 மணி நேரம்"
    },
    salem: {
        enDesc: "Steel city installations with emphasis on heavy-duty and fire-rated shutters.",
        taDesc: "ஹெவி-டியூட்டி மற்றும் ஃபயர்-ரேட்டட் ஷட்டர்களுக்கு முக்கியத்துவம் அளிக்கும் எஃகு நகர நிறுவல்கள்.",
        response: "10hr", responseTa: "10 மணி நேரம்"
    },
    tirunelveli: {
        enDesc: "Southern district served directly from Rajapalayam HQ. High satisfaction in retail segment.",
        taDesc: "தெற்கு மாவட்டம் ராஜபாளையம் தலைமையகத்தில் இருந்து நேரடியாக சேவை செய்யப்படுகிறது. சில்லறை விற்பனை பிரிவில் அதிக திருப்தி.",
        response: "6hr", responseTa: "6 மணி நேரம்"
    },
    vellore: {
        enDesc: "Northern Tamil Nadu reach. Growing presence in commercial and pharmaceutical sectors.",
        taDesc: "வடக்கு தமிழ்நாடு கவரேஜ். வணிக மற்றும் மருந்துத்துறைகளில் வளர்ந்து வரும் இருப்பு.",
        response: "18hr", responseTa: "18 மணி நேரம்"
    }
};

/* ── Map District Click Handler ── */
(function initServiceMap() {
    const districts = document.querySelectorAll('.map-district');
    const defaultCard = document.getElementById('map-default-card');
    const districtCard = document.getElementById('map-district-card');

    districts.forEach(district => {
        district.addEventListener('click', function () {
            const name = this.dataset.district;
            const installs = this.dataset.installs;
            const clients = this.dataset.clients;
            const data = districtData[name];
            const isTa = (localStorage.getItem('supreme-lang') === 'ta');

            districts.forEach(d => d.classList.remove('active'));
            this.classList.add('active');

            const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
            let taFormattedName = formattedName;
            if (name === 'rajapalayam') taFormattedName = 'ராஜபாளையம்';
            if (name === 'madurai') taFormattedName = 'மதுரை';
            if (name === 'chennai') taFormattedName = 'சென்னை';
            if (name === 'coimbatore') taFormattedName = 'கோயம்புத்தூர்';
            if (name === 'trichy') taFormattedName = 'திருச்சி';
            if (name === 'salem') taFormattedName = 'சேலம்';
            if (name === 'tirunelveli') taFormattedName = 'திருநெல்வேலி';
            if (name === 'vellore') taFormattedName = 'வேலூர்';

            document.getElementById('district-name').textContent = isTa ? taFormattedName : formattedName;
            document.getElementById('district-desc').textContent = isTa ? data.taDesc : data.enDesc;
            document.getElementById('district-installs').textContent = installs;
            document.getElementById('district-clients').textContent = clients;
            document.getElementById('district-response').textContent = isTa ? data.responseTa : data.response;

            document.getElementById('district-cta').innerHTML = isTa
                ? `${taFormattedName} இல் மேற்கோள் பெறவும் <i class="fas fa-arrow-right"></i>`
                : `Get Quote in ${formattedName} <i class="fas fa-arrow-right"></i>`;

            if (defaultCard) defaultCard.style.display = 'none';
            if (districtCard) {
                districtCard.style.display = 'block';
                setTimeout(() => { districtCard.classList.add('show'); }, 50);
            }
        });
    });
})();

/* ── TRANSLATION ENGINE ── */
function translatePage(lang) {
    const isTa = (lang === 'ta');
    localStorage.setItem('supreme-lang', lang);

    const setText = (selector, enText, taText) => {
        const el = document.querySelector(selector);
        if (el) el.textContent = isTa ? taText : enText;
    };
    const setHtml = (selector, enHtml, taHtml) => {
        const el = document.querySelector(selector);
        if (el) el.innerHTML = isTa ? taHtml : enHtml;
    };

    setHtml('.nav-logo', 'Supreme<span>.</span>', 'சுப்ரீம்<span>.</span>');
    const navLinks = document.querySelectorAll('.nav-links a');
    const navTexts = isTa
        ? ['தயாரிப்புகள்', 'செயல்முறை', 'பொருட்கள்', 'ஏன் நாங்கள்', 'விலை கணக்கீடு', 'மதிப்புரைகள்', 'ஒப்பீடு', 'மேற்கோள் பெறுக']
        : ['Products', 'Process', 'Materials', 'Why Us', 'Price Calc', 'Reviews', 'Compare', 'Get Quote'];
    navLinks.forEach((a, i) => { if (navTexts[i]) a.textContent = navTexts[i]; });

    setText('.hero-year',
        'EST. 2003 · RAJAPALAYAM & MADURAI & BANGALORE · PAN SOUTH INDIA DISTRIBUTION',
        'தொடக்கம் 2003 · ராஜபாளையம் & மதுரை & பெங்களூர் · தென்னிந்தியா முழுவதும் விநியோகம்'
    );
    setHtml('.hero-h1',
        `<div>SUPREME</div><div class="outline">ROLLING</div><div>SHUTTERS</div>`,
        `<div>சுப்ரீம்</div><div class="outline">ரோலிங்</div><div>ஷட்டர்கள்</div>`
    );
    setText('.hero-sub',
        'Premium motorized & manual rolling shutters — engineered for strength, installed for life. Headquartered in Rajapalayam with a branch in Madurai and Bangalore, distributing all across south india.',
        'பிரீமியம் மோட்டார் மற்றும் மேனுவல் ரோலிங் ஷட்டர்கள் — வலிமைக்காக வடிவமைக்கப்பட்டு, வாழ்நாள் முழுவதும் நிறுவப்பட்டது. ராஜபாளையத்தில் தலைமையகம் மற்றும் மதுரை மற்றும் பெங்களூரில் கிளை, தென்னிந்தியா முழுவதும் விநியோகம்.'
    );
    setHtml('.hero-cta-row .btn-primary', 'Get a Free Quote <i class="fas fa-arrow-right"></i>', 'இலவச மேற்கோள் பெறுக <i class="fas fa-arrow-right"></i>');
    setText('.hero-cta-row .btn-outline', 'View Products', 'தயாரிப்புகளைக் காண்க');

    const heroStatLabels = document.querySelectorAll('.hero-stat-label');
    const heroStatTexts = isTa ? ['செயலில் உள்ள ஆண்டுகள்', 'நிறுவல்கள்', 'வருட உத்தரவாதம்'] : ['Years Active', 'Installations', 'Year Warranty'];
    heroStatLabels.forEach((lbl, i) => { if (heroStatTexts[i]) lbl.textContent = heroStatTexts[i]; });

    calcPopulateMat();
    bindCursorHover();
}

function switchLang(lang) {
    document.querySelectorAll('#lang-toggle .lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    translatePage(lang);
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('supreme-lang') || 'en';
    switchLang(savedLang);
});
