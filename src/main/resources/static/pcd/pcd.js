const PCD_TRANSLATIONS = {
  pt: {
    'meta.title': 'Saldo Devedor e Taxa de Juros do Empréstimo Consignado — Nograu',

    'nav.bikefit': 'bike fit',
    'nav.loan': 'cálculo de empréstimo',
    'nav.converter': 'conversor de medidas',
    'nav.tagpet': 'tag pet',
    'nav.toggleAria': 'Abrir menu',
    'lang.toggleAria': 'Alternar idioma',

    'loan.title': 'Saldo Devedor e Taxa de Juros',
    'loan.subtitle': 'Calcule a taxa de juros e o saldo devedor do seu empréstimo consignado.',
    'loan.sectionTitle': 'Seu Empréstimo',

    'form.codigoBanco.label': 'Código do Banco',
    'form.proximaParcela.label': 'Próxima Parcela',
    'form.ultimaParcela.label': 'Última Parcela',
    'form.qtdParcelas.label': 'Qtd. Parcelas',
    'form.valorParcela.label': 'Valor da Parcela (R$)',
    'form.valorEmprestado.label': 'Valor Emprestado (R$)',
    'form.hint.somenteNumeros': 'Digite apenas os números, a formatação é automática.',

    'btn.calcular': 'Calcular',
    'btn.calculando': 'Calculando…',

    'calcDia.link': 'Ver cálculos do dia',
    'calcDia.loading': 'Carregando…',
    'calcDia.title': 'Cálculos do Dia',
    'calcDia.empty': 'Nenhum cálculo realizado hoje.',
    'calcDia.error': 'Erro ao buscar os cálculos do dia. Tente novamente.',

    'result.detalhes.title': 'Detalhes do Empréstimo',
    'result.proximaParcela': 'Próxima Parcela',
    'result.ultimaParcela': 'Última Parcela',
    'result.quantidadeParcelas': 'Quantidade de Parcelas',
    'result.valorParcela': 'Valor da Parcela (R$)',
    'result.valorEmprestado': 'Valor Emprestado (R$)',
    'result.taxaJuros': 'Taxa de Juros Mensal',
    'result.mesesEmSer': 'Parcelas Restantes',
    'result.saldoDevedor': 'Saldo Devedor',
    'result.infoBancarias.title': 'Informações Bancárias',
    'result.banco': 'Banco',
    'result.codigoBanco': 'Código do Banco',
    'result.ispb': 'ISPB',

    'error.preencherTodos': 'Preencha todos os campos para calcular.',
    'error.datasInvalidas': 'Datas inválidas. Use o formato dia, mês e ano sem separadores (ex: 05112025).',
    'error.calcular': 'Erro ao calcular o empréstimo. Verifique os dados e tente novamente.',
    'error.conexao': 'Erro de conexão. Verifique sua internet e tente novamente.',

    'bank.title': 'Consulta de Bancos',
    'bank.subtitle': 'Informe o código COMPE do banco para consultar suas informações na base PCD.',
    'bank.form.label': 'Código do Banco (COMPE)',
    'bank.form.placeholder': 'ex: 001',
    'bank.form.hint': 'Código de três dígitos utilizado no sistema COMPE',
    'bank.btn.buscar': 'Buscar',
    'bank.btn.buscando': 'Buscando…',
    'bank.error.vazio': 'Informe o código do banco.',
    'bank.error.naoEncontrado': 'Banco não encontrado para o código informado.',
    'bank.error.buscar': 'Erro ao buscar informações. Tente novamente.',
    'bank.result.title': 'Resultado',
    'bank.result.ispb': 'ISPB',
    'bank.result.codigo': 'Código',
    'bank.result.nome': 'Nome',
    'bank.result.baseInfo': 'base atualizada em {date}',
    'bank.naoEncontradoInline': 'Banco não encontrado',
    'bank.erroInfo': 'Erro ao buscar informações do banco',

    'footer.text': 'Consulta de Bancos — dados extraídos da base PCD do Banco Central',
    'footer.qtdCalculos': 'quantidade de cálculos feitos hoje:',
  },
  en: {
    'meta.title': 'Outstanding Balance and Interest Rate of a Payroll Loan — Nograu',

    'nav.bikefit': 'bike fit',
    'nav.loan': 'loan calculator',
    'nav.converter': 'unit converter',
    'nav.tagpet': 'tag pet',
    'nav.toggleAria': 'Open menu',
    'lang.toggleAria': 'Switch language',

    'loan.title': 'Outstanding Balance and Interest Rate',
    'loan.subtitle': "Calculate the interest rate and outstanding balance of your payroll loan.",
    'loan.sectionTitle': 'Your Loan',

    'form.codigoBanco.label': 'Bank Code',
    'form.proximaParcela.label': 'Next Installment',
    'form.ultimaParcela.label': 'Last Installment',
    'form.qtdParcelas.label': 'No. of Installments',
    'form.valorParcela.label': 'Installment Amount (R$)',
    'form.valorEmprestado.label': 'Loan Amount (R$)',
    'form.hint.somenteNumeros': 'Enter numbers only, formatting is automatic.',

    'btn.calcular': 'Calculate',
    'btn.calculando': 'Calculating…',

    'calcDia.link': "View today's calculations",
    'calcDia.loading': 'Loading…',
    'calcDia.title': "Today's Calculations",
    'calcDia.empty': 'No calculations made today.',
    'calcDia.error': "Error fetching today's calculations. Please try again.",

    'result.detalhes.title': 'Loan Details',
    'result.proximaParcela': 'Next Installment',
    'result.ultimaParcela': 'Last Installment',
    'result.quantidadeParcelas': 'Number of Installments',
    'result.valorParcela': 'Installment Amount (R$)',
    'result.valorEmprestado': 'Loan Amount (R$)',
    'result.taxaJuros': 'Monthly Interest Rate',
    'result.mesesEmSer': 'Installments Remaining',
    'result.saldoDevedor': 'Outstanding Balance',
    'result.infoBancarias.title': 'Bank Information',
    'result.banco': 'Bank',
    'result.codigoBanco': 'Bank Code',
    'result.ispb': 'ISPB',

    'error.preencherTodos': 'Fill in all fields to calculate.',
    'error.datasInvalidas': 'Invalid dates. Use day, month and year with no separators (e.g. 05112025).',
    'error.calcular': 'Error calculating the loan. Please check the data and try again.',
    'error.conexao': 'Connection error. Please check your internet connection and try again.',

    'bank.title': 'Bank Lookup',
    'bank.subtitle': "Enter the bank's COMPE code to look up its information in the PCD database.",
    'bank.form.label': 'Bank Code (COMPE)',
    'bank.form.placeholder': 'e.g. 001',
    'bank.form.hint': 'Three-digit code used in the COMPE system',
    'bank.btn.buscar': 'Search',
    'bank.btn.buscando': 'Searching…',
    'bank.error.vazio': 'Enter the bank code.',
    'bank.error.naoEncontrado': 'Bank not found for the provided code.',
    'bank.error.buscar': 'Error fetching information. Please try again.',
    'bank.result.title': 'Result',
    'bank.result.ispb': 'ISPB',
    'bank.result.codigo': 'Code',
    'bank.result.nome': 'Name',
    'bank.result.baseInfo': 'database updated on {date}',
    'bank.naoEncontradoInline': 'Bank not found',
    'bank.erroInfo': 'Error fetching bank information',

    'footer.text': "Bank Lookup — data extracted from the Central Bank's PCD database",
    'footer.qtdCalculos': 'number of calculations made today:',
  },
};

function detectLang() {
  const saved = localStorage.getItem('nograu-lang');
  if (saved === 'pt' || saved === 'en') return saved;
  const nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
  return nav.startsWith('pt') ? 'pt' : 'en';
}

let currentLang = detectLang();

function t(key, params) {
  let str = PCD_TRANSLATIONS[currentLang]?.[key] ?? PCD_TRANSLATIONS.pt[key] ?? key;
  if (params) for (const k in params) str = str.replace(`{${k}}`, params[k]);
  return str;
}

function apiHeaders(extra) {
  return { 'Accept-Language': currentLang === 'en' ? 'en' : 'pt-BR', ...extra };
}

function applyStaticTranslations() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.setAttribute('placeholder', t(el.dataset.i18nPlaceholder));
  });
  document.documentElement.lang = currentLang === 'en' ? 'en' : 'pt-BR';
  document.title = t('meta.title');
}

function setLang(lang) {
  if (lang !== 'pt' && lang !== 'en') return;
  currentLang = lang;
  localStorage.setItem('nograu-lang', lang);
  applyStaticTranslations();
}

window.NOGRAU_NAV = {
  t,
  getLang: () => currentLang,
  setLang,
};

document.addEventListener('DOMContentLoaded', () => {
  applyStaticTranslations();

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
      showError(t('bank.error.vazio'));
      return;
    }

    hideError();
    setLoading(true);
    resultCard.hidden = true;

    try {
      const res = await fetch(`/pcd/banco/${encodeURIComponent(codigo)}`, { headers: apiHeaders() });

      if (!res.ok) {
        if (res.status === 404) {
          showError(t('bank.error.naoEncontrado'));
        } else {
          showError(t('bank.error.buscar'));
        }
        return;
      }

      const data = await res.json();
      showResult(data);
    } catch {
      showError(t('error.conexao'));
    } finally {
      setLoading(false);
    }
  });

  function showResult(data) {
    document.getElementById('res-ispb').textContent = data.ispb;
    document.getElementById('res-codigo').textContent = data.numeroCodigo;
    document.getElementById('res-nome').textContent = data.nomeExtenso;
    document.getElementById('res-base').textContent = t('bank.result.baseInfo', { date: formatDate(data.createdAt) });

    resultCard.hidden = false;
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function formatDate(createdAt) {
    const [year, month, day] = createdAt.split('T')[0].split('-');
    return currentLang === 'en' ? `${month}/${day}/${year}` : `${day}/${month}/${year}`;
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
    btnText.textContent = loading ? t('bank.btn.buscando') : t('bank.btn.buscar');
    spinner.hidden = !loading;
  }

  // ── Máscaras de visualização (data e moeda) ──
  // As máscaras só afetam o texto exibido no campo; o valor enviado ao
  // backend continua sendo extraído como dígitos crus, exatamente como antes.
  function onlyDigits(value) {
    return value.replace(/\D/g, '');
  }

  function maskDateInput(el) {
    el.addEventListener('input', () => {
      const digits = onlyDigits(el.value).slice(0, 8);
      let formatted = digits;
      if (digits.length > 4) {
        formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
      } else if (digits.length > 2) {
        formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
      }
      el.value = formatted;
    });
  }

  function maskCurrencyInput(el) {
    el.addEventListener('input', () => {
      const digits = onlyDigits(el.value);
      if (!digits) {
        el.value = '';
        return;
      }
      el.value = formatNumber(parseInt(digits, 10) / 100);
    });
  }

  maskDateInput(document.getElementById('calc-proximaParcela'));
  maskDateInput(document.getElementById('calc-ultimaParcela'));
  maskCurrencyInput(document.getElementById('calc-valorParcela'));
  maskCurrencyInput(document.getElementById('calc-valorEmprestado'));

  // ── Cálculo de saldo devedor e taxa de juros do consignado ──
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
    const proximaParcela = onlyDigits(document.getElementById('calc-proximaParcela').value);
    const ultimaParcela = onlyDigits(document.getElementById('calc-ultimaParcela').value);
    const valorParcela = onlyDigits(document.getElementById('calc-valorParcela').value);
    const valorEmprestado = onlyDigits(document.getElementById('calc-valorEmprestado').value);

    if (!codigoBanco || !quantidadeParcelas || !proximaParcela || !ultimaParcela || !valorParcela || !valorEmprestado) {
      showCalcError(t('error.preencherTodos'));
      return;
    }

    const proximaParcelaIso = parseDataDDMMYYYY(proximaParcela);
    const ultimaParcelaIso = parseDataDDMMYYYY(ultimaParcela);

    if (!proximaParcelaIso || !ultimaParcelaIso) {
      showCalcError(t('error.datasInvalidas'));
      return;
    }

    hideCalcError();
    setCalcLoading(true);
    calcResultCard.hidden = true;

    try {
      const res = await fetch('/pcd/calculo', {
        method: 'POST',
        headers: apiHeaders({ 'Content-Type': 'application/json' }),
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
        const body = await res.json().catch(() => null);
        showCalcError(body?.message || t('error.calcular'));
        return;
      }

      const data = await res.json();
      await showCalcResult(data);
    } catch {
      showCalcError(t('error.conexao'));
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
      const res = await fetch(`/pcd/banco/${encodeURIComponent(codigoBanco)}`, { headers: apiHeaders() });
      if (!res.ok) {
        nomeEl.textContent = t('bank.naoEncontradoInline');
        return;
      }

      const banco = await res.json();
      nomeEl.textContent = banco.nomeExtenso;
      codigoEl.textContent = banco.numeroCodigo;
      ispbEl.textContent = banco.ispb;
    } catch {
      nomeEl.textContent = t('bank.erroInfo');
    }
  }

  function formatNumber(value) {
    const locale = currentLang === 'en' ? 'en-US' : 'pt-BR';
    return value.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function formatCurrency(value) {
    const locale = currentLang === 'en' ? 'en-US' : 'pt-BR';
    return value.toLocaleString(locale, { style: 'currency', currency: 'BRL' });
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
    calcBtnText.textContent = loading ? t('btn.calculando') : t('btn.calcular');
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
      const res = await fetch('/pcd/calculos-dia', { headers: apiHeaders() });

      if (!res.ok) {
        showCalculosDiaError(t('calcDia.error'));
        return;
      }

      const items = await res.json();
      await renderCalculosDia(items);

      calculosDiaSection.hidden = false;
      calculosDiaSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch {
      showCalculosDiaError(t('error.conexao'));
    } finally {
      setCalculosDiaLoading(false);
    }
  });

  async function renderCalculosDia(items) {
    calculosDiaList.innerHTML = '';

    if (items.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'form-hint';
      empty.textContent = t('calcDia.empty');
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
      const res = await fetch(`/pcd/banco/${encodeURIComponent(codigoBanco)}`, { headers: apiHeaders() });
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
    if (banco) {
      const codigoEl = document.createElement('span');
      codigoEl.className = 'calculos-dia-card-header-codigo';
      codigoEl.textContent = banco.numeroCodigo;
      header.appendChild(codigoEl);
      header.appendChild(document.createTextNode(banco.nomeExtenso));
    } else {
      header.textContent = t('bank.naoEncontradoInline');
    }
    body.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'pcd-result-grid calculos-dia-grid';

    grid.appendChild(createResultItem(t('result.proximaParcela'), formatDate(item.proximaParcela)));
    grid.appendChild(createResultItem(t('result.ultimaParcela'), formatDate(item.ultimaParcela)));
    grid.appendChild(createResultItem(t('result.quantidadeParcelas'), item.quantidadeParcelas));
    grid.appendChild(createResultItem(t('result.valorParcela'), formatCurrency(item.valorParcela)));
    grid.appendChild(createResultItem(t('result.valorEmprestado'), formatCurrency(item.valorEmprestado)));
    grid.appendChild(createResultItem(t('result.taxaJuros'), `${formatNumber(item.taxaJuros)}%`));
    grid.appendChild(createResultItem(t('result.mesesEmSer'), item.mesesEmSer));
    grid.appendChild(createResultItem(t('result.saldoDevedor'), formatCurrency(item.saldoDevedor)));
    grid.appendChild(createResultItem(t('result.ispb'), banco ? banco.ispb : '—'));

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
    calculosDiaBtnText.textContent = loading ? t('calcDia.loading') : t('calcDia.link');
    calculosDiaSpinner.hidden = !loading;
  }

  // ── Quantidade de cálculos hoje ──
  const qtdCalculosEl = document.getElementById('qtd-calculos-hoje');

  fetch('/pcd/qtd-calculos', { headers: apiHeaders() })
    .then((res) => (res.ok ? res.json() : null))
    .then((qtd) => {
      if (qtd !== null) {
        qtdCalculosEl.textContent = qtd;
      }
    })
    .catch(() => { });
});
