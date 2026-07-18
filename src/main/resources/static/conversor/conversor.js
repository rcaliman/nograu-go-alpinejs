const CONV_DATA = {
  comprimento: { units: [
    ['km',  1000],
    ['m',   1],
    ['cm',  0.01],
    ['mm',  0.001],
    ['mi',  1609.344],
    ['yd',  0.9144],
    ['ft',  0.3048],
    ['in',  0.0254],
    ['nmi', 1852],
  ]},
  volume: { units: [
    ['L',    1],
    ['mL',   0.001],
    ['m3',   1000],
    ['cm3',  0.001],
    ['gal',  3.785411784],
    ['floz', 0.02957352956],
    ['cup',  0.2365882365],
    ['tbsp', 0.01478676478],
    ['tsp',  0.00492892159],
  ]},
  massa: { units: [
    ['kg',  1000],
    ['g',   1],
    ['mg',  0.001],
    ['t',   1000000],
    ['lb',  453.59237],
    ['oz',  28.349523125],
  ]},
  area: { units: [
    ['m2',  1],
    ['cm2', 0.0001],
    ['km2', 1000000],
    ['mm2', 0.000001],
    ['ha',  10000],
    ['ac',  4046.8564224],
    ['ft2', 0.09290304],
    ['in2', 0.00064516],
    ['mi2', 2589988.110336],
  ]},
  velocidade: { units: [
    ['kmh',  0.27778],
    ['ms',   1],
    ['mph',  0.44704],
    ['kt',   0.514444],
    ['mach', 340.29],
  ]},
};

const CONV_TRANSLATIONS = {
  pt: {
    'meta.title': 'Conversor de Medidas Online Grátis — Nograu',

    'nav.bikefit': 'bike fit',
    'nav.loan': 'cálculo de empréstimo',
    'nav.converter': 'conversor de medidas',
    'nav.tagpet': 'tag pet',
    'nav.toggleAria': 'Abrir menu',
    'lang.toggleAria': 'Alternar idioma',

    'conv.title': 'Conversor de Medidas',
    'conv.subtitle': 'Converta unidades entre diferentes sistemas de medida: comprimento, volume, massa, área e velocidade.',
    'conv.sectionTitle': 'Conversor',

    'converter.value': 'Valor',
    'converter.valuePlaceholder': 'Digite o valor',
    'converter.from': 'De',
    'converter.to': 'Para',
    'converter.swap': 'Inverter unidades',
    'converter.result': 'Resultado',

    'tab.comprimento': 'Comprimento',
    'tab.volume': 'Volume',
    'tab.massa': 'Massa',
    'tab.area': 'Área',
    'tab.velocidade': 'Velocidade',

    'unit.km': 'Quilômetro (km)', 'unit.m': 'Metro (m)', 'unit.cm': 'Centímetro (cm)',
    'unit.mm': 'Milímetro (mm)', 'unit.mi': 'Milha (mi)', 'unit.yd': 'Jarda (yd)',
    'unit.ft': 'Pé (ft)', 'unit.in': 'Polegada (in)', 'unit.nmi': 'Milha náutica (nmi)',

    'unit.L': 'Litro (L)', 'unit.mL': 'Mililitro (mL)', 'unit.m3': 'Metro cúbico (m³)',
    'unit.cm3': 'Centímetro cúbico (cm³)', 'unit.gal': 'Galão EUA (gal)', 'unit.floz': 'Onça fluida (fl oz)',
    'unit.cup': 'Xícara (cup)', 'unit.tbsp': 'Colher de sopa (tbsp)', 'unit.tsp': 'Colher de chá (tsp)',

    'unit.kg': 'Quilograma (kg)', 'unit.g': 'Grama (g)', 'unit.mg': 'Miligrama (mg)',
    'unit.t': 'Tonelada (t)', 'unit.lb': 'Libra (lb)', 'unit.oz': 'Onça (oz)',

    'unit.m2': 'Metro quadrado (m²)', 'unit.cm2': 'Centímetro quadrado (cm²)', 'unit.km2': 'Quilômetro quadrado (km²)',
    'unit.mm2': 'Milímetro quadrado (mm²)', 'unit.ha': 'Hectare (ha)', 'unit.ac': 'Acre',
    'unit.ft2': 'Pé quadrado (ft²)', 'unit.in2': 'Polegada quadrada (in²)', 'unit.mi2': 'Milha quadrada (mi²)',

    'unit.kmh': 'Km por hora (km/h)', 'unit.ms': 'Metro por segundo (m/s)', 'unit.mph': 'Milha por hora (mph)',
    'unit.kt': 'Nó (kt)', 'unit.mach': 'Mach',

    'footer.text': 'Conversor de Medidas — comprimento, volume, massa, área e velocidade',
  },
  en: {
    'meta.title': 'Free Online Unit Converter — Nograu',

    'nav.bikefit': 'bike fit',
    'nav.loan': 'loan calculator',
    'nav.converter': 'unit converter',
    'nav.tagpet': 'tag pet',
    'nav.toggleAria': 'Open menu',
    'lang.toggleAria': 'Switch language',

    'conv.title': 'Unit Converter',
    'conv.subtitle': 'Convert units between different measurement systems: length, volume, mass, area and speed.',
    'conv.sectionTitle': 'Converter',

    'converter.value': 'Value',
    'converter.valuePlaceholder': 'Enter the value',
    'converter.from': 'From',
    'converter.to': 'To',
    'converter.swap': 'Swap units',
    'converter.result': 'Result',

    'tab.comprimento': 'Length',
    'tab.volume': 'Volume',
    'tab.massa': 'Mass',
    'tab.area': 'Area',
    'tab.velocidade': 'Speed',

    'unit.km': 'Kilometer (km)', 'unit.m': 'Meter (m)', 'unit.cm': 'Centimeter (cm)',
    'unit.mm': 'Millimeter (mm)', 'unit.mi': 'Mile (mi)', 'unit.yd': 'Yard (yd)',
    'unit.ft': 'Foot (ft)', 'unit.in': 'Inch (in)', 'unit.nmi': 'Nautical mile (nmi)',

    'unit.L': 'Liter (L)', 'unit.mL': 'Milliliter (mL)', 'unit.m3': 'Cubic meter (m³)',
    'unit.cm3': 'Cubic centimeter (cm³)', 'unit.gal': 'US gallon (gal)', 'unit.floz': 'Fluid ounce (fl oz)',
    'unit.cup': 'Cup', 'unit.tbsp': 'Tablespoon (tbsp)', 'unit.tsp': 'Teaspoon (tsp)',

    'unit.kg': 'Kilogram (kg)', 'unit.g': 'Gram (g)', 'unit.mg': 'Milligram (mg)',
    'unit.t': 'Metric ton (t)', 'unit.lb': 'Pound (lb)', 'unit.oz': 'Ounce (oz)',

    'unit.m2': 'Square meter (m²)', 'unit.cm2': 'Square centimeter (cm²)', 'unit.km2': 'Square kilometer (km²)',
    'unit.mm2': 'Square millimeter (mm²)', 'unit.ha': 'Hectare (ha)', 'unit.ac': 'Acre',
    'unit.ft2': 'Square foot (ft²)', 'unit.in2': 'Square inch (in²)', 'unit.mi2': 'Square mile (mi²)',

    'unit.kmh': 'Km per hour (km/h)', 'unit.ms': 'Meter per second (m/s)', 'unit.mph': 'Mile per hour (mph)',
    'unit.kt': 'Knot (kt)', 'unit.mach': 'Mach',

    'footer.text': 'Unit Converter — length, volume, mass, area and speed',
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
  let str = CONV_TRANSLATIONS[currentLang]?.[key] ?? CONV_TRANSLATIONS.pt[key] ?? key;
  if (params) for (const k in params) str = str.replace(`{${k}}`, params[k]);
  return str;
}

function fmtConvResult(n) {
  if (!isFinite(n)) return '';
  if (n === 0) return '0';
  const abs = Math.abs(n);
  if (abs >= 1e12 || (abs < 0.000001 && abs > 0)) return n.toExponential(4);
  return String(parseFloat(n.toPrecision(9)));
}

function applyStaticTranslations() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.setAttribute('placeholder', t(el.dataset.i18nPlaceholder));
  });
  document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
    el.setAttribute('aria-label', t(el.dataset.i18nAriaLabel));
  });
  document.documentElement.lang = currentLang === 'en' ? 'en' : 'pt-BR';
  document.title = t('meta.title');
}

document.addEventListener('DOMContentLoaded', () => {
  applyStaticTranslations();

  function setLang(lang) {
    if (lang !== 'pt' && lang !== 'en') return;
    currentLang = lang;
    localStorage.setItem('nograu-lang', lang);
    applyStaticTranslations();
    populateUnits();
    updateResult();
  }

  window.NOGRAU_NAV = {
    t,
    getLang: () => currentLang,
    setLang,
  };

  // ── Conversor ──
  const state = {
    comprimento: { value: '', from: 'km',  to: 'm'   },
    volume:      { value: '', from: 'L',   to: 'mL'  },
    massa:       { value: '', from: 'kg',  to: 'g'   },
    area:        { value: '', from: 'm2',  to: 'cm2' },
    velocidade:  { value: '', from: 'kmh', to: 'ms'  },
  };
  let activeTab = 'comprimento';

  const tabButtons = document.querySelectorAll('.conv-tab');
  const valueInput = document.getElementById('conv-value');
  const fromSelect = document.getElementById('conv-from');
  const toSelect = document.getElementById('conv-to');
  const resultInput = document.getElementById('conv-result');
  const swapBtn = document.getElementById('conv-swap');

  function populateUnits() {
    const s = state[activeTab];
    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';
    CONV_DATA[activeTab].units.forEach(([code]) => {
      const label = t('unit.' + code);

      const optFrom = document.createElement('option');
      optFrom.value = code;
      optFrom.textContent = label;
      optFrom.selected = code === s.from;
      fromSelect.appendChild(optFrom);

      const optTo = document.createElement('option');
      optTo.value = code;
      optTo.textContent = label;
      optTo.selected = code === s.to;
      toSelect.appendChild(optTo);
    });
  }

  function updateResult() {
    const s = state[activeTab];
    if (s.value === '' || s.value == null) {
      resultInput.value = '';
      return;
    }
    const val = parseFloat(String(s.value).replace(',', '.'));
    if (isNaN(val)) {
      resultInput.value = '';
      return;
    }
    const units = CONV_DATA[activeTab].units;
    const fromF = units.find((u) => u[0] === s.from)[1];
    const toF = units.find((u) => u[0] === s.to)[1];
    resultInput.value = fmtConvResult((val * fromF) / toF);
  }

  function switchTab(tab) {
    activeTab = tab;
    tabButtons.forEach((btn) => {
      const active = btn.dataset.tab === tab;
      btn.classList.toggle('conv-tab-active', active);
      btn.setAttribute('aria-selected', String(active));
    });
    valueInput.value = state[tab].value;
    populateUnits();
    updateResult();
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  valueInput.addEventListener('input', (e) => {
    state[activeTab].value = e.target.value;
    updateResult();
  });

  fromSelect.addEventListener('change', (e) => {
    state[activeTab].from = e.target.value;
    updateResult();
  });

  toSelect.addEventListener('change', (e) => {
    state[activeTab].to = e.target.value;
    updateResult();
  });

  swapBtn.addEventListener('click', () => {
    const s = state[activeTab];
    [s.from, s.to] = [s.to, s.from];
    populateUnits();
    updateResult();
  });

  populateUnits();
});
