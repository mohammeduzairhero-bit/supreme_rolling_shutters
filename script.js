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
            fill.style.width = '100%';
            pctEl.textContent = '100%';
            setTimeout(() => {
                gsap.to('#preloader', {
                    yPercent: -100, duration: 0.9, ease: 'power3.inOut',
                    onComplete: () => {
                        document.getElementById('preloader').style.display = 'none';
                        initHeroAnim();
                    }
                });
            }, 350);
            return;
        }
        fill.style.width = pct + '%';
        pctEl.textContent = Math.floor(pct) + '%';
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
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animCursor);
})();

const hoverElements = ['a', 'button', '.product-card', '.why-item', '.faq-q', '.area-tag', '.metric-cell', '.pillar', '.craft-cell', '.swatch'];

function handleMouseEnter(e) {
    cursor.style.width = '18px';
    cursor.style.height = '18px';
    ring.style.width = '54px';
    ring.style.height = '54px';
    ring.style.borderColor = 'rgba(232,0,15,0.8)';
}

function handleMouseLeave(e) {
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
    if (didScroll !== navScrolled) {
        navbar.classList.toggle('scrolled', didScroll);
        navScrolled = didScroll;
    }
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progressEl = document.getElementById("progress");
    if (progressEl) {
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
function createReveal(selector, x = 0, stagger = null) {
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

/* ── Counter Animation Helper ── */
function animateCounter(el, target, duration = 1000, step = 80) {
    let current = 0;
    const increment = Math.ceil(target / step);
    const intervalTime = duration / step;
    
    if (typeof gsap !== 'undefined' && !gsap.globalTimeline().getAll().length) {
        gsap.to(el, {
            innerText: target,
            duration: duration / 1000,
            snap: { innerText: 1 },
            ease: 'power1.out',
            onUpdate: () => {
                el.textContent = Math.ceil(el.innerText).toLocaleString();
            }
        });
        return;
    }
    
    const timer = setInterval(() => {
        current = Math.min(current + increment, target);
        el.textContent = current.toLocaleString();
        if (current >= target) clearInterval(timer);
    }, intervalTime);
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
            const target = parseInt(el.dataset.target);
            animateCounter(el, target);
        });
    }
});

function animateCounters() {
    document.querySelectorAll('.counter-num').forEach(el => {
        const target = parseInt(el.dataset.target);
        if (!isNaN(target)) animateCounter(el, target);
    });
}

ScrollTrigger.create({
    trigger: '#service-area',
    start: 'top 80%',
    once: true,
    onEnter: () => {
        document.querySelectorAll('#service-area .counter-num').forEach(el => {
            const target = parseInt(el.dataset.target);
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
        submitBtn.innerHTML = isTa ? '<i class="fas fa-paper-plane"></i> விவரங்களை அனுபு இலவச மதிப்பீடு செய்யுங்கள்' : '<i class="fas fa-paper-plane"></i> Send Inquiry';
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
    document.getElementById('c-res').classList.remove('show');
    document.getElementById('c-idle').style.display = 'flex';
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
        err.classList.add('show');
        return;
    }
    err.classList.remove('show');
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
window.addEventListener('scroll', () => _btt.classList.toggle('show', scrollY > 500), { passive: true });

/* ── Cursor trails ── */
(function () {
    const N = 10, trails = [];
    for (let i = 0; i < N; i++) {
        const d = document.createElement('div');
        d.className = 'cur-trail';
        const s = (6 - i * 0.45);
        d.style.cssText = `width:${s}px;height:${s}px;opacity:${(1 - i / N) * 0.55}`;
        document.body.appendChild(d);
        trails.push({ el: d, x: 0, y: 0 });
    }
    let mx = 0, my = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
    (function loop() {
        trails.forEach((t, i) => {
            const src = i === 0 ? { x: mx, y: my } : trails[i - 1];
            t.x += (src.x - t.x) * 0.32;
            t.y += (src.y - t.y) * 0.32;
            t.el.style.left = t.x + 'px';
            t.el.style.top = t.y + 'px';
        });
        requestAnimationFrame(loop);
    })();
})();

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
                badge.innerText = activeLabel;
                gsap.to(imgEl, { opacity: 1, duration: 0.4 });
            }
        });
    } else {
        imgEl.style.opacity = '0';
        setTimeout(() => {
            if (type === 'manual') imgEl.src = 'manual-shutter.png';
            if (type === 'gear') imgEl.src = 'gear-shutter.png';
            if (type === 'motor') imgEl.src = 'motor-shutter.png';
            badge.innerText = activeLabel;
            imgEl.style.opacity = '1';
        }, 200);
    }
    document.querySelectorAll('.config-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
}

function applyTint(degrees) {
    const imgEl = document.getElementById('main-shutter-img');
    if (typeof gsap !== 'undefined') {
        gsap.to(imgEl, { filter: `hue-rotate(${degrees}deg) saturate(0.8)`, duration: 0.5 });
    } else {
        imgEl.style.filter = `hue-rotate(${degrees}deg) saturate(0.8)`;
    }
}

/* ── AI Shutter Concept Generator ── */
const PUTER_AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InYyIn0.eyJ0IjoidCIsInYiOiIyIiwidG9rZW5fdWlkIjoiNTY4MDE3NmYtNGM1MS00MGM1LWE0NzgtZTViNzFhYzJjNzQwIiwidXUiOiJhK0FHSVlxelFxU3NLSC9hZUZmRkdBPT0iLCJzdSI6IjZvbVkzdUhuU0IrajUyUVpSNXpVS2c9PSIsImFpIjoiYStBR0lZcXpRcVNzS0gvYWVGZkZHQT09IiwiZnVsbF9hY2Nlc3MiOnRydWUsImlhdCI6MTc5MzU0MzE2OX0.pJdgJz8wA_p1k5K8fpNRbHWGGGOOv3g3FHLzK4V9oOI';

if (typeof puter !== 'undefined') {
    puter.authToken = PUTER_AUTH_TOKEN;
}

let uploadedShopPhotoDataUrl = '';
let uploadedShopPhotoFile = null;
const shopPhotoInput = document.getElementById('shop-photo-upload');
const shopPhotoPreview = document.getElementById('shop-photo-preview');
const shopPhotoStatus = document.getElementById('shop-photo-status');
const aiResultPanel = document.getElementById('ai-shutter-result');
const aiResultImage = document.getElementById('ai-result-image');
const aiResultMessage = document.getElementById('ai-result-message');
const aiResultStatus = document.getElementById('ai-result-status');

if (shopPhotoInput) {
    shopPhotoInput.addEventListener('change', () => {
        const file = shopPhotoInput.files && shopPhotoInput.files[0];
        uploadedShopPhotoDataUrl = '';
        uploadedShopPhotoFile = null;
        if (!file) return;
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            shopPhotoInput.value = '';
            shopPhotoStatus.textContent = 'Please choose a JPG, PNG or WebP image.';
            return;
        }
        if (file.size > 8 * 1024 * 1024) {
            shopPhotoInput.value = '';
            shopPhotoStatus.textContent = 'That image is over 8 MB. Choose a smaller photo.';
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            uploadedShopPhotoFile = file;
            uploadedShopPhotoDataUrl = String(reader.result || '');
            shopPhotoPreview.src = uploadedShopPhotoDataUrl;
            shopPhotoPreview.hidden = false;
            shopPhotoStatus.textContent = file.name + ' selected. Your photo stays in this page until you generate.';
        };
        reader.onerror = () => { shopPhotoStatus.textContent = 'Could not read that image. Please try another file.'; };
        reader.readAsDataURL(file);
    });
}

document.querySelectorAll('input[name="ai-mechanism"]').forEach(input => input.addEventListener('change', () => {
    document.querySelectorAll('.ai-option').forEach(label => {
        const active = label.querySelector('input').checked;
        label.style.borderColor = active ? 'var(--yellow)' : 'var(--border)';
    });
}));

async function generateShutterConcept() {
    const button = document.getElementById('generate-shutter-btn');
    const mechanism = document.querySelector('input[name="ai-mechanism"]:checked')?.value || 'manual';
    const mechanismDetails = {
        manual: 'Crisp architectural photograph of a simple manual push-pull rolling shutter door installed on a storefront wall. Clean and minimal design with zero external motors, no gearbox, and no hanging chains. At the top, a streamlined rectangular metal hood box covering the internal torsion spring barrel. Clean galvanized vertical guide channels on both sides. The bottom rail features two recessed steel lift handles and a central manual padlock eyelet. Horizontal galvanized steel lath curtain, clean industrial masonry opening, realistic daylight, clear hardware details, sharp focus, practical utility design.',
        gear: 'Detailed product photo of an industrial manual gear-operated rolling shutter door mounted against an exterior warehouse wall. Mounted on the left vertical side channel at waist height is an exposed cast-iron bevel reduction gearbox casing with an attached manual winding crank handle. A straight, solid vertical steel drive rod connects upward from the top of the gearbox directly into the left endplate of the overhead barrel assembly. A realistic looped steel link pull chain hangs alongside the left wall for auxiliary manual operation. Heavy-duty steel side guide channels, horizontal slatted galvanized steel curtain, industrial mechanical hardware, crisp bolts and mounting plates, neutral workshop lighting, full shot capturing the entire drive link from gearbox to top axle.',
        motor: 'Clear architectural product photograph of an industrial electric motorized rolling shutter installed on a concrete wall. At the very top, a matte black metal hood cover box enclosing the barrel roller mechanism, with a visible cylindrical side-mount tubular motor assembly and heavy-duty steel mounting brackets bolted to the wall. Vertical matte black guide channels running down both sides. Mounted at eye level on the adjacent wall next to the guide channel is a small industrial wall switch box with three distinct push buttons (Up, Stop, Down). Realistic metallic textures, sharp seams, clean factory finish, neutral commercial lighting, wide view showing the entire upper mechanism, side tracks, and wall control unit.'
    };

    aiResultPanel.style.display = 'block';
    aiResultImage.hidden = true;
    document.getElementById('ai-result-download').hidden = true;
    aiResultStatus.textContent = 'Preparing';
    aiResultMessage.textContent = '';

    if (!uploadedShopPhotoDataUrl || !uploadedShopPhotoFile) {
        aiResultStatus.textContent = 'Photo required';
        aiResultMessage.textContent = 'Upload a clear photo of your shop entrance first.';
        return;
    }

    if (typeof puter === 'undefined') {
        aiResultStatus.textContent = 'Connecting…';
        aiResultMessage.textContent = 'Loading Puter AI engine…';
        try {
            await new Promise((resolve, reject) => {
                const s = document.createElement('script');
                s.src = 'https://js.puter.com/v2/';
                s.onload = () => resolve();
                s.onerror = () => reject(new Error('Failed to load Puter SDK from js.puter.com'));
                document.head.appendChild(s);
            });
            if (PUTER_AUTH_TOKEN && PUTER_AUTH_TOKEN !== 'YOUR_PUTER_AUTH_TOKEN') {
                puter.authToken = PUTER_AUTH_TOKEN;
            }
        } catch (loadErr) {
            aiResultStatus.textContent = 'Connection Error';
            aiResultMessage.textContent = 'Could not load Puter SDK. Please check your internet connection or ad-blocker settings.';
            button.disabled = false;
            button.style.opacity = '1';
            return;
        }
    }

    const DEEPAI_API_KEY = 'YOUR_DEEPAI_KEY';
    const IMAGE_DAILY_LIMIT = 2;
    const IMAGE_LIMIT_KEY = 'supreme_image_daily_usage';

    function checkImageLimit() {
        const today = new Date().toISOString().slice(0, 10);
        let usage = JSON.parse(localStorage.getItem(IMAGE_LIMIT_KEY) || '{}');
        if (usage.date !== today) {
            usage = { date: today, count: 0 };
        }
        if (usage.count >= IMAGE_DAILY_LIMIT) {
            throw new Error('Daily limit reached: Only 2 image requests per day.');
        }
        return usage;
    }

    function recordImageUsage(usage) {
        usage.count++;
        localStorage.setItem(IMAGE_LIMIT_KEY, JSON.stringify(usage));
    }

    const notes = (document.getElementById('shutter-notes').value || '').trim();
    const prompt = [
        'Create a photorealistic architectural photo edit for a professional rolling-shutter installation company.',
        'Use the input shop-front photo as the source reference and strictly preserve the existing building geometry, camera angle, perspective, signage, neighboring structures, pavement, and ambient daylight.',
        'Replace only the open doorway opening with one realistic industrial rolling shutter, accurately fitted inside the opening with straight horizontal slats, guide tracks, lintel, and contact shadows.',
        'Mechanism choice: ' + mechanismDetails[mechanism] + '.',
        'Do not invent extra doors, alter the storefront sign, add text or watermark, or distort architectural lines. Return one single clean realistic finished photo.',
        notes ? 'Customer preferences: ' + notes + '.' : ''
    ].filter(Boolean).join(' ');

    button.disabled = true;
    button.style.opacity = '.65';
    aiResultStatus.textContent = 'Generating…';
    aiResultMessage.textContent = 'Sending the photo and shutter parameters to Puter AI. This may take a few moments.';

    try {
        const usage = checkImageLimit();
        let outputSrc = '';

        try {
            const response = await puter.ai.txt2img(prompt, {
                model: 'seedream-5-0-lite-260128',
                input_image: uploadedShopPhotoDataUrl
            });

            if (response instanceof HTMLImageElement) {
                outputSrc = response.src;
            } else if (typeof response === 'string') {
                outputSrc = response;
            } else if (response?.src) {
                outputSrc = response.src;
            }

            if (!outputSrc) {
                throw new Error('Puter returned no image.');
            }

        } catch (puterError) {
            aiResultStatus.textContent = 'Trying DeepAI...';
            const DEEPAI_API_URL = 'https://api.deepai.org/api/image-editor';
            const formData = new FormData();
            formData.append('image', uploadedShopPhotoFile);
            formData.append('text', prompt);

            const deepAIResponse = await fetch(DEEPAI_API_URL, {
                method: 'POST',
                headers: { 'api-key': DEEPAI_API_KEY },
                body: formData
            });
            const deepAIResult = await deepAIResponse.json();

            if (!deepAIResponse.ok || !deepAIResult.output_url) {
                throw new Error(deepAIResult.err || 'Both image providers failed.');
            }
            outputSrc = deepAIResult.output_url;
        }

        recordImageUsage(usage);
        aiResultImage.src = outputSrc;
        aiResultImage.hidden = false;
        const download = document.getElementById('ai-result-download');
        download.href = outputSrc;
        download.hidden = false;
        aiResultStatus.textContent = 'Concept ready';
        aiResultMessage.textContent = 'Image successfully generated. Review the concept before installation.';

    } catch (error) {
        aiResultStatus.textContent = 'Generation failed';
        aiResultMessage.textContent = error.message;
    } finally {
        button.disabled = false;
        button.style.opacity = '1';
    }
}

const generateShutterButton = document.getElementById('generate-shutter-btn');
if (generateShutterButton) generateShutterButton.addEventListener('click', generateShutterConcept);

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
            after.style.clipPath = `inset(0 0 0 ${pos}%)`;
            handle.style.left = pos + '%';
            divider.style.left = pos + '%';
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
        taDesc: "எங்கள் தலைமையகம் மற்றும் முதன்மையுர் உற்பத்தி பிரிவு. அதிவேக பதிலளிப்பு நேரம், மிகப்பெரிய இருப்பு மற்றும் எங்கள் மூத்த தொழில்நுட்ப வல்லுநர்களின் நேரடி அணுகல்.",
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
        taDesc: "ஹெவியு-டியூட்டி மற்றும் ஃபயர்-ரேட்டட் ஷட்டர்களுக்கு முக்கியத்துவம் அளிக்கும் எஃகு நகர நிறுவல்கள்.",
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

            defaultCard.style.display = 'none';
            districtCard.style.display = 'block';
            setTimeout(() => { districtCard.classList.add('show'); }, 50);
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
        ? ['தயாரிப்புகள்', 'செயல்முறை', 'பொருட்கள்', 'ஏன் நாங்கள்', 'விலை கணக்கீடு', 'மதிப்பூரைகள்', 'ஒப்பீடு', 'மேற்கோள் பெறுக']
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
        if (metricLabels[0]) metricLabels[0].textContent = 'ராஜபாளையம் & விருதুনகர் மாவட்டத்திற்கு தடைபடாது சேவை';
        if (metricLabels[1]) metricLabels[1].textContent = 'கடைகள், கிடங்குகள், தொழில்கள்கள் & வீடுகளில் முழுவதும் நிறுவப்பட்ட ஷட்டர்கள்';
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
            legacyBodies[0].textContent = '2003 இல் நிறுவப்பட்ட சுப்ரீம் ரோலிங் ஷட்டர்கள், தரமான தயாரிப்பு மற்றும் நேர்மையான சேவை பிளிக்க முடியாதவை என்று ஒரு கொள்கையின் கீழ் உருவாக்கப்பட்டது. ராஜபாளையத்தில் ஒரு சிறிய பட்டறையாகத் தொடங்கியது இன்று தென்னிந்தியாவின் நம்பகமான பிராண்டாக வளர்ந்துள்ளது, மதுரை மற்றும் பெங்களூரில் கிளைகளுடன் தென்னிந்தியாவின் அனைத்து மாவட்டங்களையும சென்றடைகிறது.';
            legacyBodies[1].textContent = 'நாங்கள் தயாரிக்கும் ஒவ்வொரு ஷட்டரும் அளவீடு செய்யப்பட்டு, எங்களது சொந்த பட்டறையில் வடிவமைக்கப்பட்டு, எங்களது நிரந்தர குழுவால் நிறுவப்படுகிறது. 5 வருட முழு உத்தரவாதத்துடன் வருகிறது. எந்தவொரு வெளிப்பணிகளும் இல்லை, சமரசங்களும் இல்லை.';
        } else {
            legacyBodies[0].textContent = 'Established in 2003, Supreme Rolling Shutters was built on a single conviction — that quality fabrication and honest service are inseparable. What began as a modest workshop in Rajapalayam has grown into south india\'s trusted shutter brand, with a dedicated branch in Madurai, Bangalore and distribution reaching all districts of south india.';
            legacyBodies[1].textContent = 'Every shutter we manufacture is custom-built — measured on-site, fabricated in our own workshop, installed by our permanent team, and backed by a comprehensive 5-year warranty. No subcontracting. No shortcuts. No compromises.';
        }
    }
    setText('#showcase .sig-text', 'Supreme Rolling Shutters · Est. 2003, Rajapalayam', 'சுப்ரீம் ரோலிங் ஷட்டர்கள் · தொடக்கம் 2003, ராஜபாளையம்');

    const pillarTitles = document.querySelectorAll('#showcase .pillar-title');
    const pillarBodies = document.querySelectorAll('#showcase .pillar-body');
    const pillarTags = document.querySelectorAll('#showcase .pillar-tag');
    if (isTa) {
        if (pillarTitles[0]) pillarTitles[0].textContent = 'சொந்த தயாரிப்பு';
        if (pillarBodies[0]) pillarBodies[0].textContent = 'ஒவ்வொரு ஷட்டரும் எங்களது சொந்த பட்டறையிலேயே வெட்டப்பட்டு, உருட்டப்பட்டு, பறவைக்கப்பட்டு, தரம் சரிபார்க்கப்படுகிறது — வெளி ஆட்களிடம் வழங்கப்படுவதில்லை. இதனால் விரைவான விநியோகம் மற்றும் பொருத்தப்பட்ட உறுதி செய்யப்படுகிறது.';
        if (pillarTags[0]) pillarTags[0].textContent = 'துல்லிய உற்பத்தி';
        if (pillarTitles[1]) pillarTitles[1].textContent = 'நிரந்தர நிறுவல் குழு';
        if (pillarBodies[1]) pillarBodies[1].textContent = 'எங்களது நிறுவல் குழுவினர் எங்களது முழுநேர ஊழியர்கள் — தற்காலிக தினக்கூலிகள் அல்ல. பயிற்சி பெற்ற மற்றும் பொறுப்பான அவர்கள் மாவட்டம் முழுவதும் சுப்ரீம் தரத்தை வழங்குகிறார்கள்.';
        if (pillarTags[1]) pillarTags[1].textContent = 'திறமையான ஊழியர்கள்';
    } else {
        if (pillarTitles[0]) pillarTitles[0].textContent = 'In-House Fabrication';
        if (pillarBodies[0]) pillarBodies[0].textContent = 'Every shutter is cut, rolled, welded, and quality-checked in our own workshop — not outsourced. This means tighter tolerances, faster turnaround, and accountability at every step of the process.';
        if (pillarTags[0]) pillarTags[0].textContent = 'Precision Built';
        if (pillarTitles[1]) pillarTitles[1].textContent = 'Permanent Installation Team';
        if (pillarBodies[1]) pillarBodies[1].textContent = 'Our installation crew are full-time employees — not day labourers. Trained, experienced, and accountable, they carry the Supreme standard to every job site across the district.';
        if (pillarTags[1]) pillarTags[1].textContent = 'Skilled Workforce';
    }

    const craftTitles = document.querySelectorAll('.craft-cell .craft-title');
    const craftIndexes = document.querySelectorAll('.craft-cell .craft-index');
    const craftBodies = document.querySelectorAll('.craft-cell .craft-body');
    if (isTa) {
        if (craftIndexes[0]) craftIndexes[0].textContent = 'தரம் 01';
        if (craftTitles[0]) craftTitles[0].textContent = 'பொருட்களின் தரம்';
        if (craftBodies[0]) craftBodies[0].textContent = 'நாங்கள் சான்றளிக்கப்பட்ட ஜிஐ ஷீட், அதிக வலிமை கொண்ட எஃகு மற்றும் தரப்படுத்தப்பட்ட பாலிகார்பனேட் மட்டுமே பயன்படுத்துகிறோம். மறுசுழற்சி செய்யப்பட்ட பொருட்கள் அல்லது தரம் குறைந்த பொருட்கள் என்று போன்றும் பயன்படுத்தப்படாதது.';
        if (craftIndexes[1]) craftIndexes[1].textContent = 'தரம் 02';
        if (craftTitles[1]) craftTitles[1].textContent = 'பிளவுவைப்பு தரம்';
        if (craftBodies[1]) craftBodies[1].textContent = 'அனைத்து கட்டமைப்பு வெல்டிங்குகளும் எம்ஐஜி (MIG) முறையில் முடிக்கப்பட்டு, துல்லியம் சரிபார்க்கப்படுகிறது. எங்களது ஷட்டர்கள் பல தசாப்த கால பயன்பாட்டை தாங்கக்கூடியவை.';
        if (craftIndexes[2]) craftIndexes[2].textContent = 'தரம் 03';
        if (craftTitles[2]) craftTitles[2].textContent = 'மேற்பரப்பு வடிவமைப்பு';
        if (craftBodies[2]) craftBodies[2].textContent = 'அனைத்து ஷட்டர்களும் தூர் எதிர்ப்பு பிரைமர் சிகிச்சையைப் பெறுகின்றன, அதைத் தொடர்ந்து எலக்ட்ரோஸ்டாடிக் பவுடர்-கோட் அல்லது எனாமல் பைண்ட் பூசு செய்யப்படுகின்றன.';
    } else {
        if (craftIndexes[0]) craftIndexes[0].textContent = 'Standard 01';
        if (craftTitles[0]) craftTitles[0].textContent = 'Material Integrity';
        if (craftBodies[0]) craftBodies[0].textContent = 'We source only certified GI sheet, high-tensile steel, and grade-rated polycarbonate. Every batch is verified before entering our workshop. No recycled offcuts, no inferior substitutions — ever.';
        if (craftIndexes[1]) craftIndexes[1].textContent = 'Standard 02';
        if (craftTitles[1]) craftTitles[1].textContent = 'Weld Quality';
        if (craftBodies[1]) craftBodies[1].textContent = 'All structural welds are MIG-finished and inspected for porosity, penetration, and alignment before dispatch. Our shutters withstand decades of daily cycling without structural fatigue.';
        if (craftIndexes[2]) craftIndexes[2].textContent = 'Standard 03';
        if (craftTitles[2]) craftTitles[2].textContent = 'Surface Finishing';
        if (craftBodies[2]) craftBodies[2].textContent = 'All shutters receive anti-rust primer treatment followed by electrostatic powder-coat or enamel paint finishing. Available in custom RAL colours to match your shopfront or brand identity.';
    }

    // 6. Section Labels & Group Titles
    const sectionLabels = document.querySelectorAll('.section-label');
    const sectionTitles = document.querySelectorAll('.section-title');
    const labelsEn = ['What We Offer', 'Materials We Trust & Use', 'How It Works', 'Why Supreme', 'Where We Serve', 'Common Questions', 'Instant Estimate', 'Get In Touch', 'Real Transformations', 'Coverage Map', 'Client Reviews', 'Product Comparison', 'Product Lab', 'You Might Also Need'];
    const labelsTa = ['நாங்கள் வழங்குபவை', 'நாங்கள் நம்பும் பொருட்கள்', 'செயல்முறை முறை', 'ஏன் சுப்ரீம்', 'எங்கள் சேவை பகுதிகள்', 'பொதுவான கேள்விகள்', 'உடனடி கணக்கீடு', 'தொடர்பு கொள்ள', 'உண்மையான மாற்றங்கள்', 'சேவை வரைபடம்', 'வாடிக்கையாளர் மதிப்பூரைகள்', 'தயாரிப்பு ஒப்பீடு', 'தயாரிப்பு பரிசோதனைக்கூடம்', 'உங்களுக்கு இதுவும் தேவைப்படலாம்'];

    sectionLabels.forEach(lbl => {
        const txt = lbl.textContent.trim();
        const idx = labelsEn.indexOf(txt);
        if (idx !== -1) lbl.textContent = isTa ? labelsTa[idx] : labelsEn[idx];
    });

    if (isTa) {
        if (sectionTitles[0]) sectionTitles[0].innerHTML = 'எங்கள் ஷட்டர் <em>தயாரிப்பு</em> வகைகள்';
        if (sectionTitles[1]) sectionTitles[1].innerHTML = 'நாங்கள் நம்பி <em>பயன்படுத்தும்து</em> பொருட்கள்';
        if (sectionTitles[2]) sectionTitles[2].innerHTML = 'எங்கள் <em>5-படி</em> நிறுவல் செயல்முறை';
        if (sectionTitles[3]) sectionTitles[3].innerHTML = 'வாடிக்கையாளர்கள் எங்களை <em>தேர்ந்தெடுக்க</em> காரணங்கள்';
        if (sectionTitles[4]) sectionTitles[4].innerHTML = 'தென்னிந்தியா முழுவதும் <em>விநியோகம்</em>';
        if (sectionTitles[5]) sectionTitles[5].innerHTML = 'அடிக்கடி <em> கேட்கப்படவது</em>';
        if (sectionTitles[6]) sectionTitles[6].innerHTML = 'விலை <em>கணக்கீடு</em>';
        if (sectionTitles[7]) sectionTitles[7].innerHTML = 'இலவச <em>மேற்கோள்</em> கோருவம்';
        if (sectionTitles[8]) sectionTitles[8].innerHTML = 'நிறுவலுக்கு <em>முன் &amp; பின்</em>';
        if (sectionTitles[9]) sectionTitles[9].innerHTML = 'தமிழ்நாடு <em>சேவை நெட்வொர்க்</em>';
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
        if (sectionTitles[9]) sectionTitles[9].innerHTML = 'Tamil Nadu<br><em>Service Network</em>';
        if (sectionTitles[10]) sectionTitles[10].innerHTML = 'What Clients<br><em>Say About Us</em>';
        if (sectionTitles[11]) sectionTitles[11].innerHTML = 'Which Shutter<br><em>Suits You?</em>';
        if (sectionTitles[12]) sectionTitles[12].innerHTML = 'Configure Your <em>Supreme</em> Shutter';
    }

    // 7. Shutter Product Cards
    const prodNames = document.querySelectorAll('#products .product-name');
    const prodDescs = document.querySelectorAll('#products .product-desc');
    const specTags = document.querySelectorAll('#products .spec-tag');
    const specEn = ['Remote Control', 'Auto Reverse', 'Timer Option', 'Silent Motor', 'No Power Needed', 'Smooth Gear Action', 'Heavy Duty', 'Low Maintenance', 'Budget Friendly', 'Easy Install', 'Lightweight Option', 'All Sizes', 'Anti-Lift Lock', 'Reinforced Slats', 'Double-Wall Option', 'Keyed Cylinder', 'Translucent', 'UV Resistant', 'Shatter-Proof', 'Light Weight', 'Fire Tested', 'Galvanised Steel', 'Auto Drop', 'Smoke Seal Option'];
    const specTa = ['ரிமோட் கண்ட்ரோல்', 'தானியங்கி நிறுத்தம்', 'டைமர் விருப்பம்', 'சத்தமில்லா மோட்டார்', 'மின்சாரம் தேவையில்லை', 'மெனமையான கியர் இயக்கம்', 'அதிவேக உழைப்பு', 'குறைந்த பராமரிப்பு', 'பட்ஜெட் நட்பு', 'எளிய நிறுவல்', 'குறைந்த எடை', 'அனைத்து அளவுகள்', 'எடுக்க முடியாத பூட்டு', 'வலுவுண்டப்பட்ட தடிமன்', 'இரட்டை சுவர் விருப்பம்', 'உருளை சாவி அமைப்பு', 'ஒளி ஊடறுவகை', 'யூவி எதிர்ப்பு', 'உடையாத தரம்', 'குறைந்த எடை', 'தீ பரிசோதிக்கப்பட்டது', 'காலுவனேற்றப்பட்ட எஃகு', 'தானியங்கி வீழ்ச்சி', 'புகை தடுப்பு விருப்பம்'];

    if (isTa) {
        if (prodNames[0]) prodNames[0].textContent = 'மோட்டார் ஷட்டர்கள்';
        if (prodDescs[0]) prodDescs[0].textContent = 'ரிமோட் கண்ட்ரோல் மற்றும் சுவிட்ச் மூலம் இயக்கப்படும் முழு தானியங்கி ரோலிங் ஷட்டர்கள். வணிக ஷோரூம்கள், கிடங்குகள் மற்றும் பெரிய நுழைவாயில்களுக்கு வசதியானது.';
        if (prodNames[1]) prodNames[1].textContent = 'கியர் ஷட்டர்கள்';
        if (prodDescs[1]) prodDescs[1].textContent = 'மின்சாரம் தேவையின்றி மெனமையான கைமுறை இயக்கத்தை வழங்கும் மெக்கானிக்கல் கியர் ஷட்டர்கள். கடைகள், கேரேஜ்கள் மற்றும் தினசரி பயன்பாடுகளுக்கு ஏற்றது.';
        if (prodNames[2]) prodNames[2].textContent = 'சாதாரண / புஷ் ஷட்டர்கள்';
        if (prodDescs[2]) prodDescs[2].textContent = 'கிளாசிக் புஷ்-அப் ரோலிங் ஷட்டர்கள் — குறைந்த செலவு, நீடித்த உழைப்பு மற்றும் நேரடியாக இயக்கக்கூடியவை. சிறிய கடைகள் மற்றும் குடியிருப்பு பயன்பாடுகளுக்கு ஏற்றது.';
        if (prodNames[3]) prodNames[3].textContent = 'உயர் பாதுகாப்பு ஷட்டர்கள்';
        if (prodDescs[3]) prodDescs[3].textContent = 'ஆண்டி-லிப்ட் பூட்டுகள் மற்றும் சேதப்படுத்த முடியாத வடிவமைப்புடன் கூடுதல் வலுவுண்டப்பட்ட ஷட்டர்கள். வங்கிகள், நகைக்கடைகள் மற்றும் அதிக பாதுகாப்பு தேவைப்படும் இடங்களுக்கு ஏற்றது.';
        if (prodNames[4]) prodNames[4].textContent = 'பாலிகார்பனேட் ஷட்டர்கள்';
        if (prodDescs[4]) prodDescs[4].textContent = 'பாதுகாப்பைப் பேணுகையில் இயற்கை ஒளி ஊடறுவலுக்கான வெளிப்படையான பாலிகார்பனேட் ஷட்டர்கள். ஷோரூம் முகப்புகளுக்கு மிகவும் சிறந்தது.';
        if (prodNames[5]) prodNames[5].textContent = 'தீ தடுப்பு ஷட்டர்கள்';
        if (prodDescs[5]) prodDescs[5].textContent = 'தொழில்காளைகள் மற்றும் வணிக வளாகங்களில் பாதுகாப்பு விதிகளன்படி அதிக வெப்பநிலையைத் தாங்கும் வகையில் சோதிக்கப்பட்ட எஃகு ஷட்டர்கள்.';
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
        if (prodNames[5]) prodNames[5].textContent = 'Fire-Rated Shutters';
        if (prodDescs[5]) prodDescs[5].textContent = 'Steel shutters tested to withstand high temperatures, providing critical fire containment in factories, industrial units, and commercial complexes as per safety norms.';
    }
    specTags.forEach(tag => {
        const txt = tag.textContent.trim();
        let idx = specEn.indexOf(txt);
        if (idx === -1) idx = specTa.indexOf(txt);
        if (idx !== -1) tag.textContent = isTa ? specTa[idx % specEn.length] : specEn[idx % specEn.length];
    });

    // 8. Materials Section
    const matNames = document.querySelectorAll('#materials .material-name');
    const matDescs = document.querySelectorAll('#materials .material-desc');
    if (isTa) {
        if (matNames[0]) matNames[0].textContent = 'காலுவனேற்றப்பட்ட இரும்பு (GI)';
        if (matDescs[0]) matDescs[0].textContent = 'சிறந்த தூர் எதிர்ப்பு மற்றும் கட்டமைப்பு வலிமையை வழங்கும் ஹாட்-டிப் காலுவனேற்றப்பட்ட இரும்பு தாள். அனைத்து வானிலை நிலைகளிலும் நீண்ட காலம் உழைக்கும்.';
        if (matNames[1]) matNames[1].textContent = 'உயர் ரக எஃகு (Steel)';
        if (matDescs[1]) matDescs[1].textContent = 'அதிக இழுவிசை வலிமைக்காக வெப்ப-சிகிச்சை செய்யப்பட்ட எஃகு தாள். தொழில்துறை மற்றும் உயர் பாதுகாப்பு பயன்பாடுகளுக்கு விருப்பப்படுகிறது.';
        if (matNames[2]) matNames[2].textContent = 'பாலிகார்பனேட் (Polycarbonate)';
        if (matDescs[2]) matDescs[2].textContent = 'கண்ணாடியை விட 250 மடங்கு அதிக தாக்க எதிர்ப்பைக்கொண்ட உடையாத வெளிப்படையான பேனல்கள். மஞ்சள் நிறமாக்கத்தைத் தடுக்க இயற்கையாகவே யூவி-நிலைப்படுத்தப்பட்டது.';
        if (matNames[3]) matNames[3].textContent = 'தூர்ப்பிடாத எஃகு (Stainless Steel)';
        if (matDescs[3]) matDescs[3].textContent = 'மருந்து, உணவு பதப்படுத்தல் மற்றும் கடலோர சூழல்களுக்குத் தேவையான சுகாதாரமான மற்றும் அதிக அரிப்பு எதிர்ப்பு கொண்ட SS 304 மற்றும் SS 316 விருப்பங்கள்.';
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

    // 9. 5-Step Operational Process
    const stepTitles = document.querySelectorAll('#process .step-title');
    const stepDescs = document.querySelectorAll('#process .step-desc');
    if (isTa) {
        if (stepTitles[0]) stepTitles[0].textContent = 'விசாரணை & ஆலோசனைகள்';
        if (stepDescs[0]) stepDescs[0].textContent = 'எங்களை அழைக்கவும் அல்லது வாட்ஸ்அப் செய்யவும். ஷட்டர் வகை, அளவு, பொருள் மற்றும் பயன்பாடு ஆகியவற்றைப் புரிந்து கொள்கிறோம்.';
        if (stepTitles[1]) stepTitles[1].textContent = 'இலவச தள வருகை';
        if (stepDescs[1]) stepDescs[1].textContent = 'எங்களது தொழில்நுட்ப வல்லுநர் உங்கள் தளத்தைப் பார்வையிட்டு, துல்லியமான அளவீடுகளை எடுத்து கட்டமைப்பை மதிப்பிடுகிறார்.';
        if (stepTitles[2]) stepTitles[2].textContent = 'விலை மேற்கோள்';
        if (stepDescs[2]) stepDescs[2].textContent = 'நாங்கள் ஒரு வெளிப்படையான மேற்கோளை வழங்குகிறோம். மறைமுக கட்டணங்கள் இல்லை — பொருள், உற்பத்தி மற்றும் பிளாடிங் அனைத்தும் அடங்கும்.';
        if (stepTitles[3]) stepTitles[3].textContent = 'உற்பத்தி செயல்முறை';
        if (stepDescs[3]) stepDescs[3].textContent = 'ஷட்டர்கள் எங்களது சொந்த பட்டறையில் துல்லியமான விவரக்குறிப்புகளுக்கு ஏற்ப தனிப்பயனாக உருவாக்கப்பட்டு தரம் சரிபார்க்கப்படுகின்றன.';
        if (stepTitles[4]) stepTitles[4].textContent = 'நிறுவல் & உத்தரவாதம்';
        if (stepDescs[4]) stepDescs[4].textContent = 'எங்களது குழுவின் தொழிலமுறை நிறுவலைத் தொடர்ந்து முழு செயல்பாட்டு சோதனை மற்றும் 5 வருட சேவை உத்தரவாதம் வழங்கப்படுகிறது.';
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

    // 10. Why Choose Us
    const whyTitles = document.querySelectorAll('#why .why-item-title');
    const whyDescs = document.querySelectorAll('#why .why-item-desc');
    if (isTa) {
        if (whyTitles[0]) whyTitles[0].textContent = '22 ஆண்டுகள் உள்ளூர் நிபுணத்துவம்';
        if (whyDescs[0]) whyDescs[0].textContent = '2003 இல் நிறுவப்பட்ட நாங்கள், ராஜபாளையம் மற்றும் அதைச் சுற்றியுள்ள பகுதிகளில் 10 ஆயிரத்திற்கும் மேற்பட்ட ஷட்டர்களை நிறுவியுள்ளோம். உள்ளூர் தேவைகளை நாங்கள் அறிவோம்.';
        if (whyTitles[1]) whyTitles[1].textContent = '5 வருட முழு சேவை உத்தரவாதம்';
        if (whyDescs[1]) whyDescs[1].textContent = 'ஒவ்வொரு நிறுவலும் பாகங்கள் மற்றும் உழைப்பு இரண்டையும் உள்ளடக்கிய 60 மாத விரிவான உத்தரவாதத்துடன் வருகிறது. எந்தக் கேள்ியும் இன்றி சரிசெய்வோம்.';
        if (whyTitles[2]) whyTitles[2].textContent = 'தனிப்பயன் உற்பத்தி — எந்த அளவிலும்';
        if (whyDescs[2]) whyDescs[2].textContent = 'சிறிய 4 அடி கடை திறப்புகள் முதல் 30 அடி தொழில்துறை கிடங்கு கதவுகள் வரை, ஒவ்வொரு ஷட்டரையும் துல்லியமான அளவீடுகளுக்கு ஏற்ப உருவாக்குகிறோம்.';
        if (whyTitles[3]) whyTitles[3].textContent = 'வெளிப்படையான விலையிடல்';
        if (whyDescs[3]) whyDescs[3].textContent = 'வேலை தொடங்கும் முன் விரிவான மேற்கோள்களை வழங்குகிறோம். பொருள் செலவுகள், போக்குவரத்து மற்றும் நிறுவல் கட்டணங்கள் தெளிவாக பிரிக்கப்பட்டுள்ளன.';
        if (whyTitles[4]) whyTitles[4].textContent = 'நிறுவலுக்குப்பின் ஆதரவு';
        if (whyDescs[4]) whyDescs[4].textContent = 'எங்களது உறவு நிறுவலுடன் முடிவடையாது. உங்கள் ஷட்டர்களை பல தசாப்தங்களாக இயக்க அவசர முறிவு வருகைகள் மற்றும் பராமரிப்பு ஒப்பந்தங்களை வழங்குகிறோம்.';
        setText('#why .callout-big', 'இலவச தள வருகை & மதிப்பீடு');
        setText('#why .callout-sub', 'எந்தவொரு கடையயுமில்லை. எங்களது அனுபவம் வாய்ந்த தொழில்நுட்ப வல்லுநர் உங்கள் தளத்தைப் பார்வையிட்டு, முற்றிலும் இலவசமாக விரிவான மேற்கோளை வழங்குவார்.');
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

    // 11. Warranty Stripe Block
    setText('.warranty-band .warranty-text', '5 YEAR FULL WARRANTY — PARTS & LABOUR INCLUDED', '5 வருட முழு உத்தரவாதம் — உதிரிபாகங்கள் & உழைப்பு கட்டணம் அடங்கும்');
    const warrantySpans = document.querySelectorAll('.warranty-icon-item span');
    if (isTa) {
        if (warrantySpans[0]) warrantySpans[0].textContent = 'இலவச பழுதுபார்ப்பு';
        if (warrantySpans[1]) warrantySpans[1].textContent = 'பாகங்கள் கவரேஜ்';
        if (warrantySpans[2]) warrantySpans[2].textContent = 'தொலைபேசி ஆதரவு';
        if (warrantySpans[3]) warrantySpans[3].textContent = 'தள வருகை';
    } else {
        if (warrantySpans[0]) warrantySpans[0].textContent = 'Free Repairs';
        if (warrantySpans[1]) warrantySpans[1].textContent = 'Parts Covered';
        if (warrantySpans[2]) warrantySpans[2].textContent = 'Phone Support';
        if (warrantySpans[3]) warrantySpans[3].textContent = 'On-Site Visit';
    }

    // 12. Geographic Service Coverage
    setText('.area-main-desc',
        'Headquartered in Rajapalayam with a branch office in Madurai and Bangalore Supreme Rolling Shutters distributes and installs across all districts of south india. Our teams are equipped for on-site visits, fabrication dispatch, and post-installation service statewide.',
        'ராஜபாளையத்தை தலைமையிடமாகக் கொண்டு, மதுரை மற்றும் பெங்களூரில் கிளை அலுவலகங்களைக்கொண்டுள்ள சுப்ரீம் ரோலிங் ஷட்டர்கள் தென்னிந்தியாவின் அனைத்து மாவட்டங்களுக்கும் விநியோகம் செய்து நிறுவுகிறது. மாநிலம் தழுவிய சேவைக்கு எங்களது குழுகள் எப்போதும் தயாராக உள்ளன.'
    );

    const branchTags = document.querySelectorAll('.branch-card .branch-tag');
    const branchDescs = document.querySelectorAll('.branch-card .branch-desc');
    if (isTa) {
        if (branchTags[0]) branchTags[0].textContent = 'தலைமையகம்';
        if (branchDescs[0]) branchDescs[0].textContent = 'விருதநகர் மாவட்டம் · தொடக்கம் 2003 · முதன்மை பட்டறை & உற்பத்தி பிரிவு';
        if (branchTags[1]) branchTags[1].textContent = 'கிளை அலுவலகம்';
        if (branchDescs[1]) branchDescs[1].textContent = 'மத்திய தமிழக மையம் · விற்பனை, தள வருகைகள் & நிறுவல் ஆதரவு';
        if (branchTags[2]) branchTags[2].textContent = 'கிளை அலுவலகம்';
        if (branchDescs[2]) branchDescs[2].textContent = 'நெலமங்கலா மையம் · விற்பனை, தள வருகைகள் & நிறுவல் ஆதரவு';
    } else {
        if (branchTags[0]) branchTags[0].textContent = 'Headquarters';
        if (branchDescs[0]) branchDescs[0].textContent = 'Virudhunagar District · Est. 2003 · Primary Workshop & Fabrication Unit';
        if (branchTags[1]) branchTags[1].textContent = 'Branch Office';
        if (branchDescs[1]) branchDescs[1].textContent = 'Central Tamil Nadu Hub · Sales, Site Visits & Installation Support';
        if (branchTags[2]) branchTags[2].textContent = 'Branch Office';
        if (branchDescs[2]) branchDescs[2].textContent = 'Nelamangala Hub · Sales, Site Visits & Installation Support';
    }

    const areaStatLabels = document.querySelectorAll('.area-stat-label');
    if (isTa) {
        if (areaStatLabels[0]) areaStatLabels[0].textContent = 'தொழில் ஆண்டுகள்';
        if (areaStatLabels[1]) areaStatLabels[1].textContent = 'மொத்த நிறுவல்கள்';
        if (areaStatLabels[2]) areaStatLabels[2].textContent = 'மாவட்டங்கள் சேவை';
        if (areaStatLabels[3]) areaStatLabels[3].textContent = 'அலுவலக இருப்பிடங்கள்';
    } else {
        if (areaStatLabels[0]) areaStatLabels[0].textContent = 'Years in Business';
        if (areaStatLabels[1]) areaStatLabels[1].textContent = 'Total Installations';
        if (areaStatLabels[2]) areaStatLabels[2].textContent = 'Districts Covered';
        if (areaStatLabels[3]) areaStatLabels[3].textContent = 'Office Locations';
    }

    // 13. Interactive SVG Coverage Map
    setText('#map-branch-marker-lbl', 'கிளை');
    setText('#map-hq-marker-lbl', 'தலைமையகம்');
    setText('#map-service-map-section .map-main-desc',
        'Click districts to see installation stats. Our HQ in Rajapalayam and branch in Madurai ensure rapid response across the state.',
        'இன்ஸ்டாலேஷன் புள்ளிவிவரங்களைக் காண வரைபடத்தில் மாவட்டங்களை கிளிக் செய்யவும். ராஜபாளையம் தலைமையகம் மற்றும் மதுரை கிளை விரைவான பதிலை உறுதி செய்கிறது.'
    );
    setText('#map-default-card .map-stat-card-title', 'Pan-Tamil Nadu Coverage', 'தமிழகம் தழுவிய சேவை நெட்வொர்க்');
    setText('#map-default-card .map-stat-card-value',
        'Explore our service network by selecting a marked district to view its installation details. Contact our team to confirm coverage, site-visit availability, and delivery timelines for your location.',
        'நிறுவல் விவரங்களைக் காண குறிக்கப்பட்ட மாவட்டத்தைத் தேர்ந்தெடுக்கவும். உங்கள் பகுதியில் சேவை கிடைப்பது, தளப் பார்வை நேரம் மற்றும் விநியோக காலத்தை எங்களது குழுவிடம் உறுதிப்படுத்துவதும்.'
    );
    const mapLabels = document.querySelectorAll('#map-default-card .map-stat-label');
    if (isTa) {
        if (mapLabels[0]) mapLabels[0].textContent = 'மொத்த நிறுவல்கள்';
        if (mapLabels[1]) mapLabels[1].textContent = 'மாவட்டங்கள்';
        if (mapLabels[2]) mapLabels[2].textContent = 'அலுவலகங்கள்';
        if (mapLabels[3]) mapLabels[3].textContent = 'உத்தரவாதம்';
        setText('#map-default-card .map-cta-btn', 'உங்கள் மாவட்டத்தில் சேவைக்கு கோருங்கள்');
    } else {
        if (mapLabels[0]) mapLabels[0].textContent = 'Total Installs';
        if (mapLabels[1]) mapLabels[1].textContent = 'Districts Served';
        if (mapLabels[2]) mapLabels[2].textContent = 'Office Locations';
        if (mapLabels[3]) mapLabels[3].textContent = 'Warranty Period';
        setText('#map-default-card .map-cta-btn', 'Request Service in Your District');
    }

    const districtLabels = document.querySelectorAll('#map-district-card .map-stat-label');
    if (isTa) {
        if (districtLabels[0]) districtLabels[0].textContent = 'நிறுவல்கள்';
        if (districtLabels[1]) districtLabels[1].textContent = 'மகிழ்ச்சியான வாடிக்கையாளர்கள்';
        if (districtLabels[2]) districtLabels[2].textContent = 'சராசரி மதிப்பீடு';
        if (districtLabels[3]) districtLabels[3].textContent = 'பதிலளிக்கும் நேரம்';
    } else {
        if (districtLabels[0]) districtLabels[0].textContent = 'Installations';
        if (districtLabels[1]) districtLabels[1].textContent = 'Happy Clients';
        if (districtLabels[2]) districtLabels[2].textContent = 'Avg Rating';
        if (districtLabels[3]) districtLabels[3].textContent = 'Response Time';
    }

    // 14. FAQ Accordion
    const faqQs = document.querySelectorAll('.faq-list .faq-q span');
    const faqAs = document.querySelectorAll('.faq-list .faq-a p');
    if (isTa) {
        if (faqQs[0]) faqQs[0].textContent = 'நிறுவலுக்கு எவ்வளவு நேரம் ஆகும்?';
        if (faqAs[0]) faqAs[0].textContent = 'நிலையான ஒற்றை ஷட்டர் நிறுவல்கள் பொதுவாக சிமெண்ட் வேலை மற்றும் முடித்தல் உட்பட 3-5 மணி நேரம் ஆகும். பல ஷட்டர்கள் அல்லது பெரிய தொழில்துறை கதவுகள் 1-2 நாட்கள் தேவைப்படலாம்.';
        if (faqQs[1]) faqQs[1].textContent = 'கடலோரப் பகுதிகளுக்கு என்ன பொருட்களைப் பரிந்துரைக்கிறீர்கள்?';
        if (faqAs[1]) faqAs[1].textContent = 'கடலோர சூழல்களுக்கு, பவுடர்-கோட் பூசு கொண்ட ஹாட்-டிப் காலுவனேற்றப்பட்ட எஃகு அல்லது அதிகபட்ச உப்பு-காற்று அரிப்பு எதிர்ப்பிற்காக தூர்ப்பிடாத எஃகு (SS 316) ஆகியவற்றை நாங்கள் வலுவாக பரிந்துரைக்கிறோம்.';
        if (faqQs[2]) faqQs[2].textContent = 'ஏற்கனவே உள்ள எனது ஷட்டரில் மோட்டார் அமைப்பைப் பொருத்த முடியுமா?';
        if (faqAs[2]) faqAs[2].textContent = 'ஆம், பெரும்பாலான சந்தர்ப்பங்களில், தற்போதைய ஷட்டரின் கட்டமைப்பு மற்றும் டிரம் அசெம்பிளி நல்ல நிலையில் இருந்தால், நாங்கள் நேரடியாக ஒரு மோட்டார் மற்றும் கட்டுப்பாட்டு அமைப்பைப் பொருத்தலாம்.';
        if (faqQs[3]) faqQs[3].textContent = '5 வருட உத்தரவாதம் எவற்றை உள்ளடக்கியது?';
        if (faqAs[3]) faqAs[3].textContent = 'உத்தரவாதமானது அனைத்து மெக்கானிக்கல் தோல்விகள், வெல்டிங் குறைபாடுகள், ஸ்பிரிங் சோர்வு மற்றும் சாதாரண செயல்பாட்டு பயன்பாட்டின் கீழ் மோட்டார் மின்னணு செயலிழப்புகளை உள்ளடக்கியது.';
        if (faqQs[4]) faqQs[4].textContent = 'உத்தரவாதக் காலத்திற்குப் பிறகு ஆண்டு பராமரிப்பு ஒப்பந்தங்களை வழங்குகிறீர்களா?';
        if (faqAs[4]) faqAs[4].textContent = 'ஆம். ஆண்டு பராமரிப்பு ஒப்பந்தங்களை (AMC) நாங்கள் வழங்குகிறோம் — வருடத்திற்கு இரண்டு திட்டமிடப்பட்ட சேவை வருகைகள், அனைத்து நகரும் பாகங்களின் உயவும் சரிசெய்தல், அவசர முறிவு பழுதுபார்ப்பு முதலியன.';
        if (faqQs[5]) faqQs[5].textContent = 'உங்கள் ஷட்டர்களின் பொதுவான ஆயுட்காலம் என்ன?';
        if (faqAs[5]) faqAs[5].textContent = 'எங்களது ஜிஐ மற்றும் எஃகு ஷட்டர்கள் அடிப்படை வருடாந்திர பராமரிப்புடன் 15-25 ஆண்டுகள் வரை நீடிக்கும். பாலிகார்பனேட் ஷட்டர்கள் 10-15 ஆண்டுகள் ஆயுட்காலம் கொண்டவை.';
    } else {
        if (faqQs[0]) faqQs[0].textContent = 'How long does installation take?';
        if (faqAs[0]) faqAs[0].textContent = 'Standard single shutter installations typically take 3–5 hours including concrete work and finishing. Multiple shutters or large industrial doors may require 1–2 days. We always provide a time estimate before starting work.';
        if (faqQs[1]) faqQs[1].textContent = 'What materials do you recommend for coastal areas?';
        if (faqAs[1]) faqAs[1].textContent = 'For coastal environments, we strongly recommend hot-dip galvanised steel with a powder-coat finish, or stainless steel (SS 316) for maximum salt-air corrosion resistance. We apply additional anti-rust primers and advise annual maintenance inspections.';
        if (faqQs[2]) faqQs[2].textContent = 'Can you retrofit a motorised system to my existing shutter?';
        if (faqAs[2]) faqAs[2].textContent = 'Yes, in most cases we can retrofit a tubular motor and control system to an existing manual or gear shutter, provided the structure and drum assembly are in good condition. Our technician will assess during the free site visit.';
        if (faqQs[3]) faqQs[3].textContent = 'What does the 5-year warranty cover?';
        if (faqAs[3]) faqAs[3].textContent = 'The warranty covers all mechanical failures, structural weld defects, spring fatigue, internal assembly adjustments, and motor electronic malfunctions under normal operational usage conditions.';
        if (faqQs[4]) faqQs[4].textContent = 'Do you offer annual maintenance contracts after the warranty period?';
        if (faqAs[4]) faqAs[4].textContent = 'Yes. We offer Annual Maintenance Contracts (AMC) that include two scheduled service visits per year, lubrication and adjustment of all moving parts, priority call-out for breakdown repairs, and discounted spare parts. Contact us for AMC pricing.';
        if (faqQs[5]) faqQs[5].textContent = 'What is the typical lifespan of your shutters?';
        if (faqAs[5]) faqAs[5].textContent = 'Our GI and steel shutters regularly last 15–25 years with basic annual maintenance. Polycarbonate shutters have a typical lifespan of 10–15 years. Motorised components typically last 8–12 years depending on usage frequency.';
    }

    // 15. Real-Time Price Estimator UI
    const calcLabels = document.querySelectorAll('#calculator label');
    if (isTa) {
        if (calcLabels[0]) calcLabels[0].textContent = 'இயக்க முறை';
        if (calcLabels[1]) calcLabels[1].textContent = 'பொருள் / ஷட்டர் வகை';
        if (calcLabels[2]) calcLabels[2].textContent = 'அகலம் (அடி)';
        if (calcLabels[3]) calcLabels[3].textContent = 'உயரம் (அடி)';
        setText('.calc-sub-desc', 'உடனடி செலவு மதிப்பீட்டைப் பெற உங்கள் ஷட்டர் வகை மற்றும் அளவை உள்ளிடவும். தமிழ்நாடு, புதுச்சேரி, கேரளா, கர்நாடகா மற்றும் ஆந்திராவிற்கு செல்லுபடியாகும்.');
        setText('#c-idle p', 'இயக்க முறை & பொருளைத் தேர்ந்தெடுத்தু, அளவை உள்ளிட்டு கணக்கிடவும்');
        setHtml('#calc-note-box', '<strong>செல்லுபடியாகும் பகுதிகள்:</strong> தமிழ்நாடு &nbsp;·&nbsp; புதுச்சேரி &nbsp;·&nbsp; கேரளா &nbsp;·&nbsp; கர்நாடகா &nbsp;·&nbsp; ஆந்திரா<br>விலையில் பொருட்கள் + நிறுவல் கட்டணம் அடங்கும். நேரடி ஆய்வுக்குப் பின் இறுதி விலை முடிவு செய்யப்படும்.');
        setText('#calc-run-btn-txt', 'விலையைக் கணக்கிடங்கள்');
        setText('#calculator .calc-err', '⚠ கணக்கிடுவதற்கு முன் அனைத்து புலங்களையும் நிரப்பவும்.');
    } else {
        if (calcLabels[0]) calcLabels[0].textContent = 'Operation Type';
        if (calcLabels[1]) calcLabels[1].textContent = 'Material / Shutter Type';
        if (calcLabels[2]) calcLabels[2].textContent = 'Width (Feet)';
        if (calcLabels[3]) calcLabels[3].textContent = 'Height (Feet)';
        setText('.calc-sub-desc', 'Enter your shutter type and size to get an instant cost estimate. Valid for Tamil Nadu, Puducherry, Kerala, Karnataka, and Andhra.');
        setText('#c-idle p', 'Select operation & material, enter size, then calculate');
        setHtml('#calc-note-box', '<strong>Applicable regions:</strong> Tamil Nadu &nbsp;·&nbsp; Puducherry &nbsp;·&nbsp; Kerala &nbsp;·&nbsp; Karnataka &nbsp;·&nbsp; Andhra<br>Rates include supply + installation. Final quote after free site visit.');
        setText('#calc-run-btn-txt', 'Calculate My Price');
        setText('#calculator .calc-err', '⚠ Please fill all fields before calculating.');
    }

    const cOp = document.getElementById('c-op');
    if (cOp && cOp.options.length >= 4) {
        cOp.options[0].textContent = isTa ? 'இயக்க முறையைத் தேர்ந்தெடுக்கவும்…' : 'Select operation…';
        cOp.options[1].textContent = isTa ? 'கைமுறை புஷ் (Manual)' : 'Manual (Push)';
        cOp.options[2].textContent = isTa ? 'கியர் மூலம் இயக்குவது' : 'Gear Operated';
        cOp.options[3].textContent = isTa ? 'மோட்டார் மூலம் இயக்குவது' : 'Motor Operated (Automatic)';
    }
    calcPopulateMat();

    const resLabels = document.querySelectorAll('#c-res .res-cell-lbl');
    if (isTa) {
        if (resLabels[0]) resLabels[0].textContent = 'அகலம்';
        if (resLabels[1]) resLabels[1].textContent = 'உயரம்';
        if (resLabels[2]) resLabels[2].textContent = 'இயக்க முறை';
        if (resLabels[3]) resLabels[3].textContent = 'பொருள்';
        setText('#c-res .res-eyebrow', 'மதிப்பிடப்பட்ட மொத்த செலவு');
        setHtml('#c-res .res-footnote', '<strong>குறிப்பு:</strong> நிலையான நிறுவலை அடிப்படையாகக் கொண்ட செலவு. இலவச தள வருகைக்குப் பிறகு இறுதி விலை உறுதி செய்யப்படும் — சுவர் வகை மாறலாம். <strong>செல்லுபடியாகும்: தமிழ்நாடு · புதுச்சேரி · கேரளா · கர்நாடகா · ஆந்திரா.</strong>');
        setHtml('#c-res .wa-btn', '<i class="fab fa-whatsapp"></i> இந்த மேற்கோளை வாட்ஸ்அப் செய்யவும்');
    } else {
        if (resLabels[0]) resLabels[0].textContent = 'Width';
        if (resLabels[1]) resLabels[1].textContent = 'Height';
        if (resLabels[2]) resLabels[2].textContent = 'Operation';
        if (resLabels[3]) resLabels[3].textContent = 'Material';
        setText('#c-res .res-eyebrow', 'Estimated Total Cost');
        setHtml('#c-res .res-footnote', '<strong>Note:</strong> Estimate based on standard installation. Final price confirmed after free site visit — wall type, civil work & access conditions may vary. <strong>Valid: Tamil nadu · Puducherry · Kerala · Karnataka · Andhra.</strong>');
        setHtml('#c-res .wa-btn', '<i class="fab fa-whatsapp"></i> WhatsApp This Quote');
    }

    // 16. Contact Block
    const contactLabels = document.querySelectorAll('#contact label');
    if (isTa) {
        if (contactLabels[0]) contactLabels[0].textContent = 'தலைப்பு / பெயர்';
        if (contactLabels[1]) contactLabels[1].textContent = 'தொலைபேசி எண்';
        if (contactLabels[2]) contactLabels[2].textContent = 'ஷட்டர் வகை';
        if (contactLabels[3]) contactLabels[3].textContent = 'தோராயமான அளவு';
        if (contactLabels[4]) contactLabels[4].textContent = 'நகரம் / பகுதி';
        if (contactLabels[5]) contactLabels[5].textContent = 'கூடுதல் விவரங்கள்';

        const cSelect = document.querySelector('#contact select[name="shutter_type"]');
        if (cSelect && cSelect.options.length >= 8) {
            cSelect.options[0].textContent = 'வகையைத் தேர்ந்தெடுக்கவும்…';
            cSelect.options[1].textContent = 'மோட்டார் ஷட்டர்';
            cSelect.options[2].textContent = 'கியர் ஷட்டர்';
            cSelect.options[3].textContent = 'கைமுறை புஷ் ஷட்டர்';
            cSelect.options[4].textContent = 'உயர் பாதுகாப்பு ஷட்டர்';
            cSelect.options[5].textContent = 'பாலிகார்பனேட் ஷட்டர்';
            cSelect.options[6].textContent = 'தீ தடுப்பு ஷட்டர்';
            cSelect.options[7].textContent = 'உறுதியாக தெரியவில்லை — ஆலோசனை தேவை';
        }

        document.getElementsByName('name')[0].placeholder = 'உங்கள் பெயரை உள்ளிடவும்';
        document.getElementsByName('size')[0].placeholder = 'எ.கா. 10 அடி × 8 அடி';
        document.getElementsByName('location')[0].placeholder = 'எ.கா. ராஜபாளையம், சிவகாசி…';
        document.getElementsByName('details')[0].placeholder = 'உங்கள் பயன்பாட்டைப் பற்றி எங்களிடம் கூறுங்கள் — கடை, கிடங்கு, வீடு போன்றவை.';
        setHtml('#contact .form-submit', '<i class="fas fa-paper-plane"></i> விசாரணையை அனுபவம்');

        const contactRowLabels = document.querySelectorAll('.contact-row-label');
        if (contactRowLabels[0]) contactRowLabels[0].textContent = 'வாட்ஸ்அப்';
        if (contactRowLabels[1]) contactRowLabels[1].textContent = 'மின்னஞ்சல்';
        if (contactRowLabels[2]) contactRowLabels[2].textContent = 'தலைமையகம்';
        if (contactRowLabels[3]) contactRowLabels[3].textContent = 'மதுரை கிளை';
        if (contactRowLabels[4]) contactRowLabels[4].textContent = 'பெங்களூர் கிளை';
        if (contactRowLabels[5]) contactRowLabels[5].textContent = 'வேலை நேரம்';

        setText('#contact-wa-link', 'வாட்ஸ்அப்பில் அரட்டையடிக்க →');
        setText('#contact-mail-link', 'supremeshutters777@gmail.com →');
        setText('#contact .contact-info .contact-row:nth-child(3) .contact-row-val', 'ராஜபாளையம், விருதநகர் மாவட்டம், தமிழ்நாடு');
        setText('#contact .contact-info .contact-row:nth-child(4) .contact-row-val', 'மதுரை, தமிழ்நாடு');
        setText('#contact .contact-info .contact-row:nth-child(4) .contact-subtext', 'மத்திய தமிழகம் — விற்பனை & நிறுவல் ஆதரவு');
        setText('#contact .contact-info .contact-row:nth-child(5) .contact-row-val', 'பெங்களூர், கர்நாடகா');
        setText('#contact .contact-info .contact-row:nth-child(5) .contact-subtext', 'நெலமங்கலா — விற்பனை & நிறுவல் ஆதரவு');
        setText('#contact .contact-info .contact-row:nth-child(6) .contact-row-val', 'திங்கள் – சனி: காலை 8:00 – இரவு 9:00');
    } else {
        if (contactLabels[0]) contactLabels[0].textContent = 'Your Name';
        if (contactLabels[1]) contactLabels[1].textContent = 'Phone Number';
        if (contactLabels[2]) contactLabels[2].textContent = 'Shutter Type';
        if (contactLabels[3]) contactLabels[3].textContent = 'Approximate Size';
        if (contactLabels[4]) contactLabels[4].textContent = 'Town / Area';
        if (contactLabels[5]) contactLabels[5].textContent = 'Additional Details';

        const cSelect = document.querySelector('#contact select[name="shutter_type"]');
        if (cSelect && cSelect.options.length >= 8) {
            cSelect.options[0].textContent = 'Select type…';
            cSelect.options[1].textContent = 'Motorized Shutter';
            cSelect.options[2].textContent = 'Gear Shutter';
            cSelect.options[3].textContent = 'Manual / Push Shutter';
            cSelect.options[4].textContent = 'High-Security Shutter';
            cSelect.options[5].textContent = 'Polycarbonate Shutter';
            cSelect.options[6].textContent = 'Fire-Rated Shutter';
            cSelect.options[7].textContent = 'Not Sure — Need Advice';
        }

        document.getElementsByName('name')[0].placeholder = 'Enter your name';
        document.getElementsByName('size')[0].placeholder = 'e.g. 10ft × 8ft';
        document.getElementsByName('location')[0].placeholder = 'e.g. Rajapalayam, Sivakasi…';
        document.getElementsByName('details')[0].placeholder = 'Tell us about your application — shop, warehouse, residence, etc.';
        setHtml('#contact .form-submit', '<i class="fas fa-paper-plane"></i> Send Inquiry');

        const contactRowLabels = document.querySelectorAll('.contact-row-label');
        if (contactRowLabels[0]) contactRowLabels[0].textContent = 'WhatsApp';
        if (contactRowLabels[1]) contactRowLabels[1].textContent = 'Email';
        if (contactRowLabels[2]) contactRowLabels[2].textContent = 'Headquarters';
        if (contactRowLabels[3]) contactRowLabels[3].textContent = 'Madurai Branch';
        if (contactRowLabels[4]) contactRowLabels[4].textContent = 'Bangalore Branch';
        if (contactRowLabels[5]) contactRowLabels[5].textContent = 'Working Hours';

        setText('#contact-wa-link', 'Chat on WhatsApp →');
        setText('#contact-mail-link', 'supremeshutters777@gmail.com →');
        setText('#contact .contact-info .contact-row:nth-child(3) .contact-row-val', 'Rajapalayam, Virudhunagar District, Tamil Nadu');
        setText('#contact .contact-info .contact-row:nth-child(4) .contact-row-val', 'Madurai, Tamil Nadu');
        setText('#contact .contact-info .contact-row:nth-child(4) .contact-subtext', 'Central TN — Sales & Installation Support');
        setText('#contact .contact-info .contact-row:nth-child(5) .contact-row-val', 'Bangalore, Karnataka');
        setText('#contact .contact-info .contact-row:nth-child(5) .contact-subtext', 'Nelamangala — Sales & Installation Support');
        setText('#contact .contact-info .contact-row:nth-child(6) .contact-row-val', 'Mon – Sat: 8:00 AM – 9:00 PM');
    }

    // 17. Before / After Gallery
    const baLabelsBefore = document.querySelectorAll('.ba-label.before');
    const baLabelsAfter = document.querySelectorAll('.ba-label.after');
    baLabelsBefore.forEach(lbl => lbl.textContent = isTa ? 'முன்னர்' : 'Before');
    baLabelsAfter.forEach(lbl => lbl.textContent = isTa ? 'பின்னர்' : 'After');
    setText('#before-after .ba-main-desc',
        'Drag the slider to see how Supreme shutters transform shopfronts across Tamil Nadu — real projects, real results.',
        'சுப்ரீம் ஷட்டர்கள் தமிழகம் முழுவதும் உள்ள கடைகளின் முகப்புகளை எவ்வாறு மாற்றுகின்றன என்பதைக் காண ஸ்லைடரை இழுக்கவும் — உண்மையான திட்டங்கள், உண்மையான முடிவுகள்.'
    );

    const baTitles = document.querySelectorAll('.ba-caption-title');
    const baDescs = document.querySelectorAll('.ba-caption-desc');
    const baMetas = document.querySelectorAll('.ba-caption-meta');
    baTitles.forEach(el => el.textContent = '');
    baDescs.forEach(el => el.textContent = '');
    baMetas.forEach(el => el.innerHTML = '');

    // 18. Smart Recommendation Header
    setText('#smart-recs .recs-title', isTa ? 'உங்களுக்கு இதுவும் தேவைப்படலாம்' : 'You Might Also Need');
    setText('#smart-recs #recs-reason', isTa ? 'உங்கள் தேர்வுகளின் அடிப்படையில் பிரிக்கப்பட்டது' : 'Based on your selections');

    // 19. Testimonials
    const testiTexts = document.querySelectorAll('#testimonials .testi-text');
    const testiLocs = document.querySelectorAll('#testimonials .testi-loc');
    if (isTa) {
        if (testiTexts[0]) testiTexts[0].textContent = '"எங்கள் முழு ஷோரூம் முகப்பையும் மாற்றினோம் — 4 மோட்டார் ஷட்டர்கள். முற்றிலும் சத்தமில்லா இயக்கம், குறைபாடற்ற பூசு. தள வருகை முதல் ஒப்படைப்பு வரை சுப்ரீம் குழுவினர் தொழிலமுறையாக செயல்பட்டனர். மிகவும் பரிந்துரைக்கிறேன்."';
        if (testiLocs[0]) testiLocs[0].textContent = 'ராஜபாளையம் · ஷோரூம் உரிமையாளர்';
        if (testiTexts[1]) testiTexts[1].textContent = '"நிறுவப்பட்ட 2 ஆண்டுகளுக்குப் பிறகு ஒரு சிறிய சிக்கலாக அழைத்தேன் — அவர்கள் அடுத்த நாள் காலையிலேயே வந்து எந்தக் கட்டணமும் இன்றி அதைச் சரிசெய்தனர். அத்தகைய விற்பனைக்குப் பிறைய சேவை அரிதானது. தயக்கமின்றி 5 நட்சத்திரங்கள்."';
        if (testiLocs[1]) testiLocs[1].textContent = 'விருதநகர் · கிடங்கு';
        if (testiTexts[2]) testiTexts[2].textContent = '"எனது மருந்தகத்திற்கான பாலிகார்பனேட் ஷட்டர்கள் — மூடியிருக்கும் போது கூட வாடிக்கையாளர்கள் கடையைப் பார்க்க முடியும். தரம் சிறப்பாக உள்ளது மற்றும் விலை நியாயமானது. சுப்ரீம் நிறுவனத்தில் மிகவும் திருப்தி அடைகிறேன்."';
        if (testiLocs[2]) testiLocs[2].textContent = 'மதுரை · மருந்தகம்';
        if (testiTexts[3]) testiTexts[3].textContent = '"எங்கள் தொழில்காலை வாயிலுக்கான தொழில்துறை ஷட்டர்கள் — 22 அடி அகலம். அதை அவர்கள் மிகச்சரியாகக் கையாண்டனர். மெனமையான கியர் செயல்பாடு, உறுதியான வெல்டிங் தரம் மற்றும் சொன்ன நேரத்தில் வழங்கப்பட்டது."';
        if (testiLocs[3]) testiLocs[3].textContent = 'சிவகாசி · தொழில்காலை';
        if (testiTexts[4]) testiTexts[4].textContent = '"பெங்களூர் கிளைக்குழு மிகவும் பொறுப்பாக செயல்பட்டது. நெலமங்கலாவில் உள்ள எங்கள் கிடங்கில் 3 ஷட்டர்களை நிறுவினோம். நேர்த்தியான வேலை, நல்ல தொடர்பு மற்றும் வெளிப்படையான பிலிங்."';
        if (testiLocs[4]) testiLocs[4].textContent = 'பெங்களூர் · தளவாட நிறுவனம்';
        if (testiTexts[5]) testiTexts[5].textContent = '"10 ஆண்டுகள் பழமையான சுப்ரீம் ஷட்டர் இன்னும் சரியாக வேலை செய்கிறது — வருடாந்திர சேவையை இப்போதான் முடித்தோம். நீண்ட காலம் உழைக்கக்கூடியது. எங்கள் புதிய கிளையைக்கு மேலும் இரண்டை ஆர்டர் செய்வோம்."';
        if (testiLocs[5]) testiLocs[5].textContent = 'தென்காசி · ஜவுளி கடை';
    } else {
        if (testiTexts[0]) testiTexts[0].textContent = '"Got our entire showroom front done — 4 motorized shutters. Perfectly silent, flawless finish. Supreme\'s team was professional from site visit to handover. Highly recommended."';
        if (testiLocs[0]) testiLocs[0].textContent = 'Rajapalayam · Showroom Owner';
        if (testiTexts[1]) testiTexts[1].textContent = '"Called for a warranty issue 2 years after installation — they came the next morning and fixed it without any charge. That kind of after-service is rare. 5 stars without hesitation."';
        if (testiLocs[1]) testiLocs[1].textContent = 'Virudhunagar · Warehouse';
        if (testiTexts[2]) testiTexts[2].textContent = '"Polycarbonate shutters for my pharmacy — customers can see the store even when closed. Quality is excellent and the price was fair. Very satisfied with Supreme."';
        if (testiLocs[2]) testiLocs[2].textContent = 'Madurai · Pharmacy';
        if (testiTexts[3]) testiTexts[3].textContent = '"Industrial shutters for our factory gate — 22ft wide. They handled it perfectly. Smooth gear operation, solid weld quality, and delivered exactly on time."';
        if (testiLocs[3]) testiLocs[3].textContent = 'Sivakasi · Factory';
        if (testiTexts[4]) testiTexts[4].textContent = '"Bangalore branch team was very responsive. Got 3 shutters installed in our Nelamangala warehouse. Neat work, good communication, and transparent billing."';
        if (testiLocs[4]) testiLocs[4].textContent = 'Bangalore · Logistics Firm';
        if (testiTexts[5]) testiTexts[5].textContent = '"10-year-old Supreme shutter still working perfectly — just had the annual service done. Built to last. Will order two more for our new branch."';
        if (testiLocs[5]) testiLocs[5].textContent = 'Tenkasi · Textile Shop';
    }

    // 20. Product Comparison
    setText('#compare .cmp-main-desc',
        'Compare our shutter types side by side to find the perfect fit for your space and budget.',
        'உங்கள் இடம் மற்றும் பட்ஜெட்டுக்கு மிகவும் பொருந்தமானதைக் கண்டறிய எங்கள் ஷட்டர் வகைகளை அருகருகே ஒப்பிட்டுப் பாருங்கள்.'
    );
    const compTableHeads = document.querySelectorAll('#compare th');
    if (isTa) {
        if (compTableHeads[0]) compTableHeads[0].textContent = 'அம்சங்கள்';
        setHtml('#th-manual', '<i class="fas fa-hand-paper"></i><br>கைமுறை (Manual)');
        setHtml('#th-gear', '<i class="fas fa-cog"></i><br>கியர் (Gear)');
        setHtml('#th-motor', '<span class="cmp-badge">பிரபலம்</span><i class="fas fa-bolt"></i><br>தானியங்கி மோட்டார்');
        setHtml('#th-security', '<i class="fas fa-shield-alt"></i><br>உயர் பாதுகாப்பு');
    } else {
        if (compTableHeads[0]) compTableHeads[0].textContent = 'Feature';
        setHtml('#th-manual', '<i class="fas fa-hand-paper"></i><br>Manual');
        setHtml('#th-gear', '<i class="fas fa-cog"></i><br>Gear');
        setHtml('#th-motor', '<span class="cmp-badge">POPULAR</span><i class="fas fa-bolt"></i><br>Motorized');
        setHtml('#th-security', '<i class="fas fa-shield-alt"></i><br>High-Security');
    }

    const tableRows = document.querySelectorAll('#compare tbody tr');
    if (tableRows.length >= 10) {
        const r0Cells = tableRows[0].querySelectorAll('td');
        r0Cells[0].textContent = isTa ? 'செயல்பாடு' : 'Operation';
        r0Cells[1].textContent = isTa ? 'கைமுறை புஷ்' : 'Push Up';
        r0Cells[2].textContent = isTa ? 'கியர் ஹேண்டில்' : 'Gear Handle';
        r0Cells[3].textContent = isTa ? 'ரிமோட் / சுவிட்ச்' : 'Remote / Switch';
        r0Cells[4].textContent = isTa ? 'சாவி + பூட்டு' : 'Key + Lock';

        const r1Cells = tableRows[1].querySelectorAll('td');
        r1Cells[0].textContent = isTa ? 'மின்சாரம் தேவையா?' : 'Electricity Needed';
        r1Cells[1].textContent = isTa ? '✗ இல்லை' : '✗ No';
        r1Cells[2].textContent = isTa ? '✗ இல்லை' : '✗ No';
        r1Cells[3].textContent = isTa ? '✓ ஆம்' : '✓ Yes';
        r1Cells[4].textContent = isTa ? '✗ இல்லை' : '✗ No';

        const r2Cells = tableRows[2].querySelectorAll('td');
        r2Cells[0].textContent = isTa ? 'சிறந்த பயன்பாடு' : 'Best Application';
        r2Cells[1].textContent = isTa ? 'சிறிய கடைகள்' : 'Small shops';
        r2Cells[2].textContent = isTa ? 'நடுதர கடைகள்' : 'Medium shops';
        r2Cells[3].textContent = isTa ? 'ஷோரூம்கள் / பெரியவை' : 'Showrooms / Large';
        r2Cells[4].textContent = isTa ? 'வங்கிகள் / நகைக்கடைகள்' : 'Banks / Jewellery';

        const r3Cells = tableRows[3].querySelectorAll('td');
        r3Cells[0].textContent = isTa ? 'தொடக்க விலை' : 'Starting Rate';
        r3Cells[1].textContent = isTa ? '₹220/ச.அடி' : '₹220/sqft';
        r3Cells[2].textContent = isTa ? '₹320/ச.அடி' : '₹320/sqft';
        r3Cells[3].textContent = isTa ? '₹470/ச.அடி' : '₹470/sqft';
        r3Cells[4].textContent = isTa ? 'தனிப்பயன் மேற்கோள்' : 'Custom Quote';

        const r4Cells = tableRows[4].querySelectorAll('td');
        r4Cells[0].textContent = isTa ? 'சத்தத்தின் அளவு' : 'Noise Level';
        r4Cells[1].textContent = isTa ? 'குறைவு' : 'Low';
        r4Cells[2].textContent = isTa ? 'மிகக் குறைவு' : 'Very Low';
        r4Cells[3].textContent = isTa ? 'அமைதியான மோட்டார்' : 'Silent Motor';
        r4Cells[4].textContent = isTa ? 'குறைவு' : 'Low';

        const r5Cells = tableRows[5].querySelectorAll('td');
        r5Cells[0].textContent = isTa ? 'தானியங்கி டைமர்' : 'Auto Timer / App';
        r5Cells[1].textContent = isTa ? '✗ இல்லை' : '✗';
        r5Cells[2].textContent = isTa ? '✗ இல்லை' : '✗';
        r5Cells[3].textContent = isTa ? '✓ கிடைக்கிறது' : '✓ Available';
        r5Cells[4].textContent = isTa ? '✗ இல்லை' : '✗';

        const r6Cells = tableRows[6].querySelectorAll('td');
        r6Cells[0].textContent = isTa ? 'பராமரிப்பு அளவு' : 'Maintenance';
        r6Cells[1].textContent = isTa ? 'மிகக் குறைவு' : 'Very Low';
        r6Cells[2].textContent = isTa ? 'குறைவு' : 'Low';
        r6Cells[3].textContent = isTa ? 'குறைவு' : 'Low';
        r6Cells[4].textContent = isTa ? 'குறைவு' : 'Low';

        const r7Cells = tableRows[7].querySelectorAll('td');
        r7Cells[0].textContent = isTa ? 'எதிர்பார்க்கும் ஆயுள்' : 'Expected Lifespan';
        r7Cells[1].textContent = isTa ? '15–20 ஆண்டுகள்' : '15–20 yrs';
        r7Cells[2].textContent = isTa ? '18–25 ஆண்டுகள்' : '18–25 yrs';
        r7Cells[3].textContent = isTa ? '15–20 ஆண்டுகள்' : '15–20 yrs';
        r7Cells[4].textContent = isTa ? '20–30 ஆண்டுகள்' : '20–30 yrs';

        const r8Cells = tableRows[8].querySelectorAll('td');
        r8Cells[0].textContent = isTa ? 'சேவை உத்தரவாதம்' : 'Warranty';
        r8Cells[1].textContent = isTa ? '✓ 5 ஆண்டுகள்' : '✓ 5 Years';
        r8Cells[2].textContent = isTa ? '✓ 5 ஆண்டுகள்' : '✓ 5 Years';
        r8Cells[3].textContent = isTa ? '✓ 5 ஆண்டுகள்' : '✓ 5 Years';
        r8Cells[4].textContent = isTa ? '✓ 5 ஆண்டுகள்' : '✓ 5 Years';

        const r9Cells = tableRows[9].querySelectorAll('td');
        r9Cells[0].textContent = isTa ? 'பாதுகாப்பு நிலை' : 'Security Level';
    }

    // 21. Product Configurator
    setText('#cfg-label-1', isTa ? '1. இயக்க இயந்திரம் வகை' : '1. Mechanism Type');
    setText('#cfg-label-2', isTa ? '2. ஷீட் வண்ண சாயல்' : '2. Sheet Tint');
    setText('#product-configurator .config-note-text',
        '*Note: Final powder-coat finish will be matched to your RAL choice.',
        '*குறிப்பு: இறுதி பவுடர்-கோட் பூசு உங்கள் ஆர்ஏஎல் (RAL) தேர்வுக்கு ஏற்ப பொருத்தப்படும்.'
    );
    setText('#product-configurator .config-submit-btn', isTa ? 'இந்த வடிவமைப்பைப் பற்றி விசாரிக்கவும்' : 'Enquire About This Build');

    const configButtons = document.querySelectorAll('.config-controls button:not(.config-submit-btn)');
    if (configButtons.length >= 3) {
        if (isTa) {
            configButtons[0].textContent = 'மேனுவல் புஷ்';
            configButtons[1].textContent = 'கியர் பாக்ஸ்';
            configButtons[2].textContent = 'மின்சார மோட்டார்';
        } else {
            configButtons[0].textContent = 'Manual Push';
            configButtons[1].textContent = 'Gear Box';
            configButtons[2].textContent = 'Electric Motor';
        }
    }

    const activeConfigBtn = document.querySelector('.config-btn.active');
    const badge = document.getElementById('type-badge');
    if (activeConfigBtn && badge) {
        const btnText = activeConfigBtn.textContent.trim();
        if (btnText === 'Manual Push' || btnText === 'மேனுவல் புஷ்') badge.innerText = isTa ? 'மேனுவல் முறை' : 'Manual Mode';
        if (btnText === 'Gear Box' || btnText === 'கியர் பாக்ஸ்') badge.innerText = isTa ? 'கியர் அமைப்பு' : 'Gear System';
        if (btnText === 'Electric Motor' || btnText === 'மின்சார மோட்டார்') badge.innerText = isTa ? 'மின்சார மோட்டார்' : 'Electric Motor';
    }

    // 22. Trust Badges Strip Bottom Footer
    const trustItems = document.querySelectorAll('#trustBar .trust-item span');
    if (isTa) {
        if (trustItems[0]) trustItems[0].textContent = 'சொந்த உற்பத்தி யூனிட்';
        if (trustItems[1]) trustItems[1].textContent = 'மறைமுக கட்டணங்கள் இல்லை';
        if (trustItems[2]) trustItems[2].textContent = 'இலவச தளம் & மதிப்பீடு';
        if (trustItems[3]) trustItems[3].textContent = 'ஆண்டு பராமரிப்பு திட்டங்கள்';
    } else {
        if (trustItems[0]) trustItems[0].textContent = 'In-House Fabrication';
        if (trustItems[1]) trustItems[1].textContent = 'Hidden Charges';
        if (trustItems[2]) trustItems[2].textContent = 'Site Visit & Estimate';
        if (trustItems[3]) trustItems[3].textContent = 'Annual Maintenance Plans';
    }

    // 23. Floating Action Callouts & Footers
    setText('#wa-float .wa-float-label', isTa ? 'விலை விபரம்' : 'Get Quote');
    setText('footer .footer-brand', isTa ? 'சுப்ரீம். ரோலிங் ஷட்டர்கள்' : 'Supreme. Rolling Shutters');
    setText('footer .footer-copy', isTa
        ? '© 2026 சுப்ரீம் ரோலிங் ஷட்டர்கள். தொடக்கம் 2003 · ராஜபாளையம் தலைமையகம் · மதுரை கிளை · பெங்களூர் கிளை · தென்னிந்தியா முழுவதும்.'
        : '© 2026 Supreme Rolling Shutters. Est. 2003 · Rajapalayam HQ · Madurai Branch · Bangalore Branch · Pan south india'
    );

    bindCursorHover();
}

function switchLang(lang) {
    document.querySelectorAll('#lang-toggle .lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    translatePage(lang);
}

// Initialize saved translation state at compilation runtime lifecycle
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('supreme-lang') || 'en';
    switchLang(savedLang);
});

/* ── 30. CONTEXTUAL DYNAMIC RECOMMENDATIONS LOGIC ── */
function showRecommendations(trigger, reason) {
    const container = document.getElementById('recs-container');
    const section = document.getElementById('smart-recs');
    const reasonEl = document.getElementById('recs-reason');
    const isTa = (localStorage.getItem('supreme-lang') === 'ta');

    if (!container || !section) return;
    reasonEl.textContent = reason;

    const recsPool = {
        motor: [
            {
                name: "Heavy-Duty UPS System", nameTa: "ஹெவிய-டியூட்டி யூபிஎஸ் பேக்கப்",
                desc: "Ensures operational readiness during unexpected power grid failures. Up to 15 emergency open/close operational cycles.",
                descTa: "மின் தடை காலங்களிலும் அவசர இயக்கத்தை உறுதி செய்கிறது. 15 முறை அவசரகால இயக்க சுழற்சிகள் வரை இயங்கும்.",
                icon: "fa-battery-full", price: "₹14,500", label: "Power Backup", labelTa: "மின்சாரம் பேக்கப்"
            },
            {
                name: "Multi-Channel Smart Remote", nameTa: "மல்டி-சேனல் ஸ்மார்ட் ரிமோட்",
                desc: "Control up to 4 commercial shutters independently with long-range encrypted rolling codes from a single handset device.",
                descTa: "ஒரே ரிமோட் சாதனத்தில் இருந்து 4 வணிக ஷட்டர்கள் வரை தனித்தனியாக நீண்ட தூர குறியாக்கத்துடன் கட்டுப்படுத்தலாம்.",
                icon: "fa-rss", price: "₹2,400", label: "Access Control", labelTa: "அணுகல் கட்டுப்பாடு"
            }
        ],
        high_risk: [
            {
                name: "Mechanical Anti-Lift Lock Profile", nameTa: "மெக்கானிக்கல் ஆண்டி-லிப்ட் லாக்",
                desc: "Interlocking bottom steel profile completely prevents heavy manual crowbar lifting attempts from intruder elements.",
                descTa: "ஊடறுவலர்களால கீழே இருந்து லீவர் அல்லது குரோபார் மூலம் ஷட்டரை பலவந்தமாக தூக்குவதை முற்றிலும் தடுக்கிறது.",
                icon: "fa-lock", price: "₹3,500", label: "Security Plus", labelTa: "கூடுதல் பாதுகாப்பு"
            }
        ]
    };

    let selected = [];
    if (trigger === 'motor') selected = recsPool.motor;
    if (trigger === 'madurai-clicked') selected = recsPool.high_risk;

    if (selected.length === 0) { section.classList.remove('show'); return; }

    container.innerHTML = '';
    selected.forEach(item => {
        const card = document.createElement('div');
        card.className = 'rec-card';
        card.onclick = () => { window.location.hash = '#contact'; };

        card.innerHTML = `
            <div class="rec-icon"><i class="fas ${item.icon}"></i></div>
            <div class="rec-why">${isTa ? item.labelTa : item.label}</div>
            <div class="rec-name">${isTa ? item.nameTa : item.name}</div>
            <div class="rec-desc">${isTa ? item.descTa : item.desc}</div>
            <div class="rec-price">${item.price} <span>${isTa ? '*தோராயமாக' : '*approx'}</span></div>
            <a href="#contact" class="rec-cta">${isTa ? 'இணைப்பைச் சேர்க்கவும்' : 'Add To Inquiry'} <i class="fas fa-plus"></i></a>
        `;
        container.appendChild(card);
    });

    section.classList.add('show');
    bindCursorHover();
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

// Setup contextual hook intercepts inside the operational calculator runner module execution thread
const originalCalcRun = calcRun;
calcRun = function () {
    originalCalcRun();
    const op = document.getElementById('c-op').value;
    const isTa = (localStorage.getItem('supreme-lang') === 'ta');
    if (op === 'motor') {
        setTimeout(() => {
            showRecommendations('motor', isTa ? 'நீங்கள் மோட்டார் ஷட்டரைத் தேர்ந்தெடுத்ததால்' : "Because you selected a motorized shutter system configuration build");
        }, 1200);
    }
};

// Contextual trigger binding on Interactive Geographic SVG Vector Elements Click Events Handler
document.querySelectorAll('.map-district').forEach(district => {
    district.addEventListener('click', function () {
        const name = this.dataset.district;
        const isTa = (localStorage.getItem('supreme-lang') === 'ta');
        if (name === 'madurai') {
            setTimeout(() => {
                showRecommendations('madurai-clicked', isTa ? 'நீங்கள் மதுரையில் ஆர்வம் காட்டுவதால்' : "Since you're interested in Madurai network services metrics data points");
            }, 1500);
        }
    });
});

/* ── NOTIFICATION HELPER ── */
function showNotification(message) {
    const notif = document.createElement('div');
    notif.style.cssText = `
        position: fixed;
        top: 24px;
        left: 50%;
        transform: translateX(-50%) translateY(-100px);
        background: var(--yellow);
        color: #000;
        padding: 14px 28px;
        border-radius: 4px;
        font-family: 'DM Mono', monospace;
        font-size: 0.7rem;
        font-weight: 700;
        letter-spacing: 0.12em;
        z-index: 99999;
        box-shadow: 0 8px 24px rgba(255, 215, 0, 0.4);
        transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    `;
    notif.textContent = message;
    document.body.appendChild(notif);

    setTimeout(() => { notif.style.transform = 'translateX(-50%) translateY(0)'; }, 100);
    setTimeout(() => {
        notif.style.transform = 'translateX(-50%) translateY(-100px)';
        setTimeout(() => { notif.remove(); }, 400);
    }, 4000);
}
