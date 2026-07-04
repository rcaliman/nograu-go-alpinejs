document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('pcd-form');
  const input = document.getElementById('numeroCodigo');
  const submitBtn = document.getElementById('pcd-submit-btn');
  const spinner = document.getElementById('pcd-spinner');
  const btnText = submitBtn.querySelector('.pcd-btn-text');
  const errorBox = document.getElementById('pcd-error');
  const errorMsg = document.getElementById('pcd-error-msg');
  const resultCard = document.getElementById('pcd-result-card');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const codigo = input.value.trim();
    if (!codigo) {
      showError('Informe o código do banco.');
      return;
    }

    hideError();
    setLoading(true);
    resultCard.hidden = true;

    try {
      const res = await fetch(`/pcd/banco/${encodeURIComponent(codigo)}`);

      if (!res.ok) {
        if (res.status === 404) {
          showError('Banco não encontrado para o código informado.');
        } else {
          showError('Erro ao buscar informações. Tente novamente.');
        }
        return;
      }

      const data = await res.json();
      showResult(data);
    } catch {
      showError('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setLoading(false);
    }
  });

  function showResult(data) {
    document.getElementById('res-ispb').textContent = data.ispb;
    document.getElementById('res-codigo').textContent = data.numeroCodigo;
    document.getElementById('res-nome').textContent = data.nomeExtenso;
    document.getElementById('res-base').textContent = `base atualizada em ${formatDate(data.createdAt)}`;

    resultCard.hidden = false;
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function formatDate(createdAt) {
    const [year, month, day] = createdAt.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  }

  function showError(msg) {
    errorMsg.textContent = msg;
    errorBox.hidden = false;
  }

  function hideError() {
    errorBox.hidden = true;
  }

  function setLoading(loading) {
    submitBtn.disabled = loading;
    btnText.textContent = loading ? 'Buscando…' : 'Buscar';
    spinner.hidden = !loading;
  }

  // ── Cálculo de compra de empréstimo ──
  const calcForm = document.getElementById('calc-form');
  const calcSubmitBtn = document.getElementById('calc-submit-btn');
  const calcSpinner = document.getElementById('calc-spinner');
  const calcBtnText = calcSubmitBtn.querySelector('.calc-btn-text');
  const calcErrorBox = document.getElementById('calc-error');
  const calcErrorMsg = document.getElementById('calc-error-msg');
  const calcResultCard = document.getElementById('calc-result-card');

  calcForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const codigoBanco = document.getElementById('calc-codigoBanco').value.trim();
    const quantidadeParcelas = document.getElementById('calc-quantidadeParcelas').value;
    const proximaParcela = document.getElementById('calc-proximaParcela').value;
    const ultimaParcela = document.getElementById('calc-ultimaParcela').value;
    const valorParcela = document.getElementById('calc-valorParcela').value;
    const valorEmprestado = document.getElementById('calc-valorEmprestado').value;

    if (!codigoBanco || !quantidadeParcelas || !proximaParcela || !ultimaParcela || !valorParcela || !valorEmprestado) {
      showCalcError('Preencha todos os campos para calcular.');
      return;
    }

    const proximaParcelaIso = parseDataDDMMYYYY(proximaParcela);
    const ultimaParcelaIso = parseDataDDMMYYYY(ultimaParcela);

    if (!proximaParcelaIso || !ultimaParcelaIso) {
      showCalcError('Datas inválidas. Use o formato dia, mês e ano sem separadores (ex: 05112025).');
      return;
    }

    hideCalcError();
    setCalcLoading(true);
    calcResultCard.hidden = true;

    try {
      const res = await fetch('/pcd/calculo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codigoBanco,
          proximaParcela: proximaParcelaIso,
          ultimaParcela: ultimaParcelaIso,
          quantidadeParcelas: parseInt(quantidadeParcelas, 10),
          valorParcela: parseInt(valorParcela, 10),
          valorEmprestado: parseInt(valorEmprestado, 10),
        }),
      });

      if (!res.ok) {
        showCalcError('Erro ao calcular o empréstimo. Verifique os dados e tente novamente.');
        return;
      }

      const data = await res.json();
      await showCalcResult(data);
    } catch {
      showCalcError('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setCalcLoading(false);
    }
  });

  async function showCalcResult(data) {
    document.getElementById('res-proximaParcela').textContent = formatDate(data.proximaParcela);
    document.getElementById('res-ultimaParcela').textContent = formatDate(data.ultimaParcela);
    document.getElementById('res-quantidadeParcelas').textContent = data.quantidadeParcelas;
    document.getElementById('res-valorParcela').textContent = formatCurrency(data.valorParcela);
    document.getElementById('res-valorEmprestado').textContent = formatCurrency(data.valorEmprestado);
    document.getElementById('res-taxaJuros').textContent = `${formatNumber(data.taxaJuros)}%`;
    document.getElementById('res-mesesEmSer').textContent = data.mesesEmSer;
    document.getElementById('res-saldoDevedor').textContent = formatCurrency(data.saldoDevedor);

    calcResultCard.hidden = false;
    calcResultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    await loadBancoInfo(data.codigoBanco);
  }

  async function loadBancoInfo(codigoBanco) {
    const nomeEl = document.getElementById('res-banco-nome');
    const codigoEl = document.getElementById('res-banco-codigo');
    const ispbEl = document.getElementById('res-banco-ispb');

    nomeEl.textContent = '—';
    codigoEl.textContent = '—';
    ispbEl.textContent = '—';

    try {
      const res = await fetch(`/pcd/banco/${encodeURIComponent(codigoBanco)}`);
      if (!res.ok) {
        nomeEl.textContent = 'Banco não encontrado';
        return;
      }

      const banco = await res.json();
      nomeEl.textContent = banco.nomeExtenso;
      codigoEl.textContent = banco.numeroCodigo;
      ispbEl.textContent = banco.ispb;
    } catch {
      nomeEl.textContent = 'Erro ao buscar informações do banco';
    }
  }

  function formatNumber(value) {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function parseDataDDMMYYYY(value) {
    if (!/^\d{8}$/.test(value)) return null;
    const dia = value.slice(0, 2);
    const mes = value.slice(2, 4);
    const ano = value.slice(4, 8);
    return `${ano}-${mes}-${dia}`;
  }

  function showCalcError(msg) {
    calcErrorMsg.textContent = msg;
    calcErrorBox.hidden = false;
  }

  function hideCalcError() {
    calcErrorBox.hidden = true;
  }

  function setCalcLoading(loading) {
    calcSubmitBtn.disabled = loading;
    calcBtnText.textContent = loading ? 'Calculando…' : 'Calcular';
    calcSpinner.hidden = !loading;
  }

  // ── Cálculos do dia ──
  const calculosDiaBtn = document.getElementById('calculos-dia-btn');
  const calculosDiaSpinner = document.getElementById('calculos-dia-spinner');
  const calculosDiaBtnText = calculosDiaBtn.querySelector('.calculos-dia-btn-text');
  const calculosDiaErrorBox = document.getElementById('calculos-dia-error');
  const calculosDiaErrorMsg = document.getElementById('calculos-dia-error-msg');
  const calculosDiaSection = document.getElementById('calculos-dia-section');
  const calculosDiaList = document.getElementById('calculos-dia-list');

  calculosDiaBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    if (calculosDiaBtn.classList.contains('is-disabled')) return;

    hideCalculosDiaError();
    setCalculosDiaLoading(true);
    calculosDiaSection.hidden = true;

    try {
      const res = await fetch('/pcd/calculos-dia');

      if (!res.ok) {
        showCalculosDiaError('Erro ao buscar os cálculos do dia. Tente novamente.');
        return;
      }

      const items = await res.json();
      await renderCalculosDia(items);

      calculosDiaSection.hidden = false;
      calculosDiaSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch {
      showCalculosDiaError('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setCalculosDiaLoading(false);
    }
  });

  async function renderCalculosDia(items) {
    calculosDiaList.innerHTML = '';

    if (items.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'form-hint';
      empty.textContent = 'Nenhum cálculo realizado hoje.';
      calculosDiaList.appendChild(empty);
      return;
    }

    const bancoCache = new Map();

    for (const item of items) {
      if (!bancoCache.has(item.codigoBanco)) {
        bancoCache.set(item.codigoBanco, await fetchBanco(item.codigoBanco));
      }
      calculosDiaList.appendChild(buildCalculoCard(item, bancoCache.get(item.codigoBanco)));
    }
  }

  async function fetchBanco(codigoBanco) {
    try {
      const res = await fetch(`/pcd/banco/${encodeURIComponent(codigoBanco)}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  function buildCalculoCard(item, banco) {
    const card = document.createElement('div');
    card.className = 'card mt-4 calculos-dia-card';

    const body = document.createElement('div');
    body.className = 'card-body';

    const header = document.createElement('div');
    header.className = 'calculos-dia-card-header';
    header.textContent = banco ? banco.nomeExtenso : 'Banco não encontrado';
    body.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'pcd-result-grid calculos-dia-grid';

    grid.appendChild(createResultItem('Próxima Parcela', formatDate(item.proximaParcela)));
    grid.appendChild(createResultItem('Última Parcela', formatDate(item.ultimaParcela)));
    grid.appendChild(createResultItem('Quantidade de Parcelas', item.quantidadeParcelas));
    grid.appendChild(createResultItem('Valor Emprestado (R$)', formatCurrency(item.valorEmprestado)));
    grid.appendChild(createResultItem('Taxa de Juros Mensal', `${formatNumber(item.taxaJuros)}%`));
    grid.appendChild(createResultItem('Meses Restantes', item.mesesEmSer));
    grid.appendChild(createResultItem('Saldo Devedor', formatCurrency(Math.abs(item.saldoDevedor))));
    grid.appendChild(createResultItem('Código do Banco', item.codigoBanco));
    grid.appendChild(createResultItem('ISPB', banco ? banco.ispb : '—'));

    body.appendChild(grid);
    card.appendChild(body);
    return card;
  }

  function createResultItem(label, value) {
    const item = document.createElement('div');
    item.className = 'pcd-result-item';

    const labelEl = document.createElement('span');
    labelEl.className = 'pcd-result-label';
    labelEl.textContent = label;

    const valueEl = document.createElement('span');
    valueEl.className = 'pcd-result-value calculos-dia-value';
    valueEl.textContent = value;

    item.appendChild(labelEl);
    item.appendChild(valueEl);
    return item;
  }

  function showCalculosDiaError(msg) {
    calculosDiaErrorMsg.textContent = msg;
    calculosDiaErrorBox.hidden = false;
  }

  function hideCalculosDiaError() {
    calculosDiaErrorBox.hidden = true;
  }

  function setCalculosDiaLoading(loading) {
    calculosDiaBtn.classList.toggle('is-disabled', loading);
    calculosDiaBtnText.textContent = loading ? 'Carregando…' : 'Ver cálculos do dia';
    calculosDiaSpinner.hidden = !loading;
  }

  // ── Quantidade de cálculos hoje ──
  const qtdCalculosEl = document.getElementById('qtd-calculos-hoje');

  fetch('/pcd/qtd-calculos')
    .then((res) => (res.ok ? res.json() : null))
    .then((qtd) => {
      if (qtd !== null) {
        qtdCalculosEl.textContent = qtd;
      }
    })
    .catch(() => {});
});
