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

const FIT_LIMITS = {
  cavalo:  { min: 60, max: 115 },
  esterno: { min: 45, max: 165 },
  braco:   { min: 40, max: 100 },
};

const TRANSLATIONS = {
  pt: {
    'meta.title': 'Nograu — Calculadoras para Ciclismo: Bike Fit e Conversor de Medidas',

    'nav.converter': 'conversor de medidas',
    'nav.history': 'cálculos anteriores',
    'lang.toggleAria': 'Alternar idioma',

    'hero.title': 'Calcule seu Bike Fit',
    'hero.subtitle': 'Informe suas medidas corporais e receba as recomendações de quadro e selim personalizadas.',

    'form.sectionMeasures': 'Suas medidas',

    'form.cavalo.label': 'Cavalo',
    'form.cavalo.imgAlt': 'Medida do cavalo (inseam)',
    'form.cavalo.placeholder': 'ex: 81',
    'form.cavalo.hint1': 'A distância do chão até a virilha.',
    'form.cavalo.hint2': 'Meça encostado na parede e com as pernas bem juntas.',
    'form.cavalo.hint3': 'Use um livro entre elas para facilitar.',
    'form.cavalo.hint4': 'Em centímetros.',

    'form.esterno.label': 'Esterno',
    'form.esterno.imgAlt': 'Medida do esterno',
    'form.esterno.placeholder': 'ex: 55',
    'form.esterno.hint1': 'A distância do chão até o esterno.',
    'form.esterno.hint2': 'Identifique-o pela parte de baixo do "V" que tem logo abaixo do pescoço.',
    'form.esterno.hint3': 'Distância em centímetros.',

    'form.braco.label': 'Braço',
    'form.braco.imgAlt': 'Medida do braço',
    'form.braco.placeholder': 'ex: 64',
    'form.braco.hint1': 'Estique o braço com o polegar para cima',
    'form.braco.hint2': 'Meça a distância do ombro até o polegar',
    'form.braco.hint3': 'Distância em centímetros.',

    'form.email.hint': 'Para poder buscar se quiser consultar seu resultado',

    'btn.calculating': 'Calculando…',
    'btn.calculate': 'Calcular Bike Fit',

    'error.fillAllFields': 'Preencha todos os campos antes de calcular.',
    'error.invalidValues': 'Você digitou algum valor que parece incorreto, lembre-se de que deve usar apenas centímetros.',
    'error.serverStatus': 'Erro {status}. Verifique os dados e tente novamente.',
    'error.connectionFailed': 'Falha na conexão com o servidor. Tente novamente mais tarde.',

    'result.title': 'Resultado',

    'result.speedFrame.label': 'Quadro Speed',
    'result.speedFrame.description': 'Por tradição, o tamanho do quadro road costuma ser informado pela medida do tubo do selim (seat tube), contada do centro do movimento central até o topo do tubo (center‑to‑top). É comumente medido em centímetros. Tamanhos usuais: 48, 50, 52, 54, 56, 58, 60 cm. Sempre confira a convenção do fabricante (center‑to‑top vs center‑to‑center) e a tabela de geometria.',

    'result.mtbFrame.label': 'Quadro MTB',
    'result.mtbFrame.unit': 'pol',
    'result.mtbFrame.description': 'Em mountain bikes os fabricantes frequentemente usam classificações S/M/L/XL ou medidas do seat tube em polegadas/centímetros (ex.: 13", 15", 17", 19", 21"). Hoje, o que mais importa para o ajuste é o top tube efetivo e o reach, que definem a posição do ciclista; consulte a geometria do fabricante para escolher o tamanho correto.',

    'result.saddleHeight.label': 'Altura do Selim',
    'result.saddleHeight.description': 'Medida do centro do movimento central até o topo do selim. Serve como referência para ajustar a altura do selim; pequenas variações (±1–2 cm) são normais conforme preferência, tipo de pedal e ângulo de pedalada. Verifique o alinhamento do joelho durante o giro.',

    'result.topTube.label': 'Top Tube Efetivo',
    'result.topTube.description': 'Top tube efetivo é a medida horizontal que define o reach do ciclista (posição entre selim e guidão). É essencial para a postura e conforto; ao escolher um quadro compare o top tube efetivo e o comprimento do avanço (mesa) na tabela de geometria do fabricante.',

    'result.important.title': 'Muito Importante',
    'result.important.text1': 'Este bike fit virtual usa uma fórmula simples e consagrada, mas serve apenas como um ponto de partida. Sempre que possível, procure um profissional, seja para adquirir uma nova bicicleta ou para se ajustar à que você já possui. Corpos diferentes podem ter sensações distintas com o mesmo equipamento. Consulte um profissional, especialmente se continuar sentindo dores ou desconforto após aplicar as medidas calculadas.',
    'result.important.text2': '* O método LeMond, utilizado aqui, foi criado pelo tricampeão do Tour de France, Greg LeMond.',

    'mural.title': 'Mural de Mensagens',
    'mural.loading': 'Carregando mensagens…',
    'mural.empty': 'Nenhuma mensagem ainda. Seja o primeiro!',
    'mural.loadError': 'Erro ao carregar mensagens. Tente novamente.',
    'mural.replyingToInline': 'respondendo a',
    'mural.replyLink': 'responder',
    'mural.prevPage': 'Página anterior',
    'mural.nextPage': 'Próxima página',
    'mural.pageInfo': 'Página {current} de {total}',
    'mural.leaveMessage': 'Deixe sua mensagem',
    'mural.replyingTo': 'Respondendo a',
    'mural.cancelReply': 'Cancelar resposta',
    'mural.form.name': 'Nome',
    'mural.form.namePlaceholder': 'Seu nome',
    'mural.form.message': 'Mensagem',
    'mural.form.messagePlaceholder': 'Deixe sua mensagem…',
    'mural.form.errorFillAll': 'Preencha todos os campos.',
    'mural.form.errorSend': 'Erro ao enviar mensagem. Tente novamente.',
    'mural.form.success': 'Mensagem enviada! Obrigado pela participação.',
    'mural.form.sending': 'Enviando…',
    'mural.form.send': 'Enviar mensagem',

    'footer.text': 'Bike Fit — cálculo baseado em medidas antropométricas',
    'footer.countSuffix': ' · quantidade de cálculos no dia: {qtd}',

    'common.close': 'Fechar',
    'common.at': 'às',

    'converter.title': 'Conversor de Medidas',
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

    'history.title': 'Cálculos Anteriores',
    'history.emailPlaceholder': 'Digite seu e-mail para buscar',
    'history.searching': 'Buscando…',
    'history.search': 'Buscar',
    'history.empty': 'Nenhum cálculo encontrado para este e-mail.',
    'history.error': 'Erro ao buscar cálculos. Tente novamente.',
    'history.table.date': 'Data',
    'history.table.cavalo': 'Cavalo',
    'history.table.esterno': 'Esterno',
    'history.table.braco': 'Braço',
    'history.table.speedFrame': 'Quadro Speed',
    'history.table.mtbFrame': 'Quadro MTB',
    'history.table.saddleHeight': 'Altura Selim',
    'history.table.topTube': 'Top Tube',
  },
  en: {
    'meta.title': 'Nograu — Cycling Calculators: Bike Fit and Unit Converter',

    'nav.converter': 'unit converter',
    'nav.history': 'previous calculations',
    'lang.toggleAria': 'Switch language',

    'hero.title': 'Calculate your Bike Fit',
    'hero.subtitle': 'Enter your body measurements and get personalized frame and saddle recommendations.',

    'form.sectionMeasures': 'Your measurements',

    'form.cavalo.label': 'Inseam',
    'form.cavalo.imgAlt': 'Inseam measurement',
    'form.cavalo.placeholder': 'e.g. 81',
    'form.cavalo.hint1': 'The distance from the floor to your groin.',
    'form.cavalo.hint2': 'Measure standing against a wall with your legs close together.',
    'form.cavalo.hint3': 'Use a book between your legs to make it easier.',
    'form.cavalo.hint4': 'In centimeters.',

    'form.esterno.label': 'Sternum',
    'form.esterno.imgAlt': 'Sternum measurement',
    'form.esterno.placeholder': 'e.g. 55',
    'form.esterno.hint1': 'The distance from the floor to your sternum.',
    'form.esterno.hint2': 'Find it at the bottom of the "V" just below your neck.',
    'form.esterno.hint3': 'Distance in centimeters.',

    'form.braco.label': 'Arm',
    'form.braco.imgAlt': 'Arm measurement',
    'form.braco.placeholder': 'e.g. 64',
    'form.braco.hint1': 'Stretch your arm out with your thumb pointing up',
    'form.braco.hint2': 'Measure the distance from your shoulder to your thumb',
    'form.braco.hint3': 'Distance in centimeters.',

    'form.email.hint': 'So you can look it up later if you want to check your result',

    'btn.calculating': 'Calculating…',
    'btn.calculate': 'Calculate Bike Fit',

    'error.fillAllFields': 'Fill in all fields before calculating.',
    'error.invalidValues': 'One of the values you entered looks incorrect — remember to use centimeters only.',
    'error.serverStatus': 'Error {status}. Check your data and try again.',
    'error.connectionFailed': 'Connection to the server failed. Please try again later.',

    'result.title': 'Result',

    'result.speedFrame.label': 'Road Frame',
    'result.speedFrame.description': 'Traditionally, road frame size is given by the seat tube measurement, from the center of the bottom bracket to the top of the tube (center‑to‑top). It\'s usually measured in centimeters. Common sizes: 48, 50, 52, 54, 56, 58, 60 cm. Always check the manufacturer\'s convention (center‑to‑top vs center‑to‑center) and the geometry chart.',

    'result.mtbFrame.label': 'MTB Frame',
    'result.mtbFrame.unit': 'in',
    'result.mtbFrame.description': 'For mountain bikes, manufacturers often use S/M/L/XL classifications or seat tube measurements in inches/centimeters (e.g. 13", 15", 17", 19", 21"). Nowadays, what matters most for fit is the effective top tube and reach, which define the rider\'s position; check the manufacturer\'s geometry chart to pick the right size.',

    'result.saddleHeight.label': 'Saddle Height',
    'result.saddleHeight.description': 'Measured from the center of the bottom bracket to the top of the saddle. It\'s a reference for adjusting saddle height; small variations (±1–2 cm) are normal depending on preference, pedal type and pedaling angle. Check knee alignment during the pedal stroke.',

    'result.topTube.label': 'Effective Top Tube',
    'result.topTube.description': 'The effective top tube is the horizontal measurement that defines the rider\'s reach (the position between saddle and handlebar). It\'s essential for posture and comfort; when choosing a frame, compare the effective top tube and stem length on the manufacturer\'s geometry chart.',

    'result.important.title': 'Very Important',
    'result.important.text1': 'This virtual bike fit uses a simple, well-established formula, but it\'s only meant as a starting point. Whenever possible, see a professional, whether you\'re buying a new bike or adjusting the one you already have. Different bodies can feel differently with the same equipment. Consult a professional, especially if you continue to feel pain or discomfort after applying the calculated measurements.',
    'result.important.text2': '* The LeMond method used here was created by three-time Tour de France champion Greg LeMond.',

    'mural.title': 'Message Board',
    'mural.loading': 'Loading messages…',
    'mural.empty': 'No messages yet. Be the first!',
    'mural.loadError': 'Error loading messages. Please try again.',
    'mural.replyingToInline': 'replying to',
    'mural.replyLink': 'reply',
    'mural.prevPage': 'Previous page',
    'mural.nextPage': 'Next page',
    'mural.pageInfo': 'Page {current} of {total}',
    'mural.leaveMessage': 'Leave your message',
    'mural.replyingTo': 'Replying to',
    'mural.cancelReply': 'Cancel reply',
    'mural.form.name': 'Name',
    'mural.form.namePlaceholder': 'Your name',
    'mural.form.message': 'Message',
    'mural.form.messagePlaceholder': 'Leave your message…',
    'mural.form.errorFillAll': 'Fill in all fields.',
    'mural.form.errorSend': 'Error sending message. Please try again.',
    'mural.form.success': 'Message sent! Thanks for participating.',
    'mural.form.sending': 'Sending…',
    'mural.form.send': 'Send message',

    'footer.text': 'Bike Fit — calculation based on anthropometric measurements',
    'footer.countSuffix': ' · calculations today: {qtd}',

    'common.close': 'Close',
    'common.at': 'at',

    'converter.title': 'Unit Converter',
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

    'history.title': 'Previous Calculations',
    'history.emailPlaceholder': 'Enter your email to search',
    'history.searching': 'Searching…',
    'history.search': 'Search',
    'history.empty': 'No calculations found for this email.',
    'history.error': 'Error searching calculations. Please try again.',
    'history.table.date': 'Date',
    'history.table.cavalo': 'Inseam',
    'history.table.esterno': 'Sternum',
    'history.table.braco': 'Arm',
    'history.table.speedFrame': 'Road Frame',
    'history.table.mtbFrame': 'MTB Frame',
    'history.table.saddleHeight': 'Saddle Height',
    'history.table.topTube': 'Top Tube',
  },
};

function detectLang() {
  const saved = localStorage.getItem('nograu-lang');
  if (saved === 'pt' || saved === 'en') return saved;
  const nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
  return nav.startsWith('pt') ? 'pt' : 'en';
}

function fmtConvResult(n) {
  if (!isFinite(n)) return '';
  if (n === 0) return '0';
  const abs = Math.abs(n);
  if (abs >= 1e12 || (abs < 0.000001 && abs > 0)) return n.toExponential(4);
  return String(parseFloat(n.toPrecision(9)));
}

function appData() {
  return {
    lang: detectLang(),
    langMenuOpen: false,

    fitCavalo: '', fitEsterno: '', fitBraco: '', fitEmail: '',
    fitLoading: false, fitError: '', fitResult: null,
    footerQtd: 0,

    historicoOpen: false, historicoEmail: '',
    historicoLoading: false, historicoItems: [], historicoState: 'idle',

    conversorOpen: false, convActiveTab: 'comprimento',
    convTabs: [
      { key: 'comprimento' },
      { key: 'volume' },
      { key: 'massa' },
      { key: 'area' },
      { key: 'velocidade' },
    ],
    convState: {
      comprimento: { value: '', from: 'km',  to: 'm'   },
      volume:      { value: '', from: 'L',   to: 'mL'  },
      massa:       { value: '', from: 'kg',  to: 'g'   },
      area:        { value: '', from: 'm2',  to: 'cm2' },
      velocidade:  { value: '', from: 'kmh', to: 'ms'  },
    },

    muralMessages: [], muralPage: 0, muralTotalPages: 0,
    muralLoading: true, muralLoadError: false,
    muralNome: '', muralEmail: '', muralMensagem: '',
    muralSubmitting: false, muralSuccess: false, muralError: '',
    muralIdResposta: null, muralRespondendoNome: '',
    muralRespostas: {},

    init() {
      document.documentElement.lang = this.lang === 'en' ? 'en' : 'pt-BR';
      document.title = this.t('meta.title');
      this.carregarMensagens(0);
      fetch('/fit/qtd')
        .then(r => r.json())
        .then(qtd => { if (qtd > 1) this.footerQtd = qtd; })
        .catch(() => {});
    },

    t(key, params) {
      let str = TRANSLATIONS[this.lang]?.[key] ?? TRANSLATIONS.pt[key] ?? key;
      if (params) for (const k in params) str = str.replace(`{${k}}`, params[k]);
      return str;
    },

    setLang(lang) {
      if (lang !== 'pt' && lang !== 'en') return;
      this.lang = lang;
      localStorage.setItem('nograu-lang', lang);
      document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
      document.title = this.t('meta.title');
    },

    get convUnits() {
      return CONV_DATA[this.convActiveTab].units;
    },

    fmt(value, decimals = 1) {
      if (value == null) return '—';
      return Number(value).toFixed(decimals);
    },

    fmtDate(iso) {
      if (!iso) return '—';
      const locale = this.lang === 'en' ? 'en-US' : 'pt-BR';
      const d = new Date(iso);
      return d.toLocaleDateString(locale) + ' ' +
        d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
    },

    fmtMuralDate(iso) {
      if (!iso) return '';
      const locale = this.lang === 'en' ? 'en-US' : 'pt-BR';
      const d = new Date(iso);
      return d.toLocaleDateString(locale) + ' ' + this.t('common.at') + ' ' +
        d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
    },

    async submitFit() {
      this.fitError = '';
      const cavalo  = parseFloat(this.fitCavalo);
      const esterno = parseFloat(this.fitEsterno);
      const braco   = parseFloat(this.fitBraco);
      const email   = this.fitEmail.trim();
      if (!cavalo || !esterno || !braco || !email) {
        this.fitError = this.t('error.fillAllFields');
        return;
      }
      if (
        cavalo  < FIT_LIMITS.cavalo.min  || cavalo  > FIT_LIMITS.cavalo.max  ||
        esterno < FIT_LIMITS.esterno.min || esterno > FIT_LIMITS.esterno.max ||
        braco   < FIT_LIMITS.braco.min   || braco   > FIT_LIMITS.braco.max
      ) {
        this.fitError = this.t('error.invalidValues');
        return;
      }
      this.fitLoading = true;
      try {
        const res = await fetch('/fit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cavalo, esterno, braco, email }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          this.fitError = body?.errors
            ? this.t('error.invalidValues')
            : body?.message || this.t('error.serverStatus', { status: res.status });
          return;
        }
        this.fitResult = await res.json();
        this.$nextTick(() =>
          document.getElementById('result-section')
            ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        );
      } catch {
        this.fitError = this.t('error.connectionFailed');
      } finally {
        this.fitLoading = false;
      }
    },

    async buscarHistorico() {
      if (!this.historicoEmail.trim()) return;
      this.historicoLoading = true;
      this.historicoState = 'idle';
      this.historicoItems = [];
      try {
        const res = await fetch('/fit?email=' + encodeURIComponent(this.historicoEmail.trim()));
        if (!res.ok) throw new Error();
        const data = await res.json();
        this.historicoItems = data;
        this.historicoState = data.length ? 'ok' : 'empty';
      } catch {
        this.historicoState = 'error';
      } finally {
        this.historicoLoading = false;
      }
    },

    async carregarMensagens(page) {
      this.muralLoading = true;
      this.muralLoadError = false;
      this.muralMessages = [];
      try {
        const res = await fetch(`/mensagem?page=${page}&size=5&sort=createdAt,desc`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        this.muralMessages = data.content || [];
        this.muralPage = data.page?.number ?? 0;
        this.muralTotalPages = data.page?.totalPages ?? 0;

        const ids = [...new Set(
          this.muralMessages
            .map(m => m.idResposta)
            .filter(id => id && !this.muralRespostas[id])
        )];
        await Promise.all(ids.map(id =>
          fetch(`/mensagem/${id}`)
            .then(r => r.ok ? r.json() : null)
            .then(m => { if (m) this.muralRespostas[m.id] = m; })
            .catch(() => {})
        ));

        if (page > 0)
          this.$nextTick(() =>
            document.getElementById('mural-lista')
              ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
          );
      } catch {
        this.muralLoadError = true;
      } finally {
        this.muralLoading = false;
      }
    },

    responder(m) {
      this.muralIdResposta = m.id;
      this.muralRespondendoNome = m.nome;
      this.$nextTick(() => {
        document.getElementById('mural-form')
          ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    },

    cancelarResposta() {
      this.muralIdResposta = null;
      this.muralRespondendoNome = '';
    },

    async enviarMensagem() {
      this.muralError = '';
      this.muralSuccess = false;
      const nome     = this.muralNome.trim();
      const email    = this.muralEmail.trim();
      const mensagem = this.muralMensagem.trim();
      if (!nome || !email || !mensagem) {
        this.muralError = this.t('mural.form.errorFillAll');
        return;
      }
      this.muralSubmitting = true;
      try {
        const url = this.muralIdResposta
          ? `/mensagem?idResposta=${this.muralIdResposta}`
          : '/mensagem';
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, email, mensagem }),
        });
        if (!res.ok) throw new Error();
        this.muralSuccess = true;
        this.muralNome = '';
        this.muralEmail = '';
        this.muralMensagem = '';
        this.muralIdResposta = null;
        this.muralRespondendoNome = '';
        this.carregarMensagens(0);
      } catch {
        this.muralError = this.t('mural.form.errorSend');
      } finally {
        this.muralSubmitting = false;
      }
    },

    convResult(tab) {
      const s = this.convState[tab];
      if (s.value === '' || s.value == null) return '';
      const val = parseFloat(String(s.value).replace(',', '.'));
      if (isNaN(val)) return '';
      const units = CONV_DATA[tab].units;
      const fromF = units.find(u => u[0] === s.from)[1];
      const toF   = units.find(u => u[0] === s.to)[1];
      return fmtConvResult(val * fromF / toF);
    },

    swapConv(tab) {
      const s = this.convState[tab];
      [s.from, s.to] = [s.to, s.from];
    },
  };
}
