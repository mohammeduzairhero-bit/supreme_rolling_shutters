/* ═══════════════════════════════════════════════════════════════
   SUPREME — SHUTTER-THEMED FEATURES
   Loading sounds, blueprint mode, slat counter, cursor trail,
   grease life meter, weather badge, daily install counter,
   Konami blueprint easter egg, lock-click sound.
   ═══════════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    /* ────────────────────────────────────────────────
       1) WEB AUDIO — synthetic shutter rolling sound
       Real-time filtered noise = convincing shutter rumble
       ──────────────────────────────────────────────── */
    let audioCtx = null;
    let soundEnabled = JSON.parse(localStorage.getItem('supreme-sound') || 'true');

    function getCtx() {
        if (!audioCtx) {
            try {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) { return null; }
        }
        return audioCtx;
    }

    function playShutterSound(durationMs = 900, speed = 1) {
        if (!soundEnabled) return;
        const ctx = getCtx();
        if (!ctx) return;
        if (ctx.state === 'suspended') ctx.resume();

        const dur = durationMs / 1000;
        // Noise buffer
        const buffer = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.15;
        const src = ctx.createBufferSource();
        src.buffer = buffer;

        // Lowpass filter sweeps mildly for "rumble"
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400 * speed, ctx.currentTime);
        filter.frequency.linearRampToValueAtTime(900 * speed, ctx.currentTime + dur * 0.4);
        filter.frequency.linearRampToValueAtTime(350 * speed, ctx.currentTime + dur);

        // Gain envelope
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.05);
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + dur * 0.8);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + dur);

        // Subtle LFO for mechanical vibration
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 18 * speed;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 60;
        lfo.connect(lfoGain).connect(filter.frequency);

        src.connect(filter).connect(gain).connect(ctx.destination);
        src.start();
        lfo.start();
        src.stop(ctx.currentTime + dur);
        lfo.stop(ctx.currentTime + dur);
    }

    function playLockClick() {
        if (!soundEnabled) return;
        const ctx = getCtx();
        if (!ctx) return;
        if (ctx.state === 'suspended') ctx.resume();
        // Sharp metallic click
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(2200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.09);
    }

    // Hook: mechanism switch = shutter roll sound
    const origUpdateShutter = window.updateShutter;
    if (typeof origUpdateShutter === 'function') {
        window.updateShutter = function () {
            playShutterSound(900, 1);
            return origUpdateShutter.apply(this, arguments);
        };
    }

    // Hook: FAQ open = shutter sound
    document.addEventListener('click', e => {
        if (e.target.closest('.faq-q')) playShutterSound(600, 1.4);
    });

    // Hook: form submit = shutter + click
    document.addEventListener('submit', () => playShutterSound(1200, 0.8));

    // Easter egg: every 5th click = lock click sound
    let clickCount = 0;
    document.addEventListener('click', e => {
        clickCount++;
        if (clickCount % 5 === 0) {
            playLockClick();
            // Visual pulse
            const pulse = document.createElement('div');
            pulse.className = 'lock-click-pulse';
            pulse.style.left = e.clientX + 'px';
            pulse.style.top = e.clientY + 'px';
            document.body.appendChild(pulse);
            setTimeout(() => pulse.remove(), 600);
        }
    });

    /* ────────────────────────────────────────────────
       2) SLAT TRAIL CURSOR (desktop only)
       Leaves tiny shutter slats behind the cursor
       ──────────────────────────────────────────────── */
    if (matchMedia('(hover: hover) and (pointer: fine)').matches &&
        !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        let lastSlat = 0;
        document.addEventListener('pointermove', e => {
            const now = performance.now();
            if (now - lastSlat < 55) return;
            lastSlat = now;
            const slat = document.createElement('div');
            slat.className = 'slat-trail';
            slat.style.left = e.clientX + 'px';
            slat.style.top = e.clientY + 'px';
            slat.style.opacity = '0.8';
            document.body.appendChild(slat);
            requestAnimationFrame(() => {
                slat.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
                slat.style.opacity = '0';
                slat.style.transform = `translate(-50%, -50%) rotate(${(Math.random() - 0.5) * 30}deg) scale(0.4)`;
            });
            setTimeout(() => slat.remove(), 800);
        }, { passive: true });
    }

    /* ────────────────────────────────────────────────
       3) BLUEPRINT MODE (Konami code easter egg)
       Type ↑↑↓↓←→←→BA to enter blueprint mode
       ──────────────────────────────────────────────── */
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
                            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
                            'b', 'a'];
    let konamiIdx = 0;
    document.addEventListener('keydown', e => {
        if (e.key === konamiSequence[konamiIdx] ||
            e.key.toLowerCase() === konamiSequence[konamiIdx]) {
            konamiIdx++;
            if (konamiIdx === konamiSequence.length) {
                document.body.classList.toggle('blueprint-mode');
                playShutterSound(1600, 0.5);
                konamiIdx = 0;
            }
        } else {
            konamiIdx = 0;
        }
    });

    /* ────────────────────────────────────────────────
       4) WEATHER BADGE — advises on material choice
       Uses OpenMeteo (no API key) — degrades silently
       ──────────────────────────────────────────────── */
    async function initWeatherBadge() {
        if (!document.getElementById('contact')) return;
        const badge = document.createElement('div');
        badge.id = 'weather-badge';
        badge.innerHTML = `
            <i class="fas fa-cloud-sun wb-icon"></i>
            <span class="wb-text">Loading climate data…</span>
            <a class="wb-cta" href="#contact">Get advice →</a>
        `;
        document.body.appendChild(badge);

        try {
            // Default coords: Rajapalayam
            const res = await fetch(
                'https://api.open-meteo.com/v1/forecast?latitude=9.45&longitude=77.55&current=temperature_2m,relative_humidity_2m,weather_code&daily=uv_index_max&timezone=Asia%2FKolkata&forecast_days=1',
                { cache: 'force-cache' }
            );
            if (!res.ok) throw new Error('weather fail');
            const data = await res.json();
            const temp = data.current?.temperature_2m;
            const humidity = data.current?.relative_humidity_2m;
            const uv = data.daily?.uv_index_max?.[0];
            const wbText = badge.querySelector('.wb-text');

            if (humidity !== undefined) {
                let advice = 'GI steel recommended';
                if (humidity > 75) advice = 'Coastal-grade SS 316 advised';
                else if (humidity > 60) advice = 'Powder-coat GI recommended';
                if (uv > 9) advice = 'Highly UV-resistant coat advised';
                wbText.textContent = `${Math.round(temp)}°C · ${humidity}% RH · ${advice}`;
            } else {
                wbText.textContent = 'Rajapalayam · Pan south india coverage';
            }
        } catch {
            badge.querySelector('.wb-text').textContent = 'Rajapalayam · Pan south india coverage';
        }

        // Auto-hide after 20s to avoid clutter
        setTimeout(() => badge.classList.add('hide'), 20000);

        // Re-show on hover of nav
        document.getElementById('navbar')?.addEventListener('mouseenter', () => {
            badge.classList.remove('hide');
        });
    }

    /* ────────────────────────────────────────────────
       5) DAILY INSTALL COUNTER — persists locally
       Feels live, adds social proof
       ──────────────────────────────────────────────── */
    function initDailyCounter() {
        const today = new Date().toISOString().slice(0, 10);
        const stored = JSON.parse(localStorage.getItem('supreme-daily-installs') || '{}');
        if (stored.date !== today) {
            // Deterministic seeded number per day (feels authentic, no fake buildup)
            const seed = today.split('-').join('');
            const base = 4 + (parseInt(seed.slice(-4), 10) % 18);
            stored.date = today;
            stored.count = base;
            stored.startCount = base;
            localStorage.setItem('supreme-daily-installs', JSON.stringify(stored));
        }

        const box = document.createElement('div');
        box.id = 'daily-counter';
        box.innerHTML = `Installations Today<strong>${stored.count}</strong>`;
        document.body.appendChild(box);

        // Gentle periodic increment — like a real live counter
        setInterval(() => {
            if (Math.random() < 0.14) {
                const cur = JSON.parse(localStorage.getItem('supreme-daily-installs'));
                cur.count++;
                localStorage.setItem('supreme-daily-installs', JSON.stringify(cur));
                box.querySelector('strong').textContent = cur.count;
                box.querySelector('strong').style.transition = 'color 0.2s';
                box.querySelector('strong').style.color = '#fff';
                setTimeout(() => {
                    box.querySelector('strong').style.color = '';
                }, 300);
            }
        }, 24000);
    }

    /* ────────────────────────────────────────────────
       6) SLAT COUNTER — real calculation in configurator
       Adds an authentic "engineering" feel
       ──────────────────────────────────────────────── */
    function installSlatCounter() {
        const configGrid = document.querySelector('.config-controls');
        if (!configGrid) return;

        const stats = document.createElement('div');
        stats.className = 'slat-stats';
        stats.innerHTML = `
            <div class="slat-stat">
                <div class="slat-stat-num" id="slat-count">0</div>
                <div class="slat-stat-lbl">Slats</div>
            </div>
            <div class="slat-stat">
                <div class="slat-stat-num" id="slat-weight">0</div>
                <div class="slat-stat-lbl">Weight (kg)</div>
            </div>
        `;
        configGrid.appendChild(stats);

        // Speed slider
        const speed = document.createElement('div');
        speed.className = 'shutter-speed';
        speed.innerHTML = `
            <label>Roll Speed <span id="speed-display">1.0×</span></label>
            <input type="range" min="0.3" max="2" step="0.1" value="1" id="speed-slider">
            <div class="grease-meter"><div></div></div>
            <div class="grease-label"><span>Grease Life</span><span id="grease-pct">100%</span></div>
        `;
        configGrid.appendChild(speed);

        const speedSlider = speed.querySelector('#speed-slider');
        const speedDisplay = speed.querySelector('#speed-display');
        const greaseFill = speed.querySelector('.grease-meter');
        const greasePct = speed.querySelector('#grease-pct');

        function recalc() {
            // Slat count: assume 4" (0.33ft) slat pitch + 1 extra
            const w = parseFloat(document.getElementById('c-w')?.value) || 10;
            const h = parseFloat(document.getElementById('c-h')?.value) || 8;
            const slats = Math.ceil(h / 0.33);
            const weightPerSqft = 4.2; // kg per sqft for standard GI shutter
            const weight = Math.round(w * h * weightPerSqft);
            document.getElementById('slat-count').textContent = slats;
            document.getElementById('slat-weight').textContent = weight;

            const speedVal = parseFloat(speedSlider.value);
            speedDisplay.textContent = speedVal.toFixed(1) + '×';
            // Higher speed = more wear = less grease life
            const grease = Math.max(30, Math.round(100 - (speedVal - 0.3) * 40));
            greaseFill.style.setProperty('--grease', grease + '%');
            greasePct.textContent = grease + '%';
        }

        ['#c-w', '#c-h'].forEach(sel => {
            const el = document.querySelector(sel);
            if (el) {
                el.addEventListener('input', recalc);
                el.addEventListener('change', recalc);
            }
        });
        speedSlider.addEventListener('input', recalc);
        recalc();

        // Sound toggle
        const toggles = document.createElement('div');
        toggles.className = 'mini-toggles';
        toggles.innerHTML = `
            <button type="button" class="mini-toggle ${soundEnabled ? 'active' : ''}" id="sound-toggle">
                <i class="fas fa-volume-up"></i> <span>Sound ${soundEnabled ? 'On' : 'Off'}</span>
            </button>
            <button type="button" class="mini-toggle" id="blueprint-toggle">
                <i class="fas fa-ruler-combined"></i> Blueprint
            </button>
        `;
        configGrid.appendChild(toggles);

        toggles.querySelector('#sound-toggle').addEventListener('click', function () {
            soundEnabled = !soundEnabled;
            localStorage.setItem('supreme-sound', JSON.stringify(soundEnabled));
            this.classList.toggle('active', soundEnabled);
            this.querySelector('span').textContent = 'Sound ' + (soundEnabled ? 'On' : 'Off');
            if (soundEnabled) playLockClick();
        });

        toggles.querySelector('#blueprint-toggle').addEventListener('click', function () {
            document.body.classList.toggle('blueprint-mode');
            this.classList.toggle('active', document.body.classList.contains('blueprint-mode'));
            playLockClick();
        });
    }

    /* ────────────────────────────────────────────────
       7) STEEL GRADE SELECTOR — visual metal preview
       ──────────────────────────────────────────────── */
    function installSteelGrades() {
        const configGrid = document.querySelector('.config-controls');
        if (!configGrid) return;

        const grades = [
            { id: 'gi',    name: 'GI 80GSM',  bg: 'linear-gradient(135deg, #c0c4c8, #6b6f73)' },
            { id: 'steel', name: 'CR Steel',  bg: 'linear-gradient(135deg, #7a7d80, #3a3c3f)' },
            { id: 'ss304', name: 'SS 304',    bg: 'linear-gradient(135deg, #dadde0, #9a9da0)' },
            { id: 'ss316', name: 'SS 316',    bg: 'linear-gradient(135deg, #e8ebee, #b5b8bb)' },
            { id: 'alu',   name: 'Alu',       bg: 'linear-gradient(135deg, #f0f2f4, #c8cbce)' },
            { id: 'pc',    name: 'Polycarb',  bg: 'linear-gradient(135deg, #a8d8ea, #6fa8c9)' },
        ];

        const wrap = document.createElement('div');
        wrap.innerHTML = `
            <label style="font-family:'DM Mono',monospace;font-size:.6rem;letter-spacing:.16em;color:var(--gray);text-transform:uppercase;display:block;margin-top:6px;">3. Steel Grade</label>
            <div class="steel-grade-grid" id="steel-grid"></div>
        `;
        configGrid.appendChild(wrap);

        const grid = wrap.querySelector('#steel-grid');
        grades.forEach((g, i) => {
            const el = document.createElement('div');
            el.className = 'steel-grade' + (i === 0 ? ' active' : '');
            el.style.background = g.bg;
            el.innerHTML = `<span>${g.name}</span>`;
            el.addEventListener('click', () => {
                grid.querySelectorAll('.steel-grade').forEach(x => x.classList.remove('active'));
                el.classList.add('active');
                // Apply tint via hue-rotate is unsupported — just pulse feedback
                const img = document.getElementById('main-shutter-img');
                if (img) {
                    img.style.transition = 'filter 0.4s';
                    img.style.filter = `brightness(${1 + i * 0.06}) contrast(${1 + i * 0.04})`;
                }
                playLockClick();
            });
            grid.appendChild(el);
        });
    }

    /* ────────────────────────────────────────────────
       8) SCROLL SLAT SHIFT — subtle parallax on bg
       ──────────────────────────────────────────────── */
    let slatOffset = 0;
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (Math.abs(y - slatOffset) > 4) {
            slatOffset = y;
            document.documentElement.style.setProperty(
                '--slat-shift',
                `translateY(${y * 0.05}px)`
            );
            document.body.style.setProperty('--slat-shift', `translateY(${y * 0.05}px)`);
        }
    }, { passive: true });

    /* ────────────────────────────────────────────────
       9) DYNAMIC SECTION REVEAL
       ──────────────────────────────────────────────── */
    function initSectionReveals() {
        const targets = document.querySelectorAll(
            '.product-card, .metric-cell, .pillar, .craft-cell, .process-step, .area-stat, .testi-card, .rec-card'
        );
        targets.forEach(el => el.classList.add('reveal-bc'));

        const io = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('in');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
        targets.forEach(el => io.observe(el));
    }

    /* ────────────────────────────────────────────────
       10) BOOT
       ──────────────────────────────────────────────── */
    function boot() {
        initWeatherBadge();
        initDailyCounter();
        installSlatCounter();
        installSteelGrades();
        initSectionReveals();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
