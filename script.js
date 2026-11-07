if (!window.gsap) {
    const chain = { to() { return this; }, from() { return this; }, fromTo() { return this; }, set() { return this; }, add() { return this; }, call() { return this; }, play() { return this; }, pause() { return this; }, reverse() { return this; }, kill() { return this; }, eventCallback() { return this; }, progress() { return this; } };
    window.ScrollTrigger = window.ScrollTrigger || { refresh() { }, create() { return { kill() { } } } };
    window.gsap = { registerPlugin() { }, timeline() { return Object.create(chain) }, to() { return Object.create(chain) }, from() { return Object.create(chain) }, fromTo() { return Object.create(chain) }, set() { }, utils: { toArray(v) { return typeof v === "string" ? Array.from(document.querySelectorAll(v)) : Array.from(v || []) } } };
}
if (!window.ScrollTrigger) window.ScrollTrigger = { refresh() { }, create() { return { kill() { } } };
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
    if (!sel) return;
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

    // 1. Navigation
    setHtml('.nav-logo', 'Supreme<span>.</span>', 'சுப்ரீம்<span>.</span>');
    const navLinks = document.querySelectorAll('.nav-links a');
    const navTexts = isTa
        ? ['தயாரிப்புகள்', 'செயல்முறை', 'பொருட்கள்', 'ஏன் நாங்கள்', 'விலை கணக்கீடு', 'மதிப்புரைகள்', 'ஒப்பீடு', 'மேற்கோள் பெறுக']
        : ['Products', 'Process', 'Materials', 'Why Us', 'Price Calc', 'Reviews', 'Compare', 'Get Quote'];
    navLinks.forEach((a, i) => { if (navTexts[i]) a.textContent = navTexts[i]; });

    // 2. Hero Section
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

    // 3. Marquee
    const marqueeSpans = document.querySelectorAll('.marquee-track span:not(.sep)');
    const marqueeTextsEn = ['Motorized Shutters', 'Gear Shutters', 'Manual Shutters', 'GI Grade Steel', 'Polycarbonate', '5 Year Warranty', 'Rajapalayam HQ', 'Bangalore Branch', 'Madurai Branch', 'Pan south india', 'Free Site Visit', '22 Years Expert'];
    const marqueeTextsTa = ['மோட்டார் ஷட்டர்கள்', 'கியர் ஷட்டர்கள்', 'மேனுவல் ஷட்டர்கள்', 'ஜிஐ கிரேடு ஸ்டீல்', 'பாலிகார்பனேட்', '5 வருட உத்தரவாதம்', 'ராஜபாளையம் தலைமையகம்', 'பெங்களூர் கிளை', 'மதுரை கிளை', 'தென்னிந்தியா முழுவதும்', 'இலவச தள வருகை', '22 ஆண்டுகள் நிபுணத்துவம்'];
    marqueeSpans.forEach((span) => {
        const text = span.textContent.trim();
        let idx = marqueeTextsEn.indexOf(text);
        if (idx === -1) idx = marqueeTextsTa.indexOf(text);
        if (idx !== -1) span.textContent = isTa ? marqueeTextsTa[idx % 12] : marqueeTextsEn[idx % 12];
    });

    // 4. Metrics Strip
    const metricEyebrows = document.querySelectorAll('.metric-eyebrow');
    const metricLabels = document.querySelectorAll('.metric-label');
    if (isTa) {
        if (metricEyebrows[0]) metricEyebrows[0].textContent = 'நிறுவப்பட்டது';
        if (metricEyebrows[1]) metricEyebrows[1].textContent = 'நிறுவல்கள்';
        if (metricEyebrows[2]) metricEyebrows[2].textContent = 'விநியோகம்';
        if (metricEyebrows[3]) metricEyebrows[3].textContent = 'உத்தரவாதம்';
        if (metricLabels[0]) metricLabels[0].textContent = 'ராஜபாளையம் & விருதுநகர் மாவட்டத்திற்கு தடைபடாத சேவை';
        if (metricLabels[1]) metricLabels[1].textContent = 'கடைகள், கிடங்குகள், தொழிற்சாலைகள் & வீடுகளில் நிறுவப்பட்ட ஷட்டர்கள்';
        if (metricLabels[2]) metricLabels[2].textContent = 'தென்னிந்தியாவின் அனைத்து மாவட்டங்களுக்கும் சேவை — தலைமையகம் ராஜபாளையம், கிளை மதுரை & பெங்களூர்';
        if (metricLabels[3]) metricLabels[3].textContent = 'உதிரி பாகங்கள் மற்றும் உழைப்புக்கு முழு உத்தரவாதம் — அனைத்து கோரிக்கைகளும் தீர்க்கப்படும்';
        setHtml('#dist-metric-text', 'தென்னிந்தியா<span style="font-size:1.6rem;color:var(--gold);">முழுவதும்</span>');
    } else {
        if (metricEyebrows[0]) metricEyebrows[0].textContent = 'Founded';
        if (metricEyebrows[1]) metricEyebrows[1].textContent = 'Installations';
        if (metricEyebrows[2]) metricEyebrows[2].textContent = 'Distribution';
        if (metricEyebrows[3]) metricEyebrows[3].textContent = 'Warranty';
        if (metricLabels[0]) metricLabels[0].textContent = 'Years of uninterrupted service to Rajapalayam & Virudhunagar district';
        if (metricLabels[1]) metricLabels[1].textContent = 'Shutters installed across shops, warehouses, factories & residences';
        if (metricLabels[2]) metricLabels[2].textContent = 'All districts of south india covered — HQ Rajapalayam, Branch Madurai, secondary branch bangalore';
        if (metricLabels[3]) metricLabels[3].textContent = 'Full parts & labour warranty — every claim resolved, no exceptions';
        setHtml('#dist-metric-text', 'south india<span style="font-size:2rem;color:var(--gold);">wide</span>');
    }

    // 5. Our Story Section
    setText('#showcase .legacy-kicker', 'Our Story', 'எங்கள் கதை');
    setHtml('#showcase .legacy-heading', 'Two Decades of<br><em>Steel &amp; Trust</em>', 'இரண்டு தசாப்த கால<br><em>இரும்பு &amp; நம்பிக்கை</em>');
    const legacyBodies = document.querySelectorAll('#showcase .legacy-body');
    if (legacyBodies.length >= 2) {
        if (isTa) {
            legacyBodies[0].textContent = '2003 இல் நிறுவப்பட்ட சுப்ரீம் ரோலிங் ஷட்டர்கள், தரமான தயாரிப்பு மற்றும் நேர்மையான சேவை பிரிக்க முடியாதவை என்ற ஒரு கொள்கையின் கீழ் உருவாக்கப்பட்டது. ராஜபாளையத்தில் ஒரு சிறிய பட்டறையாகத் தொடங்கியது இன்று தென்னிந்தியாவின் நம்பகமான பிராண்டாக வளர்ந்துள்ளது.';
            legacyBodies[1].textContent = 'நாங்கள் தயாரிக்கும் ஒவ்வொரு ஷட்டரும் அளவீடு செய்யப்பட்டு, எங்களது சொந்த பட்டறையில் வடிவமைக்கப்பட்டு, எங்களது நிரந்தர குழுவால் நிறுவப்படுகிறது. 5 வருட முழு உத்தரவாதத்துடன் வருகிறது. எந்தவொரு சமரசங்களும் இல்லை.';
        } else {
            legacyBodies[0].textContent = 'Established in 2003, Supreme Rolling Shutters was built on a single conviction — that quality fabrication and honest service are inseparable. What began as a modest workshop in Rajapalayam has grown into south india\'s trusted shutter brand, with a dedicated branch in Madurai, Bangalore and distribution reaching all districts of south india.';
            legacyBodies[1].textContent = 'Every shutter we manufacture is custom-built — measured on-site, fabricated in our own workshop, installed by our permanent team, and backed by a comprehensive 5-year warranty. No subcontracting. No shortcuts. No compromises.';
        }
    }
    setText('#showcase .sig-text', 'Supreme Rolling Shutters · Est. 2003, Rajapalayam', 'சுப்ரீம் ரோலிங் ஷட்டர்கள் · தொடக்கம் 2003, ராஜபாளையம்');

    // 6. Section Labels & Group Titles
    const sectionLabels = document.querySelectorAll('.section-label');
    const sectionTitles = document.querySelectorAll('.section-title');
    const labelsEn = ['What We Offer', 'Materials We Trust & Use', 'How It Works', 'Why Supreme', 'Where We Serve', 'Common Questions', 'Instant Estimate', 'Get In Touch', 'Real Transformations', 'Service & Installation', 'Client Reviews', 'Product Comparison', 'Product Lab'];
    const labelsTa = ['நாங்கள் வழங்குபவை', 'நாங்கள் நம்பும் பொருட்கள்', 'செயல்முறை முறை', 'ஏன் சுப்ரீம்', 'எங்கள் சேவை பகுதிகள்', 'பொதுவான கேள்விகள்', 'உடனடி கணக்கீடு', 'தொடர்பு கொள்ள', 'உண்மையான மாற்றங்கள்', 'சேவை & நிறுவல்', 'வாடிக்கையாளர் மதிப்புரைகள்', 'தயாரிப்பு ஒப்பீடு', 'தயாரிப்பு பரிசோதனைக்கூடம்'];

    sectionLabels.forEach(lbl => {
        const txt = lbl.textContent.trim();
        const idx = labelsEn.indexOf(txt);
        if (idx !== -1) lbl.textContent = isTa ? labelsTa[idx] : labelsEn[idx];
    });

    if (isTa) {
        if (sectionTitles[0]) sectionTitles[0].innerHTML = 'எங்கள் ஷட்டர் <em>தயாரிப்பு</em> வகைகள்';
        if (sectionTitles[1]) sectionTitles[1].innerHTML = 'நாங்கள் நம்பி <em>பயன்படுத்தும்</em> பொருட்கள்';
        if (sectionTitles[2]) sectionTitles[2].innerHTML = 'எங்கள் <em>5-படி</em> நிறுவல் செயல்முறை';
        if (sectionTitles[3]) sectionTitles[3].innerHTML = 'வாடிக்கையாளர்கள் எங்களை <em>தேர்ந்தெடுக்க</em> காரணங்கள்';
        if (sectionTitles[4]) sectionTitles[4].innerHTML = 'தென்னிந்தியா முழுவதும் <em>விநியோகம்</em>';
        if (sectionTitles[5]) sectionTitles[5].innerHTML = 'அடிக்கடி <em>கேட்கப்படுபவை</em>';
        if (sectionTitles[6]) sectionTitles[6].innerHTML = 'விலை <em>கணக்கீடு</em>';
        if (sectionTitles[7]) sectionTitles[7].innerHTML = 'இலவச <em>மேற்கோள்</em> கோரவும்';
        if (sectionTitles[8]) sectionTitles[8].innerHTML = 'நிறுவலுக்கு <em>முன் &amp; பின்</em>';
        if (sectionTitles[9]) sectionTitles[9].innerHTML = 'உங்கள் ஷட்டர் நிறுவலைத் <em>திட்டமிடுங்கள்</em>';
        if (sectionTitles[10]) sectionTitles[10].innerHTML = 'வாடிக்கையாளர்கள் எங்களை <em>பற்றி</em> கூறுவது';
        if (sectionTitles[11]) sectionTitles[11].innerHTML = 'எந்த ஷட்டர் உங்களுக்கு <em>ஏற்றது?</em>';
        if (sectionTitles[12]) sectionTitles[12].innerHTML = 'உங்கள் <em>சுப்ரீம்</em> ஷட்டரை வடிவமைக்கவும்';
    } else {
        if (sectionTitles[0]) sectionTitles[0].innerHTML = 'Our <em>Shutter</em><br>Product Range';
        if (sectionTitles[1]) sectionTitles[1].innerHTML = 'Materials We<br><em>Trust &amp; Use</em>';
        if (sectionTitles[2]) sectionTitles[2].innerHTML = 'Our <em>5-Step</em><br>Installation Process';
        if (sectionTitles[3]) sectionTitles[3].innerHTML = 'Reasons Clients<br><em>Choose Us</em>';
        if (sectionTitles[4]) sectionTitles[4].innerHTML = 'Pan south india<br><em>Distribution</em>';
        if (sectionTitles[5]) sectionTitles[5].innerHTML = 'Frequently<br><em>Asked</em>';
        if (sectionTitles[6]) sectionTitles[6].innerHTML = 'Price <em>Calculator</em>';
        if (sectionTitles[7]) sectionTitles[7].innerHTML = 'Request a<br><em>Free Quote</em>';
        if (sectionTitles[8]) sectionTitles[8].innerHTML = 'Before &amp; After<br><em>Installations</em>';
        if (sectionTitles[9]) sectionTitles[9].innerHTML = 'Plan Your<br><em>Shutter Installation</em>';
        if (sectionTitles[10]) sectionTitles[10].innerHTML = 'What Clients<br><em>Say About Us</em>';
        if (sectionTitles[11]) sectionTitles[11].innerHTML = 'Which Shutter<br><em>Suits You?</em>';
        if (sectionTitles[12]) sectionTitles[12].innerHTML = 'Configure Your <em>Supreme</em> Shutter';
    }

    // 7. Shutter Product Cards
    const prodNames = document.querySelectorAll('#products .product-name');
    const prodDescs = document.querySelectorAll('#products .product-desc');
    if (isTa) {
        if (prodNames[0]) prodNames[0].textContent = 'மோட்டார் ஷட்டர்கள்';
        if (prodDescs[0]) prodDescs[0].textContent = 'ரிமோட் கண்ட்ரோல் மற்றும் சுவிட்ச் மூலம் இயக்கப்படும் முழு தானியங்கி ரோலிங் ஷட்டர்கள். வணிக ஷோரூம்கள் மற்றும் பெரிய நுழைவாயில்களுக்கு வசதியானது.';
        if (prodNames[1]) prodNames[1].textContent = 'கியர் ஷட்டர்கள்';
        if (prodDescs[1]) prodDescs[1].textContent = 'மின்சாரம் தேவையின்றி மென்மையான கைமுறை இயக்கத்தை வழங்கும் மெக்கானிக்கல் கியர் ஷட்டர்கள். கடைகள் மற்றும் கேரேஜ்களுக்கு ஏற்றது.';
        if (prodNames[2]) prodNames[2].textContent = 'சாதாரண / புஷ் ஷட்டர்கள்';
        if (prodDescs[2]) prodDescs[2].textContent = 'கிளாசிக் புஷ்-அப் ரோலிங் ஷட்டர்கள் — குறைந்த செலவு, நீடித்த உழைப்பு மற்றும் நேரடியாக இயக்கக்கூடியவை.';
        if (prodNames[3]) prodNames[3].textContent = 'உயர் பாதுகாப்பு ஷட்டர்கள்';
        if (prodDescs[3]) prodDescs[3].textContent = 'ஆண்டி-லிப்ட் பூட்டுகள் மற்றும் சேதப்படுத்த முடியாத வடிவமைப்புடன் கூடுதல் வலுவூட்டப்பட்ட ஷட்டர்கள். வங்கிகள் மற்றும் நகைக்கடைகளுக்கு ஏற்றது.';
        if (prodNames[4]) prodNames[4].textContent = 'பாலிகார்பனேட் ஷட்டர்கள்';
        if (prodDescs[4]) prodDescs[4].textContent = 'பாதுகாப்பைப் பேணுகையில் இயற்கை ஒளி ஊடுருவலுக்கான வெளிப்படையான பாலிகார்பனேட் ஷட்டர்கள்.';
    } else {
        if (prodNames[0]) prodNames[0].textContent = 'Motorized Shutters';
        if (prodDescs[0]) prodDescs[0].textContent = 'Fully automated rolling shutters with remote control & switch operation. Ideal for commercial showrooms, warehouses, and large openings where convenience is paramount.';
        if (prodNames[1]) prodNames[1].textContent = 'Gear Shutters';
        if (prodDescs[1]) prodDescs[1].textContent = 'Mechanical gear-driven shutters offering smooth manual operation without electricity dependency. Perfect for shops, garages, and medium-sized openings requiring reliable daily use.';
        if (prodNames[2]) prodNames[2].textContent = 'Normal / Push Shutters';
        if (prodDescs[2]) prodDescs[2].textContent = 'Classic push-up rolling shutters — cost-effective, durable, and straightforward to operate. Suitable for small shops, storage rooms, and residential applications.';
        if (prodNames[3]) prodNames[3].textContent = 'High-Security Shutters';
        if (prodDescs[3]) prodDescs[3].textContent = 'Extra-reinforced shutters with anti-lift locks and tamper-resistant design. Built for banks, jewellery stores, pharmacies, and any premises requiring maximum protection.';
        if (prodNames[4]) prodNames[4].textContent = 'Polycarbonate Shutters';
        if (prodDescs[4]) prodDescs[4].textContent = 'Transparent or semi-transparent polycarbonate slat shutters for natural light penetration while maintaining security. Ideal for display windows and showroom fronts.';
    }

    // 8. Materials Section
    const matNames = document.querySelectorAll('#materials .material-name');
    const matDescs = document.querySelectorAll('#materials .material-desc');
    if (isTa) {
        if (matNames[0]) matNames[0].textContent = 'கால்வனேற்றப்பட்ட இரும்பு (GI)';
        if (matDescs[0]) matDescs[0].textContent = 'துருப்பிடிக்காத மற்றும் உறுதியான கட்டமைப்பு வலிமையை வழங்கும் ஹாட்-டிப் கால்வனேற்றப்பட்ட இரும்பு தாள்.';
        if (matNames[1]) matNames[1].textContent = 'உயர் ரக எஃகு (Steel)';
        if (matDescs[1]) matDescs[1].textContent = 'அதிக இழுவிசை வலிமைக்காக வெப்ப-சிகிச்சை செய்யப்பட்ட எஃகு தாள். தொழில்துறை பயன்பாடுகளுக்கு சிறந்தது.';
        if (matNames[2]) matNames[2].textContent = 'பாலிகார்பனேட் (Polycarbonate)';
        if (matDescs[2]) matDescs[2].textContent = 'கண்ணாடியை விட 250 மடங்கு அதிக வலிமை கொண்ட உடையாத வெளிப்படையான பேனல்கள்.';
        if (matNames[3]) matNames[3].textContent = 'துருப்பிடிக்காத எஃகு (Stainless Steel)';
        if (matDescs[3]) matDescs[3].textContent = 'மருந்து மற்றும் உணவு பதப்படுத்தும் கூடங்களுக்குத் தேவையான சுகாதாரமான மற்றும் அதிக அரிப்பு எதிர்ப்பு கொண்ட SS 304/316 விருப்பங்கள்.';
        setText('#mat-visual-label-id', '— தொழில்துறை தர உற்பத்தி');
    } else {
        if (matNames[0]) matNames[0].textContent = 'Galvanised Iron (GI)';
        if (matDescs[0]) matDescs[0].textContent = 'Hot-dip galvanised iron sheets offering superior rust resistance and structural rigidity. Our most popular material for long-lasting, corrosion-free shutters in all weather conditions.';
        if (matNames[1]) matNames[1].textContent = 'High-Grade Steel';
        if (matDescs[1]) matDescs[1].textContent = 'Cold-rolled steel slats heat-treated for maximum tensile strength. Provides excellent dent and impact resistance — preferred for industrial and high-security applications.';
        if (matNames[2]) matNames[2].textContent = 'Polycarbonate';
        if (matDescs[2]) matDescs[2].textContent = 'Virtually unbreakable transparent panels with 250x the impact resistance of glass. Naturally UV-stabilised to prevent yellowing, maintaining clarity for years.';
        if (matNames[3]) matNames[3].textContent = 'Stainless Steel';
        if (matDescs[3]) matDescs[3].textContent = 'Food-grade SS 304 and SS 316 options available for pharmaceutical, food processing, and coastal environments requiring hygiene and maximum corrosion resistance.';
        setText('#mat-visual-label-id', '— Industrial Quality Fabrication');
    }

    // 9. 5-Step Process
    const stepTitles = document.querySelectorAll('#process .step-title');
    const stepDescs = document.querySelectorAll('#process .step-desc');
    if (isTa) {
        if (stepTitles[0]) stepTitles[0].textContent = 'விசாரணை & ஆலோசனை';
        if (stepDescs[0]) stepDescs[0].textContent = 'எங்களை அழைக்கவும் அல்லது வாட்ஸ்அப் செய்யவும். உங்கள் ஷட்டர் தேவைகளை நாங்கள் புரிந்து கொள்கிறோம்.';
        if (stepTitles[1]) stepTitles[1].textContent = 'இலவச தள வருகை';
        if (stepDescs[1]) stepDescs[1].textContent = 'எங்களது தொழில்நுட்ப வல்லுநர் உங்கள் தளத்தைப் பார்வையிட்டு, துல்லியமான அளவீடுகளை எடுக்கிறார்.';
        if (stepTitles[2]) stepTitles[2].textContent = 'விலை மேற்கோள்';
        if (stepDescs[2]) stepDescs[2].textContent = 'நாங்கள் ஒரு வெளிப்படையான மேற்கோளை வழங்குகிறோம். மறைமுக கட்டணங்கள் எதுவும் இல்லை.';
        if (stepTitles[3]) stepTitles[3].textContent = 'உற்பத்தி செயல்முறை';
        if (stepDescs[3]) stepDescs[3].textContent = 'ஷட்டர்கள் எங்களது சொந்த பட்டறையில் துல்லியமான விவரக்குறிப்புகளுக்கு ஏற்ப உருவாக்கப்படுகின்றன.';
        if (stepTitles[4]) stepTitles[4].textContent = 'நிறுவல் & உத்தரவாதம்';
        if (stepDescs[4]) stepDescs[4].textContent = 'எங்களது தொழில்முறை குழுவின் நிறுவலைத் தொடர்ந்து 5 வருட சேவை உத்தரவாதம் வழங்கப்படுகிறது.';
    } else {
        if (stepTitles[0]) stepTitles[0].textContent = 'Inquiry & Consultation';
        if (stepDescs[0]) stepDescs[0].textContent = 'Call or WhatsApp us. We understand your requirement — shutter type, size, material, and application.';
        if (stepTitles[1]) stepTitles[1].textContent = 'Free Site Visit';
        if (stepDescs[1]) stepDescs[1].textContent = 'Our technician visits your site, takes precise measurements and assesses the structural requirements.';
        if (stepTitles[2]) stepTitles[2].textContent = 'Quotation';
        if (stepDescs[2]) stepDescs[2].textContent = 'We provide a transparent, itemised quote. No hidden charges — material, fabrication, and fitting all included.';
        if (stepTitles[3]) stepTitles[3].textContent = 'Fabrication';
        if (stepDescs[3]) stepDescs[3].textContent = 'Shutters are custom-fabricated in our workshop to exact specifications — cut, welded, and quality-checked.';
        if (stepTitles[4]) stepTitles[4].textContent = 'Install & Warranty';
        if (stepDescs[4]) stepDescs[4].textContent = 'Professional installation by our team followed by full operational testing and 5-year service warranty.';
    }

    // 10. Why Us Section
    const whyTitles = document.querySelectorAll('#why .why-item-title');
    const whyDescs = document.querySelectorAll('#why .why-item-desc');
    if (isTa) {
        if (whyTitles[0]) whyTitles[0].textContent = '22 ஆண்டுகள் உள்ளூர் நிபுணத்துவம்';
        if (whyDescs[0]) whyDescs[0].textContent = '2003 இல் நிறுவப்பட்ட நாங்கள், ராஜபாளையம் மற்றும் அதைச் சுற்றியுள்ள பகுதிகளில் 10,000+ ஷட்டர்களை நிறுவியுள்ளோம்.';
        if (whyTitles[1]) whyTitles[1].textContent = '5 வருட முழு சேவை உத்தரவாதம்';
        if (whyDescs[1]) whyDescs[1].textContent = 'ஒவ்வொரு நிறுவலும் பாகங்கள் மற்றும் உழைப்பு இரண்டையும் உள்ளடக்கிய 60 மாத விரிவான உத்தரவாதத்துடன் வருகிறது.';
        if (whyTitles[2]) whyTitles[2].textContent = 'தனிப்பயன் உற்பத்தி — எந்த அளவிலும்';
        if (whyDescs[2]) whyDescs[2].textContent = 'சிறிய கடைகள் முதல் 30 அடி தொழில்துறை கதவுகள் வரை, துல்லியமான அளவீடுகளுக்கு ஏற்ப உருவாக்குகிறோம்.';
        if (whyTitles[3]) whyTitles[3].textContent = 'வெளிப்படையான விலையிடல்';
        if (whyDescs[3]) whyDescs[3].textContent = 'பொருள் செலவுகள், போக்குவரத்து மற்றும் நிறுவல் கட்டணங்கள் தெளிவாக பிரிக்கப்பட்டு வெளிப்படையாக இருக்கும்.';
        if (whyTitles[4]) whyTitles[4].textContent = 'நிறுவலுக்குப் பின் ஆதரவு';
        if (whyDescs[4]) whyDescs[4].textContent = 'அவசர முறிவு வருகைகள் மற்றும் வருடாந்திர பராமரிப்பு சேவைகளை நாங்கள் தொடர்ந்து வழங்குகிறோம்.';
        setText('#why .callout-big', 'இலவச தள வருகை & மதிப்பீடு');
        setText('#why .callout-sub', 'எங்கள் அனுபவம் வாய்ந்த தொழில்நுட்ப வல்லுநர் உங்கள் தளத்தைப் பார்வையிட்டு, இலவசமாக எழுத்துப்பூர்வ மேற்கோளை வழங்குவார்.');
    } else {
        if (whyTitles[0]) whyTitles[0].textContent = '22 Years of Local Expertise';
        if (whyDescs[0]) whyDescs[0].textContent = 'Founded in 2003, we have installed over 10k+ shutters across Rajapalayam and the surrounding district. Our team knows local building codes, climate demands, and customer expectations inside out.';
        if (whyTitles[1]) whyTitles[1].textContent = '5 Year Full Service Warranty';
        if (whyDescs[1]) whyDescs[1].textContent = 'Every installation comes with a 60-month comprehensive warranty covering both parts and labour. If anything fails within the warranty period, we fix it — no questions asked.';
        if (whyTitles[2]) whyTitles[2].textContent = 'Custom Fabrication — Any Size';
        if (whyDescs[2]) whyDescs[2].textContent = 'From small 4-foot shop openings to 30-foot industrial warehouse doors, we custom fabricate every shutter to precise measurements. No off-the-shelf compromise.';
        if (whyTitles[3]) whyTitles[3].textContent = 'Transparent Pricing';
        if (whyDescs[3]) whyDescs[3].textContent = 'We provide detailed, itemised quotations before work begins. Material costs, fabrication, transport, and installation fees are clearly broken down — no surprise charges at handover.';
        if (whyTitles[4]) whyTitles[4].textContent = 'Post-Installation Support';
        if (whyDescs[4]) whyDescs[4].textContent = 'Our relationship doesn\'t end at installation. We offer annual maintenance contracts, spare parts supply, and emergency breakdown visits to keep your shutters running for decades.';
        setText('#why .callout-big', 'FREE SITE VISIT & ESTIMATE');
        setText('#why .callout-sub', 'No obligation. Our experienced technician will visit your site, measure, assess, and provide a detailed written quotation — completely free of charge.');
    }

    // 11. Warranty Band
    setText('.warranty-band .warranty-text', '5 YEAR FULL WARRANTY — PARTS & LABOUR INCLUDED', '5 வருட முழு உத்தரவாதம் — பாகங்கள் & உழைப்பு கட்டணம் அடங்கும்');
    const warrantySpans = document.querySelectorAll('.warranty-icon-item span');
    if (isTa) {
        if (warrantySpans[0]) warrantySpans[0].textContent = 'இலவச பழுது';
        if (warrantySpans[1]) warrantySpans[1].textContent = 'பாகங்கள் கவரேஜ்';
        if (warrantySpans[2]) warrantySpans[2].textContent = 'தொலைபேசி ஆதரவு';
        if (warrantySpans[3]) warrantySpans[3].textContent = 'தள வருகை';
    } else {
        if (warrantySpans[0]) warrantySpans[0].textContent = 'Free Repairs';
        if (warrantySpans[1]) warrantySpans[1].textContent = 'Parts Covered';
        if (warrantySpans[2]) warrantySpans[2].textContent = 'Phone Support';
        if (warrantySpans[3]) warrantySpans[3].textContent = 'On-Site Visit';
    }

    // 12. Calculator
    const calcLabels = document.querySelectorAll('#calculator label');
    if (isTa) {
        if (calcLabels[0]) calcLabels[0].textContent = 'இயக்க முறை';
        if (calcLabels[1]) calcLabels[1].textContent = 'பொருள் / ஷட்டர் வகை';
        if (calcLabels[2]) calcLabels[2].textContent = 'அகலம் (அடி)';
        if (calcLabels[3]) calcLabels[3].textContent = 'உயரம் (அடி)';
        setText('.calc-sub-desc', 'உடனடி செலவு மதிப்பீட்டைப் பெற உங்கள் ஷட்டர் வகை மற்றும் அளவை உள்ளிடவும். தமிழ்நாடு, புதுச்சேரி, கேரளா, கர்நாடகா & ஆந்திராவிற்கு பொருந்தும்.');
        setText('#c-idle p', 'இயக்க முறை & பொருளைத் தேர்ந்தெடுத்து, அளவை உள்ளிட்டு கணக்கிடவும்');
        setHtml('#calc-note-box', '<strong>பொருந்தும் பகுதிகள்:</strong> தமிழ்நாடு · புதுச்சேரி · கேரளா · கர்நாடகா · ஆந்திரா<br>விலையில் பொருட்கள் + நிறுவல் கட்டணம் அடங்கும். நேரடி ஆய்வுக்குப் பின் இறுதி விலை முடிவு செய்யப்படும்.');
        setHtml('#calc-run-btn-txt', '<i class="fas fa-calculator"></i> விலையைக் கணக்கிடவும்');
        setText('#calculator .calc-err', '⚠ கணக்கிடுவதற்கு முன் அனைத்து விவரங்களையும் நிரப்பவும்.');
    } else {
        if (calcLabels[0]) calcLabels[0].textContent = 'Operation Type';
        if (calcLabels[1]) calcLabels[1].textContent = 'Material / Shutter Type';
        if (calcLabels[2]) calcLabels[2].textContent = 'Width (Feet)';
        if (calcLabels[3]) calcLabels[3].textContent = 'Height (Feet)';
        setText('.calc-sub-desc', 'Enter your shutter type and size to get an instant cost estimate. Valid for Tamil Nadu, Puducherry & Kerala & karnataka & andhra.');
        setText('#c-idle p', 'Select operation & material,\nenter size, then calculate');
        setHtml('#calc-note-box', '<strong>Applicable regions:</strong> Tamil Nadu &nbsp;·&nbsp; Puducherry &nbsp;·&nbsp; Kerala &nbsp;·&nbsp; karnataka &nbsp;·&nbsp; andhra<br>Rates include supply + installation. Final quote after free site visit.');
        setHtml('#calc-run-btn-txt', '<i class="fas fa-calculator"></i> Calculate My Price');
        setText('#calculator .calc-err', '⚠ Please fill all fields before calculating.');
    }

    const cOp = document.getElementById('c-op');
    if (cOp && cOp.options.length >= 4) {
        cOp.options[0].textContent = isTa ? 'இயக்க முறையைத் தேர்ந்தெடுக்கவும்…' : 'Select operation…';
        cOp.options[1].textContent = isTa ? 'மேனுவல் புஷ் (Manual)' : 'Manual (Push)';
        cOp.options[2].textContent = isTa ? 'கியர் இயக்கப்பட்டது (Gear)' : 'Gear Operated';
        cOp.options[3].textContent = isTa ? 'மோட்டார் இயக்கப்பட்டது (Automatic)' : 'Motor Operated (Automatic)';
    }

    // 13. Contact Section
    const contactLabels = document.querySelectorAll('#contact label');
    if (isTa) {
        if (contactLabels[0]) contactLabels[0].textContent = 'உங்கள் பெயர்';
        if (contactLabels[1]) contactLabels[1].textContent = 'தொலைபேசி எண்';
        if (contactLabels[2]) contactLabels[2].textContent = 'ஷட்டர் வகை';
        if (contactLabels[3]) contactLabels[3].textContent = 'தோராயமான அளவு';
        if (contactLabels[4]) contactLabels[4].textContent = 'ஊர் / பகுதி';
        if (contactLabels[5]) contactLabels[5].textContent = 'கூடுதல் விவரங்கள்';
        setHtml('#contact .form-submit', '<i class="fas fa-paper-plane"></i> விசாரணையை அனுப்பவும்');
    } else {
        if (contactLabels[0]) contactLabels[0].textContent = 'Your Name';
        if (contactLabels[1]) contactLabels[1].textContent = 'Phone Number';
        if (contactLabels[2]) contactLabels[2].textContent = 'Shutter Type';
        if (contactLabels[3]) contactLabels[3].textContent = 'Approximate Size';
        if (contactLabels[4]) contactLabels[4].textContent = 'Town / Area';
        if (contactLabels[5]) contactLabels[5].textContent = 'Additional Details';
        setHtml('#contact .form-submit', '<i class="fas fa-paper-plane"></i> Send Inquiry');
    }

    // 14. Footer
    setText('footer .footer-brand', isTa ? 'சுப்ரீம். ரோலிங் ஷட்டர்கள்' : 'Supreme. Rolling Shutters');
    setText('footer .footer-copy', isTa
        ? '© 2026 சுப்ரீம் ரோலிங் ஷட்டர்கள். தொடக்கம் 2003 · ராஜபாளையம் தலைமையகம் · மதுரை கிளை · பெங்களூர் கிளை · தென்னிந்தியா முழுவதும்.'
        : '© 2026 Supreme Rolling Shutters. Est. 2003 · Rajapalayam HQ · Madurai Branch · Bangalore Branch · Pan south india'
    );

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
