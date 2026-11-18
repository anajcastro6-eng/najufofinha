document.addEventListener('DOMContentLoaded', () => {
    // 1. Atualiza o selo "Aberto/Fechado" do cabeçalho em tempo real
    const statusBadge = document.querySelector('.badge-status');
    if (statusBadge) {
        const agora = new Date();
        const dia = agora.getDay(); // 0 = Dom, 1-5 = Seg-Sex, 6 = Sáb
        const hora = agora.getHours() + agora.getMinutes() / 60;

        let aberto = false;
        let fechaAs = '20h';

        if (dia >= 1 && dia <= 5) {
            aberto = hora >= 6.5 && hora < 20;
            fechaAs = '20h';
        } else {
            aberto = hora >= 7 && hora < 19;
            fechaAs = '19h';
        }

        statusBadge.innerHTML = aberto
            ? `<span class="status-dot"></span> Aberto hoje até às ${fechaAs}`
            : `<span class="status-dot" style="background:#e63946;animation:none"></span> Fechado agora (abre às ${dia === 0 || dia === 6 ? '07h' : '06h30'})`;
    }

    // 2. Bloqueia datas passadas no campo de Data de Retirada
    const dateInput = document.querySelector('#encomendas input[type="date"]');
    if (dateInput) {
        const hoje = new Date().toISOString().split('T')[0];
        dateInput.min = hoje;
    }

    // 3. Pré-seleciona a categoria ao clicar nos botões dos Flip Cards
    document.querySelectorAll('.flip-card-back .btn').forEach((btn, idx) => {
        const categorias = ['paes', 'paes', 'bolos', 'eventos'];
        btn.addEventListener('click', () => {
            const select = document.querySelector('#encomendas select');
            if (select) select.value = categorias[idx] || '';
        });
    });

    // 4. Formulário de Encomendas -> Envia pedido formatado para o WhatsApp
    const form = document.querySelector('#encomendas form');
    if (form) {
        form.removeAttribute('onsubmit');
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const nome = form.querySelector('input[type="text"]').value.trim();
            const email = form.querySelector('input[type="email"]').value.trim();
            const tel = form.querySelector('input[type="tel"]').value.trim();
            const data = form.querySelector('input[type="date"]').value.split('-').reverse().join('/');
            const select = form.querySelector('select');
            const categoria = select.options[select.selectedIndex].text;
            const detalhes = form.querySelector('textarea').value.trim();

            const msg =
                `🥖 *NOVA ENCOMENDA - PANIFICADORA FUNCHAL*\n\n` +
                `*Cliente:* ${nome}\n` +
                `*WhatsApp:* ${tel}\n` +
                `*E-mail:* ${email}\n` +
                `*Retirada:* ${data}\n` +
                `*Categoria:* ${categoria}\n` +
                `*Detalhes:* ${detalhes || 'A combinar'}`;

            const url = `https://wa.me/5511999998888?text=${encodeURIComponent(msg)}`;
            window.open(url, '_blank');
            form.reset();
        });
    }

    // 5. Fecha o Lightbox da galeria ao pressionar ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && window.location.hash.startsWith('#galeria-img')) {
            window.location.hash = '#galeria';
        }
    });
});