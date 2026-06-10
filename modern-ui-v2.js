(function () {
    const rupiah = new Intl.NumberFormat('id-ID');

    document.querySelectorAll('.demo-account').forEach((button) => {
        button.addEventListener('click', () => {
            const username = button.dataset.username;
            const password = button.dataset.password;
            const userInput = document.querySelector('input[name="username"]');
            const passInput = document.querySelector('input[name="password"]');
            if (userInput && passInput) {
                userInput.value = username;
                passInput.value = password;
                passInput.focus();
            }
        });
    });

    document.querySelectorAll('[data-toggle-password]').forEach((button) => {
        button.addEventListener('click', () => {
            const target = document.querySelector(button.dataset.togglePassword);
            if (!target) return;
            target.type = target.type === 'password' ? 'text' : 'password';
            button.textContent = target.type === 'password' ? 'Lihat' : 'Tutup';
        });
    });

    document.querySelectorAll('.card table').forEach((table) => {
        if (table.id === 'tabelItem') return;
        if (table.closest('.card')?.querySelector('.report-header')) return;
        if (table.parentElement.classList.contains('table-wrap')) return;

        const wrap = document.createElement('div');
        wrap.className = 'table-wrap';
        table.parentNode.insertBefore(wrap, table);
        wrap.appendChild(table);

        const rows = Array.from(table.querySelectorAll('tbody tr'));
        if (rows.length < 2) return;

        const tools = document.createElement('div');
        tools.className = 'table-tools no-print';
        tools.innerHTML = `
            <input class="table-search" type="search" placeholder="Cari data tabel...">
            <span class="table-count">${rows.length} data</span>
        `;
        wrap.parentNode.insertBefore(tools, wrap);

        const search = tools.querySelector('.table-search');
        const count = tools.querySelector('.table-count');

        search.addEventListener('input', () => {
            const keyword = search.value.toLowerCase().trim();
            let shown = 0;
            rows.forEach((row) => {
                const match = row.innerText.toLowerCase().includes(keyword);
                row.style.display = match ? '' : 'none';
                if (match) shown++;
            });
            count.textContent = `${shown} data tampil`;
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

    document.querySelectorAll('tbody tr').forEach((row, index) => {
        row.classList.add('row-new');
        row.style.animationDelay = `${Math.min(index * 0.025, 0.35)}s`;
    });

    document.querySelectorAll('.stat p').forEach((stat) => {
        const original = stat.textContent.trim();
        const isMoney = original.includes('Rp');
        const numeric = Number(original.replace(/[^0-9]/g, ''));
        if (!numeric || numeric > 5000000000) return;
        let start = 0;
        const duration = 720;
        const startedAt = performance.now();
        const tick = (now) => {
            const progress = Math.min((now - startedAt) / duration, 1);
            const value = Math.floor(numeric * progress);
            stat.textContent = isMoney ? `Rp ${rupiah.format(value)}` : rupiah.format(value);
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    });

    document.addEventListener('click', (event) => {
        const target = event.target.closest('button, .btn');
        if (!target) return;
        const ripple = document.createElement('span');
        const rect = target.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.cssText = `
            position:absolute;width:${size}px;height:${size}px;left:${event.clientX - rect.left - size / 2}px;top:${event.clientY - rect.top - size / 2}px;
            border-radius:50%;background:rgba(255,255,255,.35);transform:scale(0);animation:ripple .55s ease-out;pointer-events:none;
        `;
        target.appendChild(ripple);
        setTimeout(() => ripple.remove(), 560);
    });

    const style = document.createElement('style');
    style.textContent = '@keyframes ripple{to{transform:scale(2.4);opacity:0}}';
    document.head.appendChild(style);
})();
