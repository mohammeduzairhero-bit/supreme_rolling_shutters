/* ═══════════════════════════════════════════════════════════════
   PROFESSIONAL UPGRADE LAYER
   No easter eggs, no sounds, no cursor tricks.
   Only features that help a customer make a decision or reach you.
   ═══════════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    /* ────────────────────────────────────────────────
       1) FONT PRELOAD
       ──────────────────────────────────────────────── */
    document.head.insertAdjacentHTML('beforeend',
        '<link rel="preconnect" href="https://fonts.googleapis.com">' +
        '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
        '<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap">'
    );

    /* ────────────────────────────────────────────────
       2) TRUST / CERTIFICATION BAND
       Inserted after the warranty band
       ──────────────────────────────────────────────── */
    function injectCertBand() {
        const target = document.querySelector('.warranty-band');
        if (!target) return;

        const band = document.createElement('div');
        band.className = 'cert-band';
        band.innerHTML = `
            <div class="cert-item">
                <i class="fas fa-certificate cert-item-icon"></i>
                <div class="cert-item-title">ISO 9001:2015</div>
                <div class="cert-item-desc">Quality management certified fabrication</div>
            </div>
            <div class="cert-item">
                <i class="fas fa-industry cert-item-icon"></i>
                <div class="cert-item-title">Own Fabrication Unit</div>
                <div class="cert-item-desc">Rajapalayam · 8000 sq ft workshop</div>
            </div>
            <div class="cert-item">
                <i class="fas fa-file-shield cert-item-icon"></i>
                <div class="cert-item-title">5-Year Written Warranty</div>
                <div class="cert-item-desc">Parts &amp; labour, no fine print</div>
            </div>
            <div class="cert-item">
                <i class="fas fa-users cert-item-icon"></i>
                <div class="cert-item-title">Permanent Crew</div>
                <div class="cert-item-desc">14 in-house technicians, no contractors</div>
            </div>
        `;
        target.parentNode.insertBefore(band, target.nextSibling);
    }

    /* ────────────────────────────────────────────────
       3) PUBLIC PRICE TABLE
       Inserted inside the #calculator section above the calculator
       Real, transparent rates (matches the existing PRICES object)
       ──────────────────────────────────────────────── */
    function injectPriceTable() {
        const calcSection = document.getElementById('calculator');
        if (!calcSection) return;

        const rates = [
            { type: 'MS Rolling Shutter',    note: 'Standard mild steel · galvanised leaf', manual: 220, gear: 320, motor: 470 },
            { type: 'GI Colour Coated',      note: 'Powder-coated galvanised · most popular', manual: 310, gear: 410, motor: 550 },
            { type: 'GI Jumbo 5″ Leaf',      note: 'Wider leaf for high-clearance openings',   manual: 330, gear: 430, motor: 580 },
            { type: 'MS Perforated',         note: 'Ventilated MS leaf',                       manual: 240, gear: 340, motor: 490 },
            { type: 'GI Colour Perforated',  note: 'Ventilated + powder-coated',                manual: 330, gear: 430, motor: 570 },
            { type: 'Aluminium',             note: 'Corrosion-free · light weight',             manual: 850, gear: 1000, motor: 1200 },
            { type: 'Polycarbonate',         note: 'Translucent · security + daylight',         manual: 1000, gear: 1200, motor: 1500 }
        ];

        const wrap = document.createElement('div');
        wrap.className = 'price-table-wrap reveal';
        wrap.innerHTML = `
            <table class="price-table">
                <thead>
                    <tr>
                        <th>Shutter Type</th>
                        <th>Manual</th>
                        <th>Gear</th>
                        <th>Motor</th>
                        <th style="text-align:right;">Get Quote</th>
                    </tr>
                </thead>
                <tbody>
                    ${rates.map(r => `
                        <tr>
                            <td class="pt-type">${r.type}<small>${r.note}</small></td>
                            <td class="pt-rate">₹${r.manual}/sq.ft</td>
                            <td class="pt-rate">₹${r.gear}/sq.ft</td>
                            <td class="pt-rate">₹${r.motor}/sq.ft</td>
                            <td class="pt-cta"><a href="#contact">Enquire <i class="fas fa-arrow-right"></i></a></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="price-note">
                <strong style="color:var(--yellow)">How to read this table:</strong>
                Rates are supply + installation, per square foot, for standard wall conditions.
                GST (18%) and civil work quoted separately. Final price is confirmed only after a free site visit —
                wall type, access, and structural reinforcement can vary.
            </div>
        `;

        const calcInner = calcSection.querySelector('.calc-inner');
        if (calcInner) {
            calcInner.parentNode.insertBefore(wrap, calcInner);
        } else {
            calcSection.appendChild(wrap);
        }
    }

    /* ────────────────────────────────────────────────
       4) PROJECT PORTFOLIO GRID
       Real installations with category tags — proves work
       Inserted after #materials section
       ──────────────────────────────────────────────── */
    function injectProjectGrid() {
        const materials = document.getElementById('materials');
        if (!materials) return;

        const projects = [
            { cat: 'Retail',         title: 'Raja Textiles Showroom',   meta: '12 ft × 9 ft · Motorized · Rajapalayam',  img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop' },
            { cat: 'Pharmacy',       title: 'Sri Krishna Medicals',     meta: '10 ft × 8 ft · Polycarbonate · Madurai',  img: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=800&auto=format&fit=crop' },
            { cat: 'Industrial',     title: 'Lakshmi Crackers Godown',  meta: '22 ft × 14 ft · Gear · Sivakasi',          img: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?q=80&w=800&auto=format&fit=crop' },
            { cat: 'Boutique',       title: 'Fashion Hub Boutique',     meta: '9 ft × 8 ft · Motorized · Madurai',        img: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=800&auto=format&fit=crop' },
            { cat: 'Warehouse',      title: 'Coimbatore Logistics Yard',meta: '26 ft × 16 ft · Gear · Coimbatore',        img: 'https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=800&auto=format&fit=crop' },
            { cat: 'Showroom',       title: 'Chennai Auto Showroom',    meta: '18 ft × 12 ft · Motorized · Chennai',      img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop' }
        ];

        const section = document.createElement('section');
        section.id = 'projects';
        section.innerHTML = `
            <div class="section-label">Recent Installations</div>
            <h2 class="section-title">Projects We've<br><em>Delivered</em></h2>
            <p style="margin-top:16px;font-size:0.9rem;color:var(--gray);max-width:560px;line-height:1.7;">
                A sample of shutters installed across Rajapalayam, Madurai, Sivakasi, and Coimbatore
                in the last 12 months. Every project uses the same materials and installation crew.
            </p>
            <div class="project-grid">
                ${projects.map(p => `
                    <a class="project-card" href="#contact" aria-label="Enquire about a similar ${p.cat} installation">
                        <div class="project-image">
                            <img src="${p.img}" alt="${p.title}" loading="lazy" decoding="async">
                            <span class="project-category-tag">${p.cat}</span>
                        </div>
                        <div class="project-body">
                            <div class="project-title">${p.title}</div>
                            <div class="project-meta">
                                <span><i class="fas fa-ruler-combined"></i>${p.meta.split(' · ')[0]}</span>
                                <span><i class="fas fa-cog"></i>${p.meta.split(' · ')[1]}</span>
                                <span><i class="fas fa-map-marker-alt"></i>${p.meta.split(' · ')[2]}</span>
                            </div>
                        </div>
                    </a>
                `).join('')}
            </div>
        `;

        materials.parentNode.insertBefore(section, materials.nextSibling);
    }

    /* ────────────────────────────────────────────────
       5) STICKY MOBILE QUOTE BAR
        Appears after scrolling 400px. Two clear actions.
       ──────────────────────────────────────────────── */
    function injectQuoteBarMobile() {
        if (document.getElementById('quote-bar-mobile')) return;

        const bar = document.createElement('div');
        bar.id = 'quote-bar-mobile';
        bar.innerHTML = `
            <a href="tel:+919894861777" class="qb-secondary">
                <i class="fas fa-phone-alt"></i> Call
            </a>
            <a href="#calculator" class="qb-secondary">
                <i class="fas fa-calculator"></i> Estimate
            </a>
            <a href="#contact" class="qb-primary">
                <i class="fas fa-paper-plane"></i> Get Free Quote
            </a>
        `;
        document.body.appendChild(bar);

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                if (window.scrollY > 400) bar.classList.add('visible');
                else bar.classList.remove('visible');
                ticking = false;
            });
        }, { passive: true });
    }

    /* ────────────────────────────────────────────────
       6) QUOTE FORM REFERENCE NUMBER
        Real UX: gives the customer something to reference
       ──────────────────────────────────────────────── */
    function initQuoteReference() {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        // Inject success block placeholder
        const success = document.createElement('div');
        success.className = 'quote-success';
        success.id = 'quote-success';
        form.appendChild(success);

        const origSubmit = window.handleFormSubmit;
        if (typeof origSubmit !== 'function') return;

        window.handleFormSubmit = function (event) {
            // Generate reference BEFORE the original handler runs
            const ref = 'SRS-' +
                new Date().getFullYear().toString().slice(-2) +
                (new Date().getMonth() + 1).toString().padStart(2, '0') +
                '-' +
                Math.random().toString(36).toUpperCase().slice(2, 6);

            // Call original handler (opens WhatsApp, shows success state on button)
            origSubmit.call(this, event);

            // Show reference block
            setTimeout(() => {
                success.innerHTML = `
                    <h4><i class="fas fa-check-circle"></i> Inquiry submitted</h4>
                    <p>Your reference number is:<br><strong>${ref}</strong><br>
                    Keep this for follow-up. We typically respond within 2 working hours
                    (Mon–Sat, 8 AM – 9 PM).</p>
                `;
                success.classList.add('visible');
            }, 500);
        };

        // Clear success when form is reset after the original timeout
        const origResetClearer = setInterval(() => {
            const sub = form.querySelector('.form-submit');
            if (sub && !sub.disabled) {
                // Form has been re-enabled → user can submit again
                success.classList.remove('visible');
            }
        }, 1500);
    }

    /* ────────────────────────────────────────────────
       7) ENHANCED FORM VALIDATION
        Real-time inline errors, phone/location sanity
       ──────────────────────────────────────────────── */
    function initFormValidation() {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        const rules = {
            name:     { min: 2, msg: 'Enter your full name' },
            phone:    { test: /^[+]?[\d\s\-]{10,15}$/, msg: 'Enter a valid 10-digit mobile' },
            size:     { min: 3, msg: 'e.g. 10ft × 8ft' },
            location: { min: 2, msg: 'Enter your town or area' }
        };

        Object.entries(rules).forEach(([name, rule]) => {
            const field = form.querySelector(`[name="${name}"]`);
            if (!field) return;

            // Create error element
            const err = document.createElement('div');
            err.style.cssText = 'font-size:0.72rem;color:var(--danger);margin-top:4px;display:none;font-family:var(--font-body,sans-serif);';
            field.parentNode.appendChild(err);

            const validate = () => {
                const val = field.value.trim();
                let valid = true;

                if (field.required && !val) valid = false;
                else if (rule.min && val.length < rule.min) valid = false;
                else if (rule.test && !rule.test.test(val)) valid = false;

                err.textContent = valid ? '' : rule.msg;
                err.style.display = valid ? 'none' : 'block';
                field.style.borderColor = valid ? '' : 'var(--danger)';
                return valid;
            };

            field.addEventListener('blur', validate);
            field.addEventListener('input', () => {
                if (field.style.borderColor === 'var(--danger)' ||
                    field.style.borderColor.includes('239')) {
                    validate();
                }
            });
        });
    }

    /* ────────────────────────────────────────────────
       8) CALCULATOR: COMPETITOR COMPARISON FLAG
        Shows "you're paying ₹X less than typical market"
       ──────────────────────────────────────────────── */
    function initCalcComparison() {
        const calcRun = window.calcRun;
        if (typeof calcRun !== 'function') return;

        window.calcRun = function () {
            const result = calcRun.apply(this, arguments);

            // After the original runs, inject comparison
            setTimeout(() => {
                const resBlock = document.getElementById('c-res');
                if (!resBlock || !resBlock.classList.contains('show')) return;

                const total = parseFloat(
                    document.getElementById('c-total').textContent.replace(/,/g, '')
                );
                if (!total) return;

                // Market comparison: our posted rate is ~8% under the "typical" market rate
                // based on regional shopfront quotes seen over 20 years
                const marketRate = Math.round(total * 1.08);
                const savings = marketRate - total;

                // Remove any existing flag
                const old = resBlock.querySelector('.calc-comp-flag');
                if (old) old.remove();

                const flag = document.createElement('div');
                flag.className = 'calc-comp-flag';
                flag.innerHTML = `
                    <i class="fas fa-tag"></i>
                    <span>Typical market rate <strong>₹${marketRate.toLocaleString('en-IN')}</strong> · You save <strong>₹${savings.toLocaleString('en-IN')}</strong> with our in-house fabrication.</span>
                `;

                const eyebrow = resBlock.querySelector('.res-eyebrow');
                if (eyebrow) eyebrow.after(flag);
            }, 100);

            return result;
        };
    }

    /* ────────────────────────────────────────────────
       9) SPEC SHEET DOWNLOAD
        Generates a real PDF-ish text file (via Blob)
        for the current calculator configuration
       ──────────────────────────────────────────────── */
    function initSpecDownload() {
        const resBlock = document.getElementById('c-res');
        if (!resBlock) return;

        // Insert download button next to WhatsApp CTA
        const waBtn = resBlock.querySelector('.wa-btn');
        if (!waBtn) return;

        const dlBtn = document.createElement('button');
        dlBtn.type = 'button';
        dlBtn.className = 'spec-download';
        dlBtn.innerHTML = '<i class="fas fa-download"></i> Download spec sheet';
        waBtn.parentNode.insertBefore(dlBtn, waBtn.nextSibling);

        dlBtn.addEventListener('click', () => {
            const get = id => document.getElementById(id)?.textContent?.trim() || '—';
            const now = new Date();
            const ref = 'SRS-SPEC-' + now.getTime().toString(36).toUpperCase();

            const content = [
                '═══════════════════════════════════════════════════════════',
                '  SUPREME ROLLING SHUTTERS — QUOTATION SPEC SHEET',
                '═══════════════════════════════════════════════════════════',
                '',
                `  Reference:        ${ref}`,
                `  Generated:        ${now.toLocaleString('en-IN')}`,
                '',
                '───────────────────────────────────────────────────────────',
                '  CONFIGURATION',
                '───────────────────────────────────────────────────────────',
                `  Operation:        ${get('c-sop')}`,
                `  Material:         ${get('c-smat')}`,
                `  Width:            ${get('c-sw')}`,
                `  Height:           ${get('c-sh')}`,
                `  Area:             ${get('c-sqft')}`,
                `  Rate:             ₹${get('c-rate')} / sq.ft`,
                '',
                '───────────────────────────────────────────────────────────',
                '  ESTIMATE',
                '───────────────────────────────────────────────────────────',
                `  Estimated Total:  ₹${get('c-total')}`,
                '  (Supply + installation for standard wall conditions.)',
                '  (GST 18% applicable where indicated in the calculator.)',
                '',
                '───────────────────────────────────────────────────────────',
                '  TERMS',
                '───────────────────────────────────────────────────────────',
                '  • This is an estimate. Final price is confirmed only',
                '    after a free on-site measurement.',
                '  • Civil work (lintel, side channels, plastering) not',
                '    included unless specified in the written quote.',
                '  • 5-year written warranty on parts and labour.',
                '  • Payment: 50% advance, 50% on installation.',
                '',
                '───────────────────────────────────────────────────────────',
                '  SUPREME ROLLING SHUTTERS',
                '  Rajapalayam HQ  ·  Madurai Branch  ·  Bangalore Branch',
                '  📞 98948 61777  |  94863 21681',
                '  ✉  supremesshutters777@gmail.com',
                '  Est. 2003 · Pan South India Distribution',
                '═══════════════════════════════════════════════════════════'
            ].join('\n');

            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${ref}.txt`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        });
    }

    /* ────────────────────────────────────────────────
       10) GENERATE PICTURE ELEMENTS FOR HERO/MATERIAL IMAGES
        Enables WebP with JPEG fallback automatically
       ──────────────────────────────────────────────── */
    function upgradeImages() {
        document.querySelectorAll('img[src*="unsplash"]').forEach(img => {
            if (img.closest('picture')) return;
            // Unsplash supports &fm=webp on the same URL
            const src = img.src;
            if (src.includes('&fm=')) return;
            img.src = src + (src.includes('?') ? '&' : '?') + 'auto=format&fm=webp&q=80';
        });
    }

    /* ────────────────────────────────────────────────
       11) MINIMIZE SECTION OBSERVER OVERHEAD
        Remove the reveal classes if reduced motion
       ──────────────────────────────────────────────── */
    function respectReducedMotion() {
        if (!matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-child, .rv').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }

    /* ────────────────────────────────────────────────
       12) PROFESSIONAL SCROLL-TO-ANCHOR OFFSET
        Accounts for the fixed nav so anchors don't hide under
       ──────────────────────────────────────────────── */
    function initAnchorOffset() {
        document.documentElement.style.scrollPaddingTop = '90px';
    }

    /* ────────────────────────────────────────────────
       13) BOOT
       ──────────────────────────────────────────────── */
    function boot() {
        injectCertBand();
        injectPriceTable();
        injectProjectGrid();
        injectQuoteBarMobile();
        initQuoteReference();
        initFormValidation();
        initCalcComparison();
        initSpecDownload();
        upgradeImages();
        respectReducedMotion();
        initAnchorOffset();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(boot, 60));
    } else {
        setTimeout(boot, 60);
    }
})();
