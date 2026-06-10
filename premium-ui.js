(function () {
    const rupiah = new Intl.NumberFormat('id-ID');

    function initLoader() {
        if (document.body.classList.contains('print-page')) return;

        const loaderReason = sessionStorage.getItem('showAppLoader');
        if (!loaderReason) return;
        sessionStorage.removeItem('showAppLoader');

        const subtitle = loaderReason === 'login'
            ? 'Menyiapkan menu utama dan data transaksi terbaru...'
            : 'Memproses pembaruan password akun...';

        const loader = document.createElement('div');
        loader.className = 'app-loader';
        loader.innerHTML = `
            <div class="loader-box">
                <div class="loader-glow loader-glow-one"></div>
                <div class="loader-glow loader-glow-two"></div>
                <div class="loader-orbit">
                    <span class="loader-ring loader-ring-one"></span>
                    <span class="loader-ring loader-ring-two"></span>
                    <span class="loader-dot"></span>
                    <div class="loader-core">TS</div>
                </div>
                <p class="loader-title">Toko Karunia Berkah</p>
                <div class="loader-subtitle">${subtitle}</div>
                <div class="loader-progress"><span></span></div>
                <small class="loader-caption">Sistem Penjualan Sembako</small>
            </div>`;
        document.body.appendChild(loader);
        window.addEventListener('load', () => {
            setTimeout(() => loader.classList.add('hide'), 720);
            setTimeout(() => loader.remove(), 1420);
        });
    }

    function initPasswordToggle() {
        document.querySelectorAll('[data-toggle-password]').forEach((button) => {
            button.addEventListener('click', () => {
                const target = document.querySelector(button.dataset.togglePassword);
                if (!target) return;
                target.type = target.type === 'password' ? 'text' : 'password';
                button.textContent = target.type === 'password' ? 'Lihat' : 'Tutup';
            });
        });
    }

    function initTableTools() {
        document.querySelectorAll('.card table').forEach((table) => {
            if (table.id === 'tabelItem') return;
            if (table.closest('.card')?.querySelector('.report-header')) return;

            if (!table.parentElement.classList.contains('table-wrap')) {
                const wrap = document.createElement('div');
                wrap.className = 'table-wrap';
                table.parentNode.insertBefore(wrap, table);
                wrap.appendChild(table);
            }

            const tbody = table.querySelector('tbody');
            if (!tbody) return;
            const rows = Array.from(tbody.querySelectorAll('tr')).filter(row => !row.querySelector('[colspan]'));
            if (rows.length < 2) return;
            if (table.closest('.card').querySelector('.table-tools')) return;

            const tools = document.createElement('div');
            tools.className = 'table-tools no-print';
            tools.innerHTML = '<input class="table-search" type="search" placeholder="Cari data tabel..."><span class="table-count">' + rows.length + ' data</span>';
            table.closest('.card').insertBefore(tools, table.parentElement);

            const search = tools.querySelector('.table-search');
            const count = tools.querySelector('.table-count');
            const noResult = document.createElement('tr');
            noResult.className = 'no-result-row';
            noResult.style.display = 'none';
            noResult.innerHTML = '<td colspan="99">Data tidak ditemukan.</td>';
            tbody.appendChild(noResult);

            search.addEventListener('input', () => {
                const keyword = search.value.toLowerCase().trim();
                let shown = 0;
                rows.forEach((row) => {
                    const match = row.innerText.toLowerCase().includes(keyword);
                    row.style.display = match ? '' : 'none';
                    if (match) shown++;
                });
                noResult.style.display = shown ? 'none' : '';
                count.textContent = shown + ' data tampil';
            });
        });

        document.querySelectorAll('.card table').forEach((table) => {
            if (!table.parentElement.classList.contains('table-wrap')) {
                const wrap = document.createElement('div');
                wrap.className = 'table-wrap';
                table.parentNode.insertBefore(wrap, table);
                wrap.appendChild(table);
            }
        });
    }

    function initRowAnimations() {
        document.querySelectorAll('tbody tr:not(.no-result-row)').forEach((row, index) => {
            row.classList.add('row-new');
            row.style.animationDelay = `${Math.min(index * 0.025, 0.36)}s`;
        });
    }

    function initStatCounter() {
        document.querySelectorAll('.stat p, [data-counter]').forEach((stat) => {
            const original = stat.textContent.trim();
            const isMoney = original.includes('Rp');
            const numeric = Number(original.replace(/[^0-9]/g, ''));
            if (!numeric || numeric > 9999999999) return;
            let startedAt = null;
            const duration = 850;
            const tick = (now) => {
                if (!startedAt) startedAt = now;
                const progress = Math.min((now - startedAt) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = Math.floor(numeric * eased);
                stat.textContent = isMoney ? `Rp ${rupiah.format(value)}` : rupiah.format(value);
                if (progress < 1) requestAnimationFrame(tick);
                else stat.textContent = original;
            };
            requestAnimationFrame(tick);
        });
    }

    function initRipple() {
        document.addEventListener('click', (event) => {
            const target = event.target.closest('button, .btn');
            if (!target) return;
            const rect = target.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const ripple = document.createElement('span');
            ripple.style.cssText = `position:absolute;width:${size}px;height:${size}px;left:${event.clientX - rect.left - size / 2}px;top:${event.clientY - rect.top - size / 2}px;border-radius:50%;background:rgba(255,255,255,.38);transform:scale(0);animation:ripple .55s ease-out;pointer-events:none;`;
            target.appendChild(ripple);
            setTimeout(() => ripple.remove(), 580);
        });
    }

    function initClock() {
        const clock = document.querySelector('[data-live-clock]');
        if (!clock) return;
        const tick = () => {
            const now = new Date();
            clock.textContent = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
        };
        tick();
        setInterval(tick, 1000);
    }



    function initRupiahInputs() {
        const format = (value) => {
            const numberOnly = String(value || '').replace(/[^0-9]/g, '');
            if (!numberOnly) return '';
            return numberOnly.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        };

        document.querySelectorAll('.rupiah-input').forEach((input) => {
            input.value = format(input.value);

            input.addEventListener('input', () => {
                const cursorAtEnd = input.selectionStart === input.value.length;
                input.value = format(input.value);
                if (cursorAtEnd) input.setSelectionRange(input.value.length, input.value.length);
            });

            input.addEventListener('blur', () => {
                input.value = format(input.value);
            });
        });
    }

    function initFormSpotlight() {        document.querySelectorAll('input, select, textarea').forEach((field) => {
            field.addEventListener('focus', () => field.closest('.card, .login-card, .forgot-card')?.classList.add('form-spotlight'));
            field.addEventListener('blur', () => field.closest('.card, .login-card, .forgot-card')?.classList.remove('form-spotlight'));
        });
    }

    function initScrollReveal() {
        const items = document.querySelectorAll('.card, .stat, .dashboard-hero, .page-title');
        if (!('IntersectionObserver' in window)) return;
        items.forEach(item => item.classList.add('reveal-ready'));
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });
        items.forEach(item => observer.observe(item));
    }


    function initSidebarToggle() {
        const button = document.querySelector('[data-sidebar-toggle]');
        const sidebar = document.querySelector('.sidebar');
        if (!button || !sidebar) return;

        const setButtonState = (collapsed) => {
            button.innerHTML = `<span class="toggle-icon">${collapsed ? '☰' : '×'}</span>`;
            button.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
            button.setAttribute('aria-label', collapsed ? 'Buka menu samping' : 'Tutup menu samping');
            button.setAttribute('title', collapsed ? 'Buka menu' : 'Tutup menu');
        };

        const saved = localStorage.getItem('sidebarCollapsed');
        const collapsed = saved === '1';
        document.body.classList.toggle('sidebar-collapsed', collapsed);
        setButtonState(collapsed);

        button.addEventListener('click', () => {
            const isCollapsed = document.body.classList.toggle('sidebar-collapsed');
            localStorage.setItem('sidebarCollapsed', isCollapsed ? '1' : '0');
            setButtonState(isCollapsed);
        });
    }

    function initUnitSizeControls() {
        document.querySelectorAll('.unit-size-input').forEach((input) => {
            input.addEventListener('input', () => {
                input.value = input.value.replace(/[^0-9,.]/g, '').replace(/,/g, '.');
                const parts = input.value.split('.');
                if (parts.length > 2) {
                    input.value = parts.shift() + '.' + parts.join('');
                }
            });

            input.addEventListener('blur', () => {
                let value = input.value.trim();
                if (!value || Number(value) <= 0) value = '1';
                if (value.includes('.')) value = value.replace(/0+$/, '').replace(/\.$/, '');
                input.value = value;
            });
        });

        document.querySelectorAll('[data-unit-isi][data-unit-name]').forEach((button) => {
            button.addEventListener('click', () => {
                const field = button.closest('.satuan-field');
                if (!field) return;
                const isiInput = field.querySelector('input[name="isi_satuan"]');
                const select = field.querySelector('select[name="satuan_dasar"]');
                if (isiInput) isiInput.value = button.dataset.unitIsi || '1';
                if (select) select.value = button.dataset.unitName || '';
            });
        });
    }


    initSidebarToggle();
    initLoader();
    initPasswordToggle();
    initTableTools();
    initRowAnimations();
    initStatCounter();
    initRipple();
    initClock();
    initRupiahInputs();
    initUnitSizeControls();
    initFormSpotlight();
    initScrollReveal();
})();
