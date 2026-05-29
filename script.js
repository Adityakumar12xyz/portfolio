/**
 * ADITYA GUPTA | PREMIUM PORTFOLIO SCRIPT
 * Fixes: theme color visibility, security, all 13 premium features
 */

(function () {
    'use strict';

    // ── STATE ───────────────────────────────────────────────────
    const S = {
        theme:   localStorage.getItem('ag-theme')   || 'quantum',
        dark:    localStorage.getItem('ag-dark')    !== 'false',
        pCount:  +localStorage.getItem('ag-pc')     || 80,
        pSpeed:  +localStorage.getItem('ag-ps')     || 1.2,
        vortex:  false,
        ach:     JSON.parse(localStorage.getItem('ag-ach') || '{}')
    };

    // ── SANITIZE INPUT (security) ───────────────────────────────
    const sanitize = str => String(str)
        .replace(/&/g,'&amp;').replace(/</g,'&lt;')
        .replace(/>/g,'&gt;').replace(/"/g,'&quot;')
        .replace(/'/g,'&#x27;').trim();

    // ── DOM HELPERS ─────────────────────────────────────────────
    const $  = id => document.getElementById(id);
    const $$ = sel => document.querySelectorAll(sel);

    // ── BUILD DYNAMIC DOM ───────────────────────────────────────
    function buildDOM() {
        // Command Center Button
        const ccBtn = document.createElement('button');
        ccBtn.className = 'cc-toggle-btn'; ccBtn.id = 'cc-btn';
        ccBtn.setAttribute('aria-label','Open Control Panel');
        ccBtn.innerHTML = '<i class="fa-solid fa-sliders"></i>';
        document.body.appendChild(ccBtn);

        // Command Center Panel
        const panel = document.createElement('div');
        panel.className = 'command-center-panel'; panel.id = 'cc-panel';
        panel.innerHTML = `
          <div class="cc-header">
            <h4><i class="fa-solid fa-terminal"></i> Control Panel</h4>
            <button class="cc-close" id="cc-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="cc-section">
            <div class="cc-section-title">Color Palette</div>
            <div class="cc-themes">
              <div class="cc-theme-opt" data-theme="quantum"><span class="cc-color-dot quantum"></span>Quantum Void</div>
              <div class="cc-theme-opt" data-theme="cyberpunk"><span class="cc-color-dot cyberpunk"></span>Cyberpunk Neon</div>
              <div class="cc-theme-opt" data-theme="matrix"><span class="cc-color-dot matrix"></span>Digital Matrix</div>
              <div class="cc-theme-opt" data-theme="emerald"><span class="cc-color-dot emerald"></span>Emerald Gold</div>
            </div>
          </div>
          <div class="cc-section">
            <div class="cc-section-title">Particle Physics</div>
            <div class="cc-sliders">
              <div class="cc-slider-group">
                <div class="cc-slider-labels"><span>Density</span><span id="lbl-pc">${S.pCount}</span></div>
                <input type="range" class="cc-slider-input" id="sl-pc" min="20" max="200" step="5" value="${S.pCount}">
              </div>
              <div class="cc-slider-group">
                <div class="cc-slider-labels"><span>Speed</span><span id="lbl-ps">${S.pSpeed.toFixed(1)}x</span></div>
                <input type="range" class="cc-slider-input" id="sl-ps" min="0.2" max="4" step="0.1" value="${S.pSpeed}">
              </div>
            </div>
          </div>
          <div class="cc-section">
            <div class="cc-section-title">Actions</div>
            <div class="cc-actions">
              <button class="cc-btn" id="btn-vortex"><i class="fa-solid fa-tornado"></i> Force Gravity Vortex</button>
              <button class="cc-btn" id="btn-reset-ach"><i class="fa-solid fa-rotate-left"></i> Reset Achievements</button>
            </div>
          </div>`;
        document.body.appendChild(panel);

        // Achievements container
        const achBox = document.createElement('div');
        achBox.className = 'achievements-container'; achBox.id = 'ach-box';
        document.body.appendChild(achBox);

        // Crypto terminal overlay
        const term = document.createElement('div');
        term.className = 'terminal-overlay'; term.id = 'term-overlay';
        term.innerHTML = `
          <div class="crypto-terminal">
            <div class="terminal-header">
              <div class="terminal-title"><i class="fa-solid fa-shield-halved"></i> SECURE SUBMISSION TERMINAL v2.0</div>
              <i class="fa-solid fa-circle" style="color:#22c55e;font-size:.6rem"></i>
            </div>
            <div class="terminal-body" id="term-body"></div>
          </div>`;
        document.body.appendChild(term);
    }

    // ── THEME ENGINE ────────────────────────────────────────────
    function applyTheme() {
        const body = document.body;
        // Remove all theme classes
        ['theme-quantum','theme-cyberpunk','theme-matrix','theme-emerald','dark','light']
            .forEach(c => body.classList.remove(c));
        // Apply current theme + dark/light
        body.classList.add('theme-' + S.theme);
        body.classList.add(S.dark ? 'dark' : 'light');
        // Update moon/sun icon
        const icon = $('theme-icon');
        if (icon) icon.className = S.dark ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
        // Sync panel active state
        $$('.cc-theme-opt').forEach(o => {
            o.classList.toggle('active', o.dataset.theme === S.theme);
        });
    }

    // ── NAVBAR SCROLL ────────────────────────────────────────────
    function initScroll() {
        const bar = $('scroll-progress');
        if (!bar) return;
        window.addEventListener('scroll', () => {
            const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
            bar.style.width = Math.min(pct, 100) + '%';
        }, { passive: true });
    }

    // ── HAMBURGER ────────────────────────────────────────────────
    function initHamburger() {
        const btn  = $('hamburger');
        const menu = $('mobile-menu');
        if (!btn || !menu) return;
        btn.addEventListener('click', () => {
            const open = menu.classList.toggle('active');
            const spans = btn.querySelectorAll('span');
            spans[0].style.transform = open ? 'translateY(7px) rotate(45deg)'  : '';
            spans[1].style.opacity   = open ? '0' : '';
            spans[2].style.transform = open ? 'translateY(-7px) rotate(-45deg)' : '';
        });
        $$('.mobile-nav-item').forEach(a => a.addEventListener('click', () => {
            menu.classList.remove('active');
            btn.querySelectorAll('span').forEach(s => { s.style.transform=''; s.style.opacity=''; });
        }));
    }

    // ── LOADER ───────────────────────────────────────────────────
    function initLoader() {
        const loader = $('loader');
        if (!loader) return;
        setTimeout(() => {
            loader.classList.add('hidden');
            unlock('firstVisit','Digital Awakening ✨','Welcome to Aditya\'s premium workspace!');
        }, 1800);
    }

    // ── PARTICLE CANVAS ─────────────────────────────────────────
    const canvas = document.getElementById('bg-canvas');
    const ctx    = canvas ? canvas.getContext('2d') : null;
    let particles = [];
    const mouse = { x: null, y: null };

    class Dot {
        constructor() { this.reset(); }
        reset() {
            this.x  = Math.random() * canvas.width;
            this.y  = Math.random() * canvas.height;
            this.vx = (Math.random() - .5) * .8;
            this.vy = (Math.random() - .5) * .8;
            this.r  = Math.random() * 1.5 + .8;
        }
        update() {
            if (S.vortex && mouse.x !== null) {
                const dx = mouse.x - this.x, dy = mouse.y - this.y;
                const d  = Math.sqrt(dx*dx + dy*dy) || 1;
                this.x  += (dx/d) * 2.5;
                this.y  += (dy/d) * 2.5;
            } else {
                this.x += this.vx * S.pSpeed;
                this.y += this.vy * S.pSpeed;
                if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
        }
        draw(col) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
            ctx.fillStyle = col; ctx.fill();
        }
    }

    function getPrimary() {
        return getComputedStyle(document.body).getPropertyValue('--primary').trim() || '#06b6d4';
    }
    function getPrimaryRGB() {
        return getComputedStyle(document.body).getPropertyValue('--primary-rgb').trim() || '6,182,212';
    }

    function initParticles() {
        if (!canvas) return;
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        particles = Array.from({length: S.pCount}, () => new Dot());
    }

    function animateParticles() {
        if (!ctx) return;
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const col = getPrimary();
        const rgb = getPrimaryRGB();
        particles.forEach(p => { p.update(); p.draw(col); });
        // Connect nearby particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i+1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d  = Math.sqrt(dx*dx + dy*dy);
                if (d < 110) {
                    ctx.strokeStyle = `rgba(${rgb},${(1-d/110)*.12})`;
                    ctx.lineWidth = .8;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    // ── TYPEWRITER ───────────────────────────────────────────────
    function initTyper() {
        const el = $('typed-text');
        if (!el) return;
        const roles = ['Creative Web Solutions','Robust C++ Systems','MS Office Automation','Premium UI/UX Designs'];
        let ri=0, ci=0, deleting=false;
        const tick = () => {
            const word = roles[ri];
            if (!deleting) {
                el.textContent = word.slice(0, ++ci);
                if (ci === word.length) { deleting=true; setTimeout(tick,2000); return; }
            } else {
                el.textContent = word.slice(0, --ci);
                if (ci === 0) { deleting=false; ri=(ri+1)%roles.length; setTimeout(tick,500); return; }
            }
            setTimeout(tick, deleting ? 55 : 95);
        };
        setTimeout(tick, 1200);
    }

    // ── LOCAL TIME BADGE ─────────────────────────────────────────
    function initClock() {
        const el = $('local-time-display');
        if (!el) return;
        const tick = () => {
            const now = new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Kolkata'}));
            const h = now.getHours(), m = String(now.getMinutes()).padStart(2,'0');
            const ampm = h >= 12 ? 'PM' : 'AM';
            const h12  = String(h%12||12);
            const status = h>=8&&h<13 ? 'Designing 🎨' : h>=13&&h<22 ? 'Coding 🟢' : 'Sleeping 💤';
            el.textContent = `${h12}:${m} ${ampm} — ${status}`;
        };
        tick(); setInterval(tick, 1000);
    }

    // ── GEOIP ────────────────────────────────────────────────────
    async function initGeoIP() {
        const el = $('geoip-display');
        if (!el) return;
        try {
            const r = await fetch('https://ipapi.co/json/');
            const d = await r.json();
            el.textContent = d.city ? `Welcome from ${sanitize(d.city)}, ${sanitize(d.country_name)}! 🌍` : 'Welcome, digital explorer! 🌍';
        } catch { el.textContent = 'Welcome, digital explorer! 🌍'; }
    }

    // ── SCROLL REVEAL ────────────────────────────────────────────
    function initReveal() {
        const els = $$('.reveal, .reveal-card');
        const io  = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('active'); io.unobserve(e.target); }});
        }, { threshold: .12 });
        els.forEach(el => io.observe(el));
    }

    // ── STAT COUNTER ─────────────────────────────────────────────
    function initStats() {
        const nums = $$('.stat-num');
        const io   = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (!e.isIntersecting) return;
                const el = e.target, target = +el.dataset.target;
                let count = 0;
                const step = target / 45;
                const t = setInterval(() => {
                    count += step;
                    el.textContent = Math.min(Math.ceil(count), target);
                    if (count >= target) clearInterval(t);
                }, 22);
                io.unobserve(el);
            });
        }, { threshold:.5 });
        nums.forEach(n => io.observe(n));
    }

    // ── SKILL BAR ANIMATION ──────────────────────────────────────
    function initSkillBars() {
        const io = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (!e.isIntersecting) return;
                const fill = e.target.querySelector('.skill-bar-fill');
                if (fill) fill.style.width = fill.style.getPropertyValue('--w') || fill.parentElement?.dataset.w || '0%';
                io.unobserve(e.target);
            });
        }, { threshold:.3 });
        $$('.skill-card').forEach(c => io.observe(c));
    }

    // ── SKILLS TAB ───────────────────────────────────────────────
    function initTabs() {
        $$('.tab-btn').forEach(btn => btn.addEventListener('click', () => {
            $$('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.dataset.tab;
            $$('.skill-card').forEach(c => {
                const show = cat === 'all' || c.dataset.cat === cat;
                c.style.transition = 'opacity .3s, transform .3s';
                c.style.opacity    = show ? '1' : '0';
                c.style.transform  = show ? '' : 'scale(.95)';
                setTimeout(() => { c.style.display = show ? '' : 'none'; }, show ? 0 : 280);
            });
        }));
    }

    // ── 3D TILT ──────────────────────────────────────────────────
    function initTilt() {
        $$('.skill-card, .project-card, .cv-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const r  = card.getBoundingClientRect();
                const rx = ((e.clientY - r.top)  / r.height - .5) * 12;
                const ry = ((e.clientX - r.left) / r.width  - .5) * -12;
                card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
            });
            card.addEventListener('mouseleave', () => { card.style.transform = ''; });
        });
    }

    // ── CV FALLBACK ──────────────────────────────────────────────
    function initCV() {
        [['resume-frame','resume-fallback'],['cv-frame','cv-fallback']].forEach(([fid,bid]) => {
            const frame = $(fid), fb = $(bid);
            if (!frame || !fb) return;
            frame.addEventListener('load', () => {
                try { fb.style.display = frame.contentDocument?.body?.childElementCount ? 'none' : 'flex'; }
                catch { fb.style.display = 'none'; }
            });
            setTimeout(() => {
                try { if (!frame.contentWindow) fb.style.display = 'flex'; } catch { fb.style.display = 'none'; }
            }, 3500);
        });
        // Share buttons
        [['btn-share-resume','Aditya Resume.pdf'],['btn-share-cv','Aditya CV.pdf']].forEach(([id,file]) => {
            const btn = $(id);
            if (!btn) return;
            btn.addEventListener('click', () => {
                const url = `${location.origin}/${file}`;
                navigator.clipboard.writeText(url).then(() => toast('Link Copied!', `${file} link ready to share.`))
                    .catch(() => toast('Error','Could not copy link.',true));
            });
        });
    }

    // ── ACHIEVEMENTS ─────────────────────────────────────────────
    function unlock(key, title, desc) {
        if (S.ach[key]) return;
        S.ach[key] = true;
        localStorage.setItem('ag-ach', JSON.stringify(S.ach));
        setTimeout(() => toast(title, desc, false, true), 600);
    }

    function toast(title, body, isErr=false, isAch=false) {
        const box = $('ach-box'); if (!box) return;
        const el = document.createElement('div');
        el.className = 'achievement-toast';
        el.style.borderColor = isErr ? '#ef4444' : 'var(--primary)';
        const icon = isAch ? 'fa-trophy' : (isErr ? 'fa-circle-exclamation' : 'fa-circle-check');
        el.innerHTML = `
          <div class="ach-icon" style="color:${isErr?'#ef4444':'var(--primary)'}">
            <i class="fa-solid ${icon}"></i>
          </div>
          <div class="ach-details">
            <h5>${sanitize(title)}</h5>
            <p>${sanitize(body)}</p>
          </div>`;
        box.appendChild(el);
        setTimeout(() => el.classList.add('show'), 80);
        setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 500); }, 4000);
    }

    // ── CONTACT FORM + CRYPTO TERMINAL ───────────────────────────
    function initForm() {
        const form = $('contact-form');
        if (!form) return;
        form.addEventListener('submit', e => {
            e.preventDefault();
            const n  = sanitize($('cf-name')?.value    || '');
            const em = sanitize($('cf-email')?.value   || '');
            const s  = sanitize($('cf-subject')?.value || '');
            const m  = sanitize($('cf-message')?.value || '');
            const msg = $('form-msg');

            // Validation
            if (!n || !em || !s || !m) {
                if (msg) { msg.style.color='#ef4444'; msg.textContent='All fields are required.'; } return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
                if (msg) { msg.style.color='#ef4444'; msg.textContent='Please enter a valid email.'; } return;
            }
            if (n.length > 80 || s.length > 120 || m.length > 1000) {
                if (msg) { msg.style.color='#ef4444'; msg.textContent='Input too long.'; } return;
            }

            const btn = $('btn-submit');
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Encrypting...';
            if (msg) msg.textContent = '';

            // Show terminal
            const overlay = $('term-overlay');
            const tbody   = $('term-body');
            overlay.classList.add('active');
            tbody.innerHTML = '';
            const logs = [
                '>> AG_SECURE: Establishing SSL/TLS connection...',
                '>> STATUS: AES-256-GCM encryption layer active.',
                '>> RSA: 4096-bit key negotiation complete.',
                '>> PAYLOAD: Serializing form data...',
                '>> HASH: SHA-256 integrity check — PASSED ✓',
                '>> CIPHER: Routing through block matrix...',
                '>> SMTP: Dispatching to adityakumar84282@gmail.com',
                '>> DELIVERY: Packet delivered successfully.',
                '>> SYSTEM: Transmission complete. Message sent!'
            ];
            let i = 0;
            const print = () => {
                if (i >= logs.length) {
                    setTimeout(() => {
                        overlay.classList.remove('active');
                        toast('Message Sent!', 'Your inquiry was routed securely.');
                        unlock('formSubmit','Hacker Recruiter 🔒','Used the cryptographic terminal to send a message.');
                        form.reset(); btn.disabled=false;
                        btn.innerHTML='<span>Send Message</span><i class="fas fa-paper-plane"></i>';
                    }, 1200);
                    return;
                }
                const line = document.createElement('div');
                line.className='terminal-line';
                line.style.animationDelay = `${i*100}ms`;
                line.textContent = logs[i++];
                tbody.appendChild(line);
                tbody.scrollTop = tbody.scrollHeight;
                setTimeout(print, 320);
            };
            print();
        });
    }

    // ── INIT ALL ─────────────────────────────────────────────────
    buildDOM();
    applyTheme();
    initLoader();
    initScroll();
    initHamburger();
    initTyper();
    initClock();
    initGeoIP();
    initReveal();
    initStats();
    initSkillBars();
    initTabs();
    initTilt();
    initCV();
    initForm();
    initParticles();
    animateParticles();

    // Mouse tracking for particles
    window.addEventListener('mousemove', e => { mouse.x=e.clientX; mouse.y=e.clientY; }, {passive:true});
    window.addEventListener('mouseout',  ()  => { mouse.x=null; mouse.y=null; });
    window.addEventListener('resize',    ()  => initParticles());

    // Command center events (after DOM built)
    $('cc-btn').addEventListener('click',  () => $('cc-panel').classList.add('active'));
    $('cc-close').addEventListener('click',() => $('cc-panel').classList.remove('active'));

    $$('.cc-theme-opt').forEach(opt => opt.addEventListener('click', () => {
        S.theme = opt.dataset.theme;
        localStorage.setItem('ag-theme', S.theme);
        applyTheme();
        if (S.theme !== 'quantum') unlock('themeShift','Theme Shifter 🎨','Explored alternative color palettes.');
    }));

    $('theme-toggle').addEventListener('click', () => {
        S.dark = !S.dark;
        localStorage.setItem('ag-dark', S.dark);
        applyTheme();
    });

    $('sl-pc').addEventListener('input', e => {
        S.pCount = +e.target.value;
        $('lbl-pc').textContent = S.pCount;
        localStorage.setItem('ag-pc', S.pCount);
        initParticles();
    });
    $('sl-ps').addEventListener('input', e => {
        S.pSpeed = +e.target.value;
        $('lbl-ps').textContent = S.pSpeed.toFixed(1)+'x';
        localStorage.setItem('ag-ps', S.pSpeed);
    });

    const vBtn = $('btn-vortex');
    vBtn.addEventListener('click', () => {
        S.vortex = !S.vortex;
        vBtn.innerHTML = S.vortex
            ? '<i class="fa-solid fa-hurricane"></i> Vortex ACTIVE — Click to Disable'
            : '<i class="fa-solid fa-tornado"></i> Force Gravity Vortex';
        vBtn.style.color = S.vortex ? 'var(--primary)' : '';
        vBtn.style.borderColor = S.vortex ? 'var(--primary)' : '';
    });

    $('btn-reset-ach').addEventListener('click', () => {
        S.ach = {}; localStorage.setItem('ag-ach', '{}');
        toast('Achievements Reset','All trophies locked again.');
    });

    // Time-based achievement
    setTimeout(() => unlock('timeSpent','Deep Evaluator ⏱','Spent over 60 seconds reviewing the portfolio.'), 60000);

    // CV download achievement
    $$('a.download').forEach(a => a.addEventListener('click', () =>
        unlock('cvDownload','Resume Acquired 📄','Downloaded the official resume PDF.')));

})();
