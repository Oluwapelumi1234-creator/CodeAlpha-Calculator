const exprEl = document.getElementById('expr');
    const prevEl = document.getElementById('prev');
    const historyEl = document.getElementById('history');
    let expr = '0'; let memory = 0;

    function toJS(s) { return s.replace(/×/g, '*').replace(/÷/g, '/').replace(/%/g, '/100'); }
    function render() { exprEl.textContent = expr || '0'; const res = liveEval(expr); prevEl.textContent = res ?? '\u00A0'; }
    function clearAll() { expr = '0'; render(); }
    function del() { expr = expr.length > 1 ? expr.slice(0, -1) : '0'; render(); }
    function append(v) { if (expr === '0' && /[0-9.]/.test(v)) expr = v === '.' ? '0.' : v; else expr += v; render(); }
    function equals() { const v = liveEval(expr, true); if (v != null) { historyEl.innerHTML += '<div>' + expr + ' = ' + v + '</div>'; expr = String(v); render(); } }
    function liveEval(s, final = false) { try { const candidate = toJS(s); if (!final && /[+\-*/(]$/.test(candidate)) return null; const result = Function(`return (${candidate})`)(); return Number.isInteger(result) ? result : parseFloat(result.toFixed(6)); } catch { return null; } }

    document.querySelectorAll('button.key').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action; const val = btn.dataset.val;
        if (action === 'clear') return clearAll();
        if (action === 'delete') return del();
        if (action === 'equals') return equals();
        if (action === 'm+') { memory += Number(liveEval(expr, true)) || 0; return; }
        if (action === 'm-') { memory -= Number(liveEval(expr, true)) || 0; return; }
        if (action === 'mr') { append(String(memory)); return; }
        if (action === 'mc') { memory = 0; return; }
        if (val) return append(val);
      });
    });

    window.addEventListener('keydown', (e) => {
      const k = e.key;
      if (/^[0-9]$/.test(k) || ["+", "-", "*", "/", ".", "(", ")"].includes(k)) return append(k);
      if (k === 'Enter') { e.preventDefault(); equals(); }
      if (k === 'Escape') clearAll();
      if (k === 'Backspace') del();
      if (k === '%') append('%');
    });

    document.getElementById('themeBtn').addEventListener('click', () => {
      document.body.dataset.theme = document.body.dataset.theme === 'light' ? '' : 'light';
    });

    render();