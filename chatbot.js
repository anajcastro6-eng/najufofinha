document.addEventListener('DOMContentLoaded', () => {
    const s = document.createElement('style');
    s.textContent = `
        #funchal-bot{position:fixed;bottom:20px;right:20px;z-index:9999;font-family:'Plus Jakarta Sans',sans-serif}
        #fb-btn{background:#8c3b1e;color:#fff;border:none;border-radius:50px;padding:12px 18px;font-weight:600;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.25);display:flex;align-items:center;gap:8px}
        #fb-win{position:absolute;bottom:60px;right:0;width:330px;max-width:calc(100vw - 32px);height:420px;background:#fff;border-radius:16px;box-shadow:0 12px 35px rgba(0,0,0,.2);border:1px solid #faedcd;display:flex;flex-direction:column;overflow:hidden}
        #fb-win.hide{display:none}
        .fb-head{background:#8c3b1e;color:#fff;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;font-weight:700}
        .fb-head button{background:none;border:none;color:#fff;font-size:1.4rem;cursor:pointer}
        .fb-body{flex:1;padding:14px;background:#fdfbf7;overflow-y:auto;display:flex;flex-direction:column;gap:10px;font-size:.86rem}
        .fb-msg{max-width:85%;padding:10px 13px;border-radius:12px;line-height:1.4}
        .fb-bot{align-self:flex-start;background:#fff;border:1px solid #efe6d5;color:#2b2b2b}
        .fb-usr{align-self:flex-end;background:#8c3b1e;color:#fff}
        .fb-bot a{color:#8c3b1e;font-weight:700}
        .fb-tags{padding:8px;background:#fdfbf7;border-top:1px solid #f0e8d8;display:flex;gap:6px;overflow-x:auto}
        .fb-tags button{background:#faedcd;color:#8c3b1e;border:none;border-radius:15px;padding:5px 10px;font-size:.75rem;font-weight:600;white-space:nowrap;cursor:pointer}
        .fb-form{display:flex;padding:8px;border-top:1px solid #eee;gap:6px}
        .fb-form input{flex:1;border:1px solid #ddd;border-radius:20px;padding:8px 14px;font-size:.85rem;outline:none}
        .fb-form button{background:#8c3b1e;color:#fff;border:none;width:36px;height:36px;border-radius:50%;cursor:pointer}
    `;
    document.head.appendChild(s);

    document.body.insertAdjacentHTML('beforeend', `
        <div id="funchal-bot">
            <button id="fb-btn">🥖 Atendimento</button>
            <div id="fb-win" class="hide">
                <div class="fb-head"><span>👨‍🍳 Panificadora Funchal</span><button id="fb-close">&times;</button></div>
                <div id="fb-msgs" class="fb-body"></div>
                <div id="fb-tags" class="fb-tags">
                    <button data-q="horarios">🕒 Horários</button>
                    <button data-q="cardapio">🥖 Cardápio</button>
                    <button data-q="fornadas">🔥 Fornadas</button>
                    <button data-q="encomenda">📋 Encomendar</button>
                    <button data-q="endereco">📍 Endereço</button>
                </div>
                <form id="fb-form" class="fb-form">
                    <input id="fb-in" placeholder="Digite sua dúvida..." autocomplete="off" required>
                    <button type="submit">➤</button>
                </form>
            </div>
        </div>
    `);

    const win = document.getElementById('fb-win');
    const msgs = document.getElementById('fb-msgs');
    const input = document.getElementById('fb-in');
    let started = false;

    const addMsg = (html, isUser = false) => {
        const d = document.createElement('div');
        d.className = `fb-msg ${isUser ? 'fb-usr' : 'fb-bot'}`;
        d[isUser ? 'textContent' : 'innerHTML'] = html;
        msgs.appendChild(d);
        msgs.scrollTop = msgs.scrollHeight;
    };

    const reply = (raw) => {
        const t = raw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (/horario|abre|fecha|aberto/.test(t)) return '🕒 <b>Horários:</b> Seg–Sex 06h30–20h | Sáb–Dom 07h–19h | Feriados 07h30–14h.';
        if (/fornada|quente/.test(t)) return '🔥 Fornadas quentinhas <b>3x ao dia</b> (principais às <b>07h00</b> e <b>16h00</b>).';
        if (/cardapio|preco|valor|pao|cafe|bolo|croissant/.test(t)) return '🥖 <b>Destaques:</b><br>• Pão Campanha Levain: R$ 24,00<br>• Croissant Francês: R$ 14,00<br>• Cappuccino Especial: R$ 12,50<br>• Bolo Artesanal (1.2kg): R$ 58,00';
        if (/encomenda|pedido|reservar|festa/.test(t)) return '📋 Agende no <a href="#encomendas">formulário do site</a> ou pelo <a href="https://wa.me/5511999998888" target="_blank">WhatsApp (11) 99999-8888</a>.';
        if (/endereco|onde|rua|entrega/.test(t)) return '📍 <b>Rua Funchal, 240 - Bairro Nobre</b>. Retirada no balcão ou entrega no bairro.';
        if (/oi|ola|bom dia|boa tarde|boa noite/.test(t)) return 'Olá! 👋 Como posso ajudar? Escolha uma opção abaixo ou pergunte!';
        return 'Fale direto com nossa equipe no <a href="https://wa.me/5511999998888" target="_blank">WhatsApp (11) 99999-8888</a>. 😊';
    };

    const send = (text) => {
        if (!text.trim()) return;
        addMsg(text, true);
        input.value = '';
        setTimeout(() => addMsg(reply(text)), 300);
    };

    document.getElementById('fb-btn').onclick = () => {
        win.classList.toggle('hide');
        if (!started) {
            addMsg('Olá! 👋 Bem-vindo à <b>Panificadora Funchal</b>. Em que posso ajudar?');
            started = true;
        }
        input.focus();
    };
    document.getElementById('fb-close').onclick = () => win.classList.add('hide');
    document.getElementById('fb-form').onsubmit = (e) => { e.preventDefault(); send(input.value); };
    document.querySelectorAll('#fb-tags button').forEach(b => b.onclick = () => send(b.textContent));
});