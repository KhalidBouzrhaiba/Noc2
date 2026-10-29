import { L } from '../core/i18n.js';

// ═══════════════════════════════════════════════════════════════════════════
// CASE A — THE LAST BROADCAST
// ═══════════════════════════════════════════════════════════════════════════
// Story bible (internal; drives the structured data below and the tests).
export const bible = {
  truth:
    'Station manager Victor Hale signed three tower-generator maintenance invoices for work never done. ' +
    'Journalist Mira Vale was about to expose this live on "Night Lines". At 23:41 Hale entered the tower ' +
    'with his access card and at 23:47 manually switched off transmitter breaker TX-1, cutting her off. He told ' +
    'police a north-district grid outage caused it. Mira, holding a temporary press card, entered the tower at 23:55, ' +
    'switched TX-1 back on at 23:57:50 and broadcast a 40-second message at 23:58 pointing to locker 7, where she ' +
    'had hidden copies of her evidence. She left the tower at 00:04, bought batteries and a bus timetable at 00:21 ' +
    'and left town by choice.',
  initialBelief: 'A grid outage cut the tower; Mira vanished afterwards, perhaps harmed.',
  characters: {
    hale: 'Knows everything about the invoices and the cut. Lies: claims he never left the studio.',
    mira: 'Knew Hale was watching; prepared locker 7 in advance. Left voluntarily.',
    benali: 'Officer. Recorded Hale’s outage claim without checking the grid.',
    arden: 'Editor. Holds Mira’s spare key; knows she was working on a tower story.',
    nadia: 'Cashier. Saw Mira at ~00:20, calm but hurried; heard the 23:58 message on the shop radio.',
  },
  verified: ['log', 'access', 'freezer', 'receipt', 'breaker', 'servicebook', 'invoices', 'envelope', 'packed'],
  claims: ['hale', 'report', 'cashier'],
  chronology: [
    ['23:30', 'Night Lines begins, guest Mira Vale (log)'],
    ['23:41', 'Hale’s card opens the tower gate (access)'],
    ['23:47:12', 'TX-1 switched OFF by hand (breaker); log entry “power failure — V.H.” (log)'],
    ['23:55', 'Mira’s temporary card opens the gate (access)'],
    ['23:57:50', 'TX-1 switched ON by hand (breaker)'],
    ['23:58', '40-second carrier and message (log, tape)'],
    ['00:04', 'Mira’s card exits (access)'],
    ['00:21', 'Mira buys batteries and a bus timetable (receipt, cashier)'],
  ],
  theories: {
    outage: { contradictedBy: ['freezer', 'breaker', 'log'] },
    deliberateCut: { supportedBy: ['breaker', 'access', 'hale', 'invoices', 'servicebook'] },
    miraHarmed: { contradictedBy: ['receipt', 'cashier', 'packed', 'envelope'] },
  },
  unresolved: 'Where Mira is now. Her note says she is safe; nothing confirms where she went.',
};

export default {
  id: 'broadcast',
  num: '01',
  motif: 'radio',
  accent: 'rust',
  bible,
  title: L('آخر بثّ', 'البثّ الأخير', 'La Dernière Émission', 'The Last Broadcast'),
  teaser: L(
    'صحفية غبرات من بعد ما تقطع البث ديالها. الرسمي كيقول: الضو مشى. الأرشيف كيقول شي حاجة أخرى.',
    'صحفية اختفت بعد انقطاع بثّها. الرواية الرسمية: انقطاع الكهرباء. السجلات تقول غير ذلك.',
    'Une journaliste disparaît après une émission coupée. Version officielle : panne de courant. Les archives disent autre chose.',
    'A journalist vanishes after her broadcast is cut. Official story: a power failure. The records say otherwise.',
  ),
  radio: {
    freq: '98.7',
    lines: [
      L('هنا راديو هولومير، 98.7… نشرة خاصة.', 'هنا إذاعة هولومير، 98.7… نشرة خاصة.', 'Ici Radio Hollowmere, 98.7… bulletin spécial.', 'This is Radio Hollowmere, 98.7… a special bulletin.'),
      L(
        'الصحفية ميرا فال ما بانتش من البارح، من بعد ما تقطع برنامج «ليالي الخط» مع 23:47.',
        'لم تُرَ الصحفية ميرا فال منذ انقطاع برنامج «خطوط الليل» عند الساعة 23:47 البارحة.',
        'La journaliste Mira Vale n’a pas été revue depuis la coupure de « Lignes de nuit », hier à 23 h 47.',
        'Journalist Mira Vale has not been seen since last night’s “Night Lines” was cut off at 23:47.',
      ),
      L(
        'الإذاعة كتقول الضو طفا فالبرج. شي مستمعين كيقولو حاجة أخرى.',
        'تقول المحطة إن الكهرباء انقطعت عن البرج. بعض المستمعين يقولون غير ذلك.',
        'La station accuse une panne de courant à la tour. Certains auditeurs racontent autre chose.',
        'The station blames a power failure at the tower. Some listeners say otherwise.',
      ),
      L(
        'شي ناس سمعو الصوت ديالها عاوتاني، حداش دقيقة من بعد. وهادشي ما كانش خاصو يكون ممكن.',
        'بعضهم سمع صوتها مجددًا بعد إحدى عشرة دقيقة. وهذا ما كان ينبغي أن يكون ممكنًا.',
        'Certains ont réentendu sa voix onze minutes plus tard. Ce qui n’aurait pas dû être possible.',
        'Some heard her voice again, eleven minutes later. That should not have been possible.',
      ),
      L('اللي عندو شي معلومة… [تشويش]', 'كلّ من لديه معلومات… [تشويش]', 'Toute personne disposant d’informations… [grésillements]', 'Anyone with information… [static]'),
    ],
  },
  reveal: L(
    'هولومير، 31 أكتوبر. الضو ديال الإذاعة باقي شاعل.',
    'هولومير، 31 أكتوبر. أضواء المحطة ما تزال مشتعلة.',
    'Hollowmere, 31 octobre. Les lumières de la station sont toujours allumées.',
    'Hollowmere, 31 October. The station’s lights are still on.',
  ),
  start: 'station',

  // ─────────────────────────────── Locations
  locations: [
    {
      id: 'station',
      scene: 'studio',
      map: [30, 38],
      name: L('الإذاعة', 'محطة الإذاعة', 'La station de radio', 'Radio station'),
      desc: L(
        'الضو الحمر ديال «على الهوا» طافي. الكرسي ديال الضيف باقي مقلوب شوية.',
        'مصباح «على الهواء» الأحمر مطفأ. كرسي الضيف ما يزال مائلًا قليلًا.',
        'La lampe rouge « À l’antenne » est éteinte. Le fauteuil de l’invitée est encore de travers.',
        'The red ON AIR lamp is dark. The guest chair is still pushed askew.',
      ),
    },
    {
      id: 'police',
      scene: 'police',
      map: [62, 30],
      name: L('الكوميسارية', 'مركز الشرطة', 'Le commissariat', 'Police station'),
      desc: L(
        'ريحة القهوة الباردة وورق كثير. المفتشة بنعلي ما نعساتش.',
        'رائحة قهوة باردة وأوراق كثيرة. المفتشة بنعلي لم تنم.',
        'Odeur de café froid et de paperasse. L’agente Benali n’a pas dormi.',
        'Cold coffee and too much paper. Officer Benali hasn’t slept.',
      ),
    },
    {
      id: 'newspaper',
      scene: 'newsroom',
      map: [46, 56],
      name: L('الجريدة', 'مكتب الجريدة', 'Le journal', 'Newspaper office'),
      desc: L(
        'مكتب ميرا مرتب بزاف، بحال اللي كانت عارفة شي واحد غادي يقلّب فيه.',
        'مكتب ميرا مرتّب أكثر من اللازم، كأنها كانت تعلم أن أحدًا سيفتّشه.',
        'Le bureau de Mira est trop bien rangé, comme si elle savait qu’on le fouillerait.',
        'Mira’s desk is too tidy, as if she knew someone would search it.',
      ),
    },
    {
      id: 'market',
      scene: 'market',
      map: [74, 62],
      name: L('السوبرمارشي', 'المتجر الكبير', 'Le supermarché', 'Supermarket'),
      desc: L(
        'الضو الأبيض ديال الليل وراديو صغير فوق الكاشة.',
        'إضاءة بيضاء ليلية وراديو صغير فوق صندوق الدفع.',
        'Néons de nuit et une petite radio sur le comptoir.',
        'Night-shift fluorescents and a small radio on the counter.',
      ),
    },
    {
      id: 'apartment',
      scene: 'apartment',
      map: [20, 66],
      unlock: { item: 'aptkey' },
      name: L('دار ميرا', 'شقة ميرا', 'L’appartement de Mira', 'Mira’s apartment'),
      desc: L(
        'الشتا كتضرب فالسرجم. كاس ديال أتاي بقى فنصو.',
        'المطر ينقر على النافذة. كوب شاي بقي نصفه.',
        'La pluie tapote la vitre. Une tasse de thé à moitié bue.',
        'Rain on the window. A cup of tea left half-drunk.',
      ),
    },
    {
      id: 'tower',
      scene: 'tower',
      map: [84, 18],
      unlock: { puzzle: 'p_outage' },
      name: L('برج الإذاعة', 'برج البثّ', 'La tour d’émission', 'Radio tower'),
      desc: L(
        'البرج كيتسمع مع الريح. الباب ديال الفوق مقفول بالسلسلة.',
        'البرج يئنّ مع الريح. البوابة مقفلة بسلسلة.',
        'La tour grince dans le vent. Le portail est cadenassé.',
        'The tower creaks in the wind. The gate is chained.',
      ),
    },
    {
      id: 'mroom',
      scene: 'machine',
      map: [90, 34],
      unlock: { puzzle: 'p_code' },
      name: L('بيت الصيانة', 'غرفة الصيانة', 'La salle de maintenance', 'Tower maintenance room'),
      desc: L(
        'مولّد كيسكت، لوحة ديال القواطع، وخزانات مرقمة.',
        'مولّد صامت، ولوحة قواطع، وخزائن مرقّمة.',
        'Un générateur muet, un tableau de disjoncteurs, des casiers numérotés.',
        'A silent generator, a breaker panel, numbered lockers.',
      ),
    },
  ],

  // ─────────────────────────────── Items (portable)
  items: {
    aptkey: {
      icon: 'key',
      name: L('ساروت ديال الدار', 'مفتاح الشقة', 'Clé de l’appartement', 'Apartment key'),
      desc: L('الساروت الاحتياطي ديال ميرا، مع ورقة: «الطابق 3».', 'مفتاح ميرا الاحتياطي، عليه بطاقة: «الطابق 3».', 'Le double de Mira, avec une étiquette : « 3e étage ».', 'Mira’s spare key, tagged “3rd floor”.'),
    },
    gatekey: {
      icon: 'key',
      name: L('ساروت الباب ديال البرج', 'مفتاح بوابة البرج', 'Clé du portail de la tour', 'Tower gate key'),
      desc: L('عطاتهولك بنعلي. ثقيل وبارد.', 'سلّمتك إياه بنعلي. ثقيل وبارد.', 'Remise par Benali. Lourde et froide.', 'Handed over by Benali. Heavy and cold.'),
    },
    key7: {
      icon: 'smallkey',
      name: L('ساروت صغير «7»', 'مفتاح صغير «7»', 'Petite clé « 7 »', 'Small key “7”'),
      desc: L('ساروت من النحاس عليه رقم 7. ما شي ديال باب.', 'مفتاح نحاسي صغير يحمل الرقم 7. ليس لباب.', 'Une petite clé en laiton marquée 7. Pas une clé de porte.', 'A small brass key stamped 7. Not a door key.'),
      misfit: L('ما كيدخلش هنا. صغير بزاف.', 'لا يناسب هذا القفل. إنه صغير جدًا.', 'Elle n’entre pas ici. Trop petite.', 'It doesn’t fit here. Too small.'),
    },
  },

  // ─────────────────────────────── Evidence
  clues: {
    log: {
      kind: 'record',
      status: 'verified',
      from: 'station',
      title: L('سجل البث', 'سجلّ البثّ', 'Journal d’antenne', 'Broadcast log'),
      body: L(
        '30/10\n23:30  «ليالي الخط» بدا — الضيفة: م. فال\n23:47  [بخط اليد] تقطع الضو فالبرج — ف.هـ.\n23:58  [المراقب الأوتوماتيكي] الموجة رجعات — 40 ثانية\n23:59  [المراقب الأوتوماتيكي] الموجة مشات',
        '30/10\n23:30  بداية «خطوط الليل» — الضيفة: م. فال\n23:47  [بخط اليد] انقطاع الكهرباء في البرج — ف.هـ.\n23:58  [المراقب الآلي] رُصِدت الموجة — 40 ثانية\n23:59  [المراقب الآلي] فُقدت الموجة',
        '30/10\n23:30  Début de « Lignes de nuit » — invitée : M. Vale\n23:47  [manuscrit] Coupure de courant à la tour — V.H.\n23:58  [moniteur automatique] Porteuse détectée — 40 s\n23:59  [moniteur automatique] Porteuse perdue',
        '30/10\n23:30  “Night Lines” begins — guest: M. Vale\n23:47  [handwritten] Tower power failure — V.H.\n23:58  [automatic monitor] Carrier detected — 40 s\n23:59  [automatic monitor] Carrier lost',
      ),
    },
    tape: {
      kind: 'record',
      status: 'verified',
      from: 'station',
      title: L('بكرة التسجيل', 'شريط التسجيل', 'Bande d’enregistrement', 'Studio tape'),
      body: L(
        '23:46 — ميرا: «…الفاتورات ديال الصيانة ديال البرج مسنية على خدمة اللي…» [تقطع]\n23:58 — ميرا، الصوت بعيد: «إلا كنتي كتسمع هادشي، البرج عمرو ما بقى بلا ضو. الخزانة سبعة.» [تشويش]',
        '23:46 — ميرا: «…فواتير صيانة البرج موقّعة لأعمال لم…» [انقطاع]\n23:58 — ميرا، بصوت بعيد: «إن كنت تسمع هذا، فالبرج لم يفقد الكهرباء قط. الخزانة السابعة.» [تشويش]',
        '23:46 — Mira : « …les factures d’entretien de la tour sont signées pour des travaux qui n’ont… » [coupure]\n23:58 — Mira, voix lointaine : « Si vous entendez ceci, la tour n’a jamais perdu le courant. Casier sept. » [grésillements]',
        '23:46 — Mira: “…the tower maintenance invoices are signed for work that never—” [cut]\n23:58 — Mira, distant: “If you can hear this, the tower never lost power. Locker seven.” [static]',
      ),
    },
    report: {
      kind: 'document',
      status: 'unverified',
      from: 'police',
      title: L('التقرير الرسمي', 'التقرير الرسمي', 'Rapport officiel', 'Official report'),
      body: L(
        'السبب: تقطع الضو فالحي الشمالي مع 23:47 طفا البرج.\nالمصدر: تصريح ف. هيل، المدير.\nالتحقق من شركة الضو: ما تدارش.\nالبلاغ على الغياب: 31/10 مع 09:10، ط. أردن.',
        'السبب: انقطاع في شبكة الحي الشمالي أطفأ البرج عند 23:47.\nالمصدر: إفادة ف. هيل، المدير.\nالتحقق لدى شركة الكهرباء: لم يُجرَ.\nبلاغ الاختفاء: 31/10 الساعة 09:10، ط. أردن.',
        'Cause : panne du réseau du quartier nord, tour coupée à 23 h 47.\nSource : déclaration de V. Hale, directeur.\nVérification auprès du fournisseur : non effectuée.\nSignalement de disparition : 31/10 à 9 h 10, T. Arden.',
        'Cause: north-district grid outage cut the tower at 23:47.\nSource: statement of V. Hale, manager.\nChecked with the power company: not done.\nMissing-person report: 31/10 at 09:10, T. Arden.',
      ),
    },
    hale: {
      kind: 'statement',
      status: 'unverified',
      from: 'police',
      title: L('تصريح فيكتور هيل', 'إفادة فيكتور هيل', 'Déclaration de Victor Hale', 'Victor Hale’s statement'),
      body: L(
        '«بقيت فالستوديو الليل كامل. مع 23:47 البرج طفا. ما خرجتش من الإذاعة حتى لصباح.»',
        '«بقيت في الاستوديو طوال الليل. عند 23:47 انقطعت الكهرباء عن البرج. لم أغادر المحطة حتى الصباح.»',
        '« Je suis resté au studio toute la nuit. À 23 h 47, la tour a perdu le courant. Je n’ai pas quitté la station avant le matin. »',
        '“I was in the studio all night. At 23:47 the tower lost power. I never left the station until morning.”',
      ),
    },
    access: {
      kind: 'record',
      status: 'verified',
      from: 'police',
      title: L('سجل الدخول للبرج', 'سجلّ دخول البرج', 'Registre d’accès de la tour', 'Tower access log'),
      body: L(
        'باب البرج — كارط الدخول\n23:41  دخول — كارط 02 (ف. هيل)\n23:55  دخول — كارط 05 (م. فال، كارط صحافة مؤقت)\n00:04  خروج — كارط 05',
        'بوابة البرج — بطاقات الدخول\n23:41  دخول — بطاقة 02 (ف. هيل)\n23:55  دخول — بطاقة 05 (م. فال، بطاقة صحافة مؤقتة)\n00:04  خروج — بطاقة 05',
        'Portail de la tour — badges\n23:41  entrée — badge 02 (V. Hale)\n23:55  entrée — badge 05 (M. Vale, badge presse temporaire)\n00:04  sortie — badge 05',
        'Tower gate — card readers\n23:41  in — card 02 (V. Hale)\n23:55  in — card 05 (M. Vale, temporary press card)\n00:04  out — card 05',
      ),
    },
    draft: {
      kind: 'document',
      status: 'verified',
      from: 'newspaper',
      title: L('مسودّة ميرا', 'مسوّدة ميرا', 'Brouillon de Mira', 'Mira’s draft'),
      body: L(
        '«تخلّصو على والو» — مسودّة\nالإذاعة خلصات تلاتة ديال الفاتورات على صيانة المولّد ديال البرج. كلهم مسنيين ف. هيل.\nغادي نقول كلشي فالهوا، «ليالي الخط»، 30/10 مع 23:30.',
        '«دُفع ثمنها مقابل لا شيء» — مسوّدة\nدفعت المحطة ثلاث فواتير لصيانة مولّد البرج، وكلّها موقّعة من ف. هيل.\nسأكشف كل شيء على الهواء، «خطوط الليل»، 30/10 الساعة 23:30.',
        '« Payées pour rien » — brouillon\nLa station a réglé trois factures d’entretien du générateur de la tour, toutes signées V. Hale.\nJe le dirai à l’antenne, « Lignes de nuit », 30/10 à 23 h 30.',
        '“Paid for Nothing” — draft\nThe station paid three invoices for servicing the tower generator, all signed V. Hale.\nI’ll say it on air, “Night Lines”, 30/10 at 23:30.',
      ),
    },
    invoices: {
      kind: 'document',
      status: 'verified',
      from: 'newspaper',
      title: L('نسخ الفاتورات', 'نُسخ الفواتير', 'Copies des factures', 'Invoice copies'),
      body: L(
        'فاتورة 114 — «صيانة المولّد» — تخلصات — مسنية ف.هـ.\nفاتورة 131 — «صيانة المولّد» — تخلصات — مسنية ف.هـ.\nفاتورة 147 — «صيانة المولّد» — تخلصات — مسنية ف.هـ.',
        'فاتورة 114 — «صيانة المولّد» — مدفوعة — توقيع ف.هـ.\nفاتورة 131 — «صيانة المولّد» — مدفوعة — توقيع ف.هـ.\nفاتورة 147 — «صيانة المولّد» — مدفوعة — توقيع ف.هـ.',
        'Facture 114 — « Entretien générateur » — payée — signée V.H.\nFacture 131 — « Entretien générateur » — payée — signée V.H.\nFacture 147 — « Entretien générateur » — payée — signée V.H.',
        'Invoice 114 — “Generator service” — paid — signed V.H.\nInvoice 131 — “Generator service” — paid — signed V.H.\nInvoice 147 — “Generator service” — paid — signed V.H.',
      ),
    },
    freezer: {
      kind: 'record',
      status: 'verified',
      from: 'market',
      title: L('سجل حرارة الفريگو', 'سجلّ حرارة المجمّد', 'Relevé du congélateur', 'Freezer temperature log'),
      body: L(
        'خط الضو: الحي الشمالي\n22:00 → 06:00 — −18° ثابتة\nتقطيع الضو: ما تسجّل حتى واحد.',
        'خطّ التغذية: الحي الشمالي\n22:00 ← 06:00 — ‎−18°‎ ثابتة\nانقطاعات الكهرباء: لم يُسجَّل أيّ انقطاع.',
        'Ligne : quartier nord\n22 h 00 → 6 h 00 — −18 °C stable\nCoupures de courant : aucune enregistrée.',
        'Supply line: north district\n22:00 → 06:00 — steady −18 °C\nPower interruptions: none recorded.',
      ),
    },
    cashier: {
      kind: 'statement',
      status: 'unverified',
      from: 'market',
      title: L('شهادة نادية', 'شهادة نادية', 'Témoignage de Nadia', 'Nadia’s statement'),
      body: L(
        '«ميرا جات تقريبا مع الطناش وعشرين ديال الليل. شرات البيلات وورقة ديال أوقات الكيران. كانت هادئة، غير زربانة.\nالراديو ديالي سكت قبل الطناش، ومن بعد هضر شوية مع 23:58.»',
        '«جاءت ميرا قرابة منتصف الليل وعشرين دقيقة. اشترت بطاريات وجدول مواعيد الحافلات. كانت هادئة لكنها مستعجلة.\nسكت المذياع عندي قبل منتصف الليل، ثم تكلّم لحظة عند 23:58.»',
        '« Mira est passée vers minuit vingt. Des piles et un horaire de bus. Calme, mais pressée.\nMa radio s’est tue avant minuit, puis a parlé un instant vers 23 h 58. »',
        '“Mira came in about twenty past midnight. Batteries and a bus timetable. Calm, but in a hurry.\nMy radio went quiet before midnight, then spoke for a moment around 23:58.”',
      ),
    },
    receipt: {
      kind: 'record',
      status: 'verified',
      from: 'market',
      title: L('بون ديال الكاشة', 'إيصال الصندوق', 'Ticket de caisse', 'Till receipt'),
      body: L(
        '31/10 — 00:21\nبيلات ×4\nأوقات الكيران\nكارط الوفاء: م. فال',
        '31/10 — 00:21\nبطاريات ×4\nجدول مواعيد الحافلات\nبطاقة الوفاء: م. فال',
        '31/10 — 00 h 21\nPiles ×4\nHoraires de bus\nCarte fidélité : M. VALE',
        '31/10 — 00:21\nBatteries ×4\nBus timetable\nLoyalty card: M. VALE',
      ),
    },
    packed: {
      kind: 'object',
      status: 'verified',
      from: 'apartment',
      title: L('خزانة خاوية', 'خزانة فارغة', 'Armoire vidée', 'Emptied wardrobe'),
      body: L(
        'الشانطة ديال السفر ما كايناش، الجّاكيط الدافي حتى هو، والمجر ديال الباسبور خاوي. هادشي ما شي سرقة: كلشي مرتّب.',
        'حقيبة السفر غائبة، والمعطف الدافئ كذلك، ودرج جواز السفر فارغ. ليست سرقة: كلّ شيء مرتّب.',
        'Le sac de voyage a disparu, le manteau chaud aussi, le tiroir du passeport est vide. Pas un cambriolage : tout est rangé.',
        'The travel bag is gone, so is the warm coat, and the passport drawer is empty. Not a burglary: everything is tidy.',
      ),
    },
    breaker: {
      kind: 'record',
      status: 'verified',
      from: 'mroom',
      title: L('مسجّل لوحة القواطع', 'مسجّل لوحة القواطع', 'Enregistreur du tableau', 'Breaker panel recorder'),
      body: L(
        'TX-1 الرئيسي\n23:47:12  تطفى باليد\n23:57:50  تشعل باليد\nالضو ديال الشبكة: كاين طول الوقت',
        'TX-1 الرئيسي\n23:47:12  إطفاء يدوي\n23:57:50  تشغيل يدوي\nتغذية الشبكة: متوفرة طوال الوقت',
        'TX-1 PRINCIPAL\n23:47:12  coupé à la main\n23:57:50  rétabli à la main\nAlimentation réseau : présente en continu',
        'TX-1 MAIN\n23:47:12  switched OFF by hand\n23:57:50  switched ON by hand\nMains supply: present throughout',
      ),
    },
    servicebook: {
      kind: 'record',
      status: 'verified',
      from: 'mroom',
      title: L('كناش صيانة المولّد', 'دفتر صيانة المولّد', 'Carnet d’entretien du générateur', 'Generator service book'),
      body: L(
        'آخر صيانة: قبل تلت سنين، بإمضاء التقني.\nمن داك الساعة: حتى صفحة ما تكتبات.',
        'آخر صيانة: قبل ثلاث سنوات، بتوقيع الفنّي.\nمنذ ذلك الحين: لا صفحة واحدة مكتوبة.',
        'Dernier entretien : il y a trois ans, signé par le technicien.\nDepuis : pas une seule ligne.',
        'Last service: three years ago, signed by the technician.\nSince then: not a single entry.',
      ),
    },
    envelope: {
      kind: 'document',
      status: 'verified',
      from: 'mroom',
      title: L('ظرف ميرا', 'ظرف ميرا', 'L’enveloppe de Mira', 'Mira’s envelope'),
      body: L(
        'نسخ ديال الفاتورات والكناش ديال الصيانة، ومعاهم ورقة:\n«إلا كنتي كتقرا هادي، راني بخير. هيل عرف بلي عرفت. غادي نبعد على هولومير حتى يتنشر هادشي. — م.»',
        'نُسخ من الفواتير ودفتر الصيانة، ومعها ورقة:\n«إن كنت تقرأ هذا فأنا بخير. هيل يعلم أنني أعلم. سأبتعد عن هولومير حتى يُنشر هذا. — م.»',
        'Des copies des factures et du carnet, avec un mot :\n« Si tu lis ceci, je vais bien. Hale sait que je sais. Je quitte Hollowmere jusqu’à la publication. — M. »',
        'Copies of the invoices and the service book, with a note:\n“If you’re reading this, I’m safe. Hale knows I know. I’m leaving Hollowmere until this is printed. — M.”',
      ),
    },
    timeline: {
      kind: 'inference',
      status: 'verified',
      from: 'station',
      title: L('الليلة كيفما ترتّبات', 'تسلسل الليلة', 'La nuit reconstituée', 'The night, reconstructed'),
      body: L(
        '23:41 هيل دخل للبرج → 23:47 الموجة تقطعات → 23:55 ميرا دخلات للبرج → 23:58 الموجة رجعات → 00:04 ميرا خرجات → 00:21 ميرا فالسوبرمارشي.',
        '23:41 هيل يدخل البرج ← 23:47 انقطاع الموجة ← 23:55 ميرا تدخل البرج ← 23:58 عودة الموجة ← 00:04 ميرا تخرج ← 00:21 ميرا في المتجر.',
        '23 h 41 Hale entre dans la tour → 23 h 47 porteuse coupée → 23 h 55 Mira entre → 23 h 58 porteuse rétablie → 0 h 04 Mira sort → 0 h 21 Mira au supermarché.',
        '23:41 Hale enters the tower → 23:47 carrier cut → 23:55 Mira enters → 23:58 carrier back → 00:04 Mira leaves → 00:21 Mira at the supermarket.',
      ),
    },
    codehint: {
      kind: 'document',
      status: 'verified',
      from: 'apartment',
      title: L('صفحة من الكناش', 'صفحة من الدفتر', 'Page du carnet', 'Notebook page'),
      body: L(
        '«التقني ضحك: الرقم ديال بيت الصيانة باقي هو العام اللي مكتوب فاللوحة. حتى واحد ما بدّلو.»\nوتحت: «إلا قطعوني — الخزانة 7.»',
        '«ضحك الفنّي: رمز غرفة الصيانة ما يزال السنة المكتوبة على اللوحة. لم يغيّره أحد.»\nوتحتها: «إن قطعوا البثّ — الخزانة 7.»',
        '« Le technicien a ri : le code de la salle est toujours l’année gravée sur la plaque. Personne ne l’a changé. »\nEn dessous : « S’ils me coupent — casier 7. »',
        '“The technician laughed: the maintenance-room code is still the year on the plaque. Nobody ever changed it.”\nBelow: “If they cut me off — locker 7.”',
      ),
    },
    photo1962: {
      kind: 'photo',
      status: 'verified',
      from: 'station',
      optional: true,
      title: L('تصويرة 1962', 'صورة 1962', 'Photo de 1962', 'Photograph, 1962'),
      body: L(
        'الخدامة ديال البرج نهار تفتح. فالجنب، على الدروج: قطة كحلة، وعلى جبهتها علامة رقيقة بحال الهلال.',
        'عمّال البرج يوم افتتاحه. وعلى الدرج جانبًا: قطة سوداء على جبينها علامة رفيعة كالهلال.',
        'L’équipe de la tour le jour de l’inauguration. Sur une marche, à l’écart : une chatte noire, un fin croissant pâle sur le front.',
        'The tower crew on opening day. On a step to one side: a black cat with a thin pale crescent on her brow.',
      ),
    },
    thermos: {
      kind: 'object',
      status: 'verified',
      from: 'mroom',
      optional: true,
      title: L('ترموس «ف.هـ.»', 'ترمس «ف.هـ.»', 'Thermos « V.H. »', 'Thermos marked “V.H.”'),
      body: L(
        'ترموس عليه الحروف ف.هـ. أتاي اللي فيه برد من شحال هادي.',
        'ترمس عليه الحرفان ف.هـ. الشاي في داخله بارد منذ وقت طويل.',
        'Un thermos marqué V.H. Le thé à l’intérieur est froid depuis longtemps.',
        'A thermos marked V.H. The tea inside went cold a long time ago.',
      ),
    },
  },

  // ─────────────────────────────── Interactive objects
  objects: [
    // Station
    {
      id: 'st_console', loc: 'station', prop: 'console', at: [50, 64, 34],
      name: L('الطابلة ديال البث', 'طاولة البثّ', 'Console d’antenne', 'Broadcast console'),
      text: L(
        'كاين مراقب أوتوماتيكي كيكتب فالسجل كل مرة كتبدّل الموجة. ما كيعرفش يكذب.',
        'مراقب آلي يدوّن في السجل كلّما تغيّرت الموجة. لا يعرف الكذب.',
        'Un moniteur automatique note dans le journal chaque changement de porteuse. Il ne sait pas mentir.',
        'An automatic monitor writes to the log every time the carrier changes. It doesn’t know how to lie.',
      ),
    },
    {
      id: 'st_log', loc: 'station', prop: 'logbook', at: [22, 70, 14], gives: { clues: ['log'] }, doc: 'log',
      name: L('سجل البث', 'سجلّ البثّ', 'Journal d’antenne', 'Broadcast log'),
      text: L('السجل مفتوح على ليلة 30.', 'السجل مفتوح على ليلة الثلاثين.', 'Le journal est ouvert à la nuit du 30.', 'The log lies open at the night of the 30th.'),
    },
    {
      id: 'st_tape', loc: 'station', prop: 'reel', at: [78, 60, 16], gives: { clues: ['tape'] }, doc: 'tape',
      name: L('آلة التسجيل', 'جهاز التسجيل', 'Magnétophone', 'Tape recorder'),
      text: L('البكرة باقا فيها. شي واحد نسى يحيّدها.', 'البكرة ما تزال في مكانها. نسي أحدهم إزالتها.', 'La bobine est encore en place. Quelqu’un a oublié de la retirer.', 'The reel is still threaded. Someone forgot to take it.'),
    },
    {
      id: 'st_board', loc: 'station', prop: 'board', at: [64, 28, 18],
      name: L('لوحة الخدامة', 'لوحة الموظفين', 'Tableau du personnel', 'Staff noticeboard'),
      text: L(
        'جدول ليلة 30: «ف. هيل، المدير — فالمحطة من 22:00 حتى 02:00.» مكتوب بخطّو.',
        'جدول ليلة 30: «ف. هيل، المدير — في المحطة من 22:00 إلى 02:00.» بخطّه هو.',
        'Planning du 30 : « V. Hale, directeur — à la station de 22 h à 2 h. » De sa propre main.',
        'Roster for the 30th: “V. Hale, manager — at the station 22:00 to 02:00.” In his own hand.',
      ),
    },
    {
      id: 'st_whiteboard', loc: 'station', prop: 'whiteboard', at: [34, 30, 20], puzzle: 'p_timeline',
      name: L('السبورة ديال الستوديو', 'سبّورة الاستوديو', 'Tableau blanc du studio', 'Studio whiteboard'),
      text: [
        { text: L('سبورة خاوية. مزيانة باش ترتّب عليها الليلة.', 'سبّورة فارغة. مناسبة لإعادة ترتيب الليلة.', 'Un tableau vide. Idéal pour reconstituer la nuit.', 'A blank whiteboard. Good for rebuilding the night.') },
        { if: { puzzle: 'p_timeline' }, text: L('الليلة مكتوبة دابا بالترتيب. حتى ساعة ما بقات بوحدها.', 'الليلة مكتوبة الآن بالترتيب. لم تعد أيّ ساعة وحيدة.', 'La nuit y est écrite dans l’ordre. Plus aucune heure n’est isolée.', 'The night is written out in order now. No time stands alone any more.') },
      ],
      locked: L(
        'باقي ما عندكش الأوقات اللي كافيين: خاصك على الأقل سجل الإذاعة، سجل الدخول ديال البرج، وشي حاجة من بعد نص الليل.',
        'لا تملك أوقاتًا كافية بعد: تحتاج على الأقل سجلّ المحطة وسجلّ دخول البرج وشيئًا ممّا بعد منتصف الليل.',
        'Pas assez d’heures : il faut au moins le journal de la station, le registre de la tour et une trace d’après minuit.',
        'Not enough times yet: you need at least the station log, the tower access log and something from after midnight.',
      ),
    },
    {
      id: 'st_photo', loc: 'station', prop: 'frame', at: [86, 30, 9], optional: true, gives: { clues: ['photo1962'] }, doc: 'photo1962',
      name: L('تصويرة قديمة', 'صورة قديمة', 'Vieille photo', 'Old photograph'),
      text: L('مسدودة فالإطار، فوق الباب.', 'في إطار فوق الباب.', 'Encadrée au-dessus de la porte.', 'Framed above the door.'),
    },
    // Police
    {
      id: 'po_report', loc: 'police', prop: 'folder', at: [30, 66, 16], gives: { clues: ['report'] }, doc: 'report',
      name: L('ملف القضية', 'ملف القضية', 'Dossier', 'Case file'),
      text: L('ملف رقيق بزاف على شي حاجة بحال هادي.', 'ملف رقيق جدًا لقضية كهذه.', 'Un dossier bien mince pour une telle affaire.', 'A very thin file for a case like this.'),
    },
    {
      id: 'po_statement', loc: 'police', prop: 'paper', at: [52, 70, 12], gives: { clues: ['hale'] }, doc: 'hale',
      name: L('تصريح مكتوب', 'إفادة مكتوبة', 'Déclaration écrite', 'Typed statement'),
      text: L('مسني بخط واثق.', 'موقّعة بخطّ واثق.', 'Signée d’une main assurée.', 'Signed with a confident hand.'),
    },
    {
      id: 'po_access', loc: 'police', prop: 'printout', at: [72, 64, 14], gives: { clues: ['access'] }, doc: 'access',
      name: L('ورقة ديال الماكينة', 'مطبوعة آلية', 'Listing imprimé', 'Machine printout'),
      text: L('السجل ديال الكارطات ديال البرج. حتى واحد ما قراه.', 'سجل بطاقات البرج. لم يقرأه أحد.', 'Le relevé des badges de la tour. Personne ne l’a lu.', 'The tower’s card-reader printout. Nobody has read it.'),
    },
    {
      id: 'po_benali', loc: 'police', prop: 'officer', at: [84, 52, 14],
      name: L('المفتشة بنعلي', 'المفتشة بنعلي', 'Agente Benali', 'Officer Benali'),
      text: [
        { text: L(
          '«البرج مسدود بأمر. إلا جبتي ليا سبب مقنع باش نشكّ فالتقرير، نحلّو.»',
          '«البرج مغلق بأمر رسمي. إن أتيتني بسبب مقنع للشكّ في التقرير، سأفتحه.»',
          '« La tour est sous scellés. Donnez-moi une vraie raison de douter du rapport et je l’ouvre. »',
          '“The tower is sealed. Give me a real reason to doubt the report and I’ll open it.”',
        ) },
        { if: { puzzle: 'p_outage' }, text: L(
          '«ما كانش تقطيع الضو؟ إذن البرج ما بقاش قضية مسدودة. خود الساروت.»',
          '«لم يكن هناك انقطاع؟ إذن لم يعد البرج قضية مغلقة. خذ المفتاح.»',
          '« Pas de panne ? Alors la tour n’est plus une affaire classée. Prenez la clé. »',
          '“No outage? Then the tower isn’t a closed matter. Take the key.”',
        ) },
      ],
    },
    {
      id: 'po_key', loc: 'police', prop: 'keyhook', at: [92, 30, 7], show: { puzzle: 'p_outage' }, gives: { items: ['gatekey'] },
      name: L('ساروت البرج', 'مفتاح البرج', 'Clé de la tour', 'Tower key'),
      text: [
        { text: L('معلّق فالمسمار، فيه ورقة: «البرج».', 'معلّق على المسمار ببطاقة: «البرج».', 'Accrochée au clou, étiquetée « Tour ».', 'On the hook, tagged “Tower”.') },
        { if: { item: 'gatekey' }, text: L('المسمار خاوي دابا.', 'المسمار فارغ الآن.', 'Le crochet est vide.', 'The hook is empty now.') },
      ],
    },
    {
      id: 'po_map', loc: 'police', prop: 'wallmap', at: [50, 26, 22], puzzle: 'p_outage',
      name: L('خريطة الأحياء', 'خريطة الأحياء', 'Carte des quartiers', 'District map'),
      text: [
        { text: L('الحي الشمالي ملوّن بالأحمر: «تقطيع 23:47». شكون تأكد؟', 'الحي الشمالي ملوّن بالأحمر: «انقطاع 23:47». من تحقّق؟', 'Le quartier nord est hachuré : « panne 23 h 47 ». Qui a vérifié ?', 'The north district is shaded red: “outage 23:47”. Who checked?') },
        { if: { puzzle: 'p_outage' }, text: L('بنعلي شطبات على الأحمر بقلم.', 'شطبت بنعلي على اللون الأحمر بقلم.', 'Benali a barré le rouge au stylo.', 'Benali has struck through the red in pen.') },
      ],
      locked: L(
        'باش تتحدّى هاد الخريطة خاصك التقرير الرسمي وشي سجل مستقل من الحي الشمالي.',
        'لتشكّك في هذه الخريطة تحتاج التقرير الرسمي وسجلًّا مستقلًّا من الحي الشمالي.',
        'Pour contester cette carte, il faut le rapport officiel et un relevé indépendant du quartier nord.',
        'To challenge this map you need the official report and an independent record from the north district.',
      ),
    },
    // Newspaper
    {
      id: 'np_desk', loc: 'newspaper', prop: 'typewriter', at: [36, 66, 18], gives: { clues: ['draft'] }, doc: 'draft',
      name: L('مكتب ميرا', 'مكتب ميرا', 'Bureau de Mira', 'Mira’s desk'),
      text: L('ورقة باقا فالماكينة ديال الكتابة.', 'ورقة ما تزال في الآلة الكاتبة.', 'Une feuille est restée dans la machine.', 'A page is still in the typewriter.'),
    },
    {
      id: 'np_board', loc: 'newspaper', prop: 'board', at: [70, 30, 20], gives: { clues: ['invoices'] }, doc: 'invoices',
      name: L('لوحة الفلين', 'لوحة الفلّين', 'Tableau en liège', 'Corkboard'),
      text: L('تلاتة ديال الأوراق مثبتين بدبابيس حمرين.', 'ثلاث أوراق مثبّتة بدبابيس حمراء.', 'Trois feuilles épinglées en rouge.', 'Three sheets pinned in red.'),
    },
    {
      id: 'np_editor', loc: 'newspaper', prop: 'editor', at: [80, 60, 14], gives: { items: ['aptkey'] }, requires: { clue: 'draft' },
      name: L('المدير طوم أردن', 'رئيس التحرير طوم أردن', 'Le rédacteur, Tom Arden', 'Editor Tom Arden'),
      text: [
        { text: L(
          '«قريتي داكشي اللي كتبات؟ مزيان. هاك الساروت الاحتياطي ديالها. تيقت فيا. غادي نتيق فيك.»',
          '«قرأت ما كتبت؟ حسنًا. هذا مفتاحها الاحتياطي. وثقت بي، وسأثق بك.»',
          '« Vous avez lu son papier ? Bien. Voici son double. Elle me faisait confiance. Je vais vous faire confiance. »',
          '“You’ve read her draft? Good. Here’s her spare key. She trusted me. I’ll trust you.”',
        ) },
      ],
      locked: L(
        '«ما كنعطيش السوارت ديال الصحفيين ديالي لواحد ما قراش حتى الخدمة ديالها.»',
        '«لا أسلّم مفاتيح صحفيّيّ لمن لم يقرأ حتى عملها.»',
        '« Je ne confie pas les clés de mes journalistes à quelqu’un qui n’a même pas lu leur travail. »',
        '“I don’t hand my reporters’ keys to someone who hasn’t even read her work.”',
      ),
    },
    // Market
    {
      id: 'sm_freezer', loc: 'market', prop: 'freezer', at: [24, 62, 22], gives: { clues: ['freezer'] }, doc: 'freezer',
      name: L('الفريگو الكبير', 'المجمّد الكبير', 'Le grand congélateur', 'Chest freezer'),
      text: L('كيسجّل الحرارة وحدو، دقيقة بدقيقة.', 'يسجّل الحرارة تلقائيًا، دقيقة بدقيقة.', 'Il enregistre sa température tout seul, minute par minute.', 'It logs its own temperature, minute by minute.'),
    },
    {
      id: 'sm_cashier', loc: 'market', prop: 'cashier', at: [70, 52, 14], gives: { clues: ['cashier'] }, doc: 'cashier',
      name: L('نادية، الكاسيرة', 'نادية، أمينة الصندوق', 'Nadia, la caissière', 'Nadia, the cashier'),
      text: L('كتعرف ميرا. الناس كاملين كيعرفو ميرا.', 'تعرف ميرا. الجميع يعرف ميرا.', 'Elle connaît Mira. Tout le monde connaît Mira.', 'She knows Mira. Everyone knows Mira.'),
    },
    {
      id: 'sm_receipt', loc: 'market', prop: 'spike', at: [86, 66, 8], gives: { clues: ['receipt'] }, doc: 'receipt',
      name: L('البونات', 'الإيصالات', 'Pique à tickets', 'Receipt spike'),
      text: L('البونات ديال الليل، مغروسين بالترتيب.', 'إيصالات الليل مغروسة بالترتيب.', 'Les tickets de la nuit, empilés dans l’ordre.', 'The night’s receipts, spiked in order.'),
    },
    {
      id: 'sm_radio', loc: 'market', prop: 'radio', at: [58, 40, 10],
      name: L('راديو صغير', 'مذياع صغير', 'Petite radio', 'Little radio'),
      text: L('مضبوط على 98.7. كيوشوش.', 'مضبوط على 98.7. يهمس.', 'Calée sur 98.7. Elle chuchote.', 'Tuned to 98.7. It whispers.'),
    },
    // Apartment
    {
      id: 'ap_notebook', loc: 'apartment', prop: 'notebook', at: [30, 66, 12], gives: { clues: ['codehint'] }, doc: 'codehint',
      name: L('الكناش ديال ميرا', 'دفتر ميرا', 'Carnet de Mira', 'Mira’s notebook'),
      text: L('مفتوح، والقلم فوقو.', 'مفتوح والقلم فوقه.', 'Ouvert, le stylo posé dessus.', 'Open, the pen laid across it.'),
    },
    {
      id: 'ap_cup', loc: 'apartment', prop: 'teacup', at: [56, 68, 9], gives: { items: ['key7'] },
      name: L('كاس أتاي', 'كوب الشاي', 'Verre de thé', 'Tea glass'),
      text: [
        { text: L('تحت الكاس، فالصحن، شي حاجة كتلمع.', 'تحت الكوب، في الصحن، يلمع شيء ما.', 'Sous le verre, dans la soucoupe, quelque chose brille.', 'Under the glass, in the saucer, something glints.') },
        { if: { item: 'key7' }, text: L('غير أتاي بارد دابا.', 'شاي بارد فقط الآن.', 'Plus que du thé froid.', 'Just cold tea now.') },
      ],
    },
    {
      id: 'ap_wardrobe', loc: 'apartment', prop: 'wardrobe', at: [80, 50, 18], gives: { clues: ['packed'] }, doc: 'packed',
      name: L('الخزانة', 'الخزانة', 'L’armoire', 'Wardrobe'),
      text: L('الباب مفتوح شوية.', 'الباب مفتوح قليلًا.', 'La porte est entrouverte.', 'The door is ajar.'),
    },
    // Tower
    {
      id: 'tw_gate', loc: 'tower', prop: 'gate', at: [50, 62, 30],
      name: L('الباب الحديدي', 'البوابة الحديدية', 'Le portail', 'Iron gate'),
      text: [
        { text: L('سلسلة وختم ديال البوليس.', 'سلسلة وختم الشرطة.', 'Une chaîne et un scellé de police.', 'A chain and a police seal.') },
        { if: { flag: 'gate_open' }, text: L('الباب محلول. الريح كتدخل قبلك.', 'البوابة مفتوحة. الريح تسبقك إلى الداخل.', 'Le portail est ouvert. Le vent entre avant vous.', 'The gate is open. The wind goes in ahead of you.') },
      ],
      accepts: [
        {
          item: 'gatekey', flag: 'gate_open', consume: true,
          text: L('السلسلة طاحت. الباب تحلّ.', 'سقطت السلسلة. انفتحت البوابة.', 'La chaîne tombe. Le portail s’ouvre.', 'The chain drops. The gate swings open.'),
        },
      ],
    },
    {
      id: 'tw_plaque', loc: 'tower', prop: 'plaque', at: [20, 46, 12],
      name: L('اللوحة النحاسية', 'اللوحة النحاسية', 'Plaque en laiton', 'Brass plaque'),
      text: L('«برج هولومير للإذاعة — تبنى 1962.»', '«برج إذاعة هولومير — شُيّد سنة 1962.»', '« Tour de Radio Hollowmere — érigée en 1962. »', '“Hollowmere Radio Tower — erected 1962.”'),
    },
    {
      id: 'tw_keypad', loc: 'tower', prop: 'keypad', at: [76, 52, 10], show: { flag: 'gate_open' }, puzzle: 'p_code',
      name: L('قفل بالأرقام', 'لوحة أرقام', 'Digicode', 'Keypad'),
      text: [
        { text: L('أربعة ديال الأرقام. الباب ديال بيت الصيانة.', 'أربعة أرقام. باب غرفة الصيانة.', 'Quatre chiffres. La porte de la salle de maintenance.', 'Four digits. The maintenance-room door.') },
        { if: { puzzle: 'p_code' }, text: L('الضو خضر. الباب محلول.', 'الضوء أخضر. الباب مفتوح.', 'Voyant vert. La porte est ouverte.', 'Green light. The door is open.') },
      ],
      locked: L('ما تخمّنش. شي واحد أكيد كتب هاد الرقم فشي بلاصة.', 'لا تخمّن. لا بدّ أن أحدهم دوّن هذا الرمز في مكان ما.', 'Ne devinez pas. Quelqu’un a forcément noté ce code quelque part.', 'Don’t guess. Someone must have written this code down somewhere.'),
    },
    {
      id: 'tw_mud', loc: 'tower', prop: 'puddle', at: [36, 82, 18], show: { flag: 'gate_open' },
      name: L('التراب المبلول', 'الوحل', 'La boue', 'Mud by the door'),
      text: L(
        'جوج ديال الآثار: صبابط ديال الخدمة تقال، وآثار صغار جاو ومشاو بزربة.',
        'أثران: حذاء عمل ثقيل، وآثار أصغر جاءت وذهبت على عجل.',
        'Deux traces : de lourdes chaussures de travail, et de plus petites, venues et reparties en hâte.',
        'Two sets of prints: heavy work boots, and smaller ones that came and left in a hurry.',
      ),
    },
    // Maintenance room
    {
      id: 'mr_breaker', loc: 'mroom', prop: 'breaker', at: [26, 46, 18], gives: { clues: ['breaker'] }, doc: 'breaker',
      name: L('لوحة القواطع', 'لوحة القواطع', 'Tableau des disjoncteurs', 'Breaker panel'),
      text: L('فيه مسجّل صغير كيطبع كل حركة.', 'فيه مسجّل صغير يطبع كلّ حركة.', 'Un petit enregistreur imprime chaque manœuvre.', 'A small recorder prints every switch.'),
    },
    {
      id: 'mr_book', loc: 'mroom', prop: 'logbook', at: [52, 70, 14], gives: { clues: ['servicebook'] }, doc: 'servicebook',
      name: L('كناش الصيانة', 'دفتر الصيانة', 'Carnet d’entretien', 'Service book'),
      text: L('عليه الغبرة. بزاف ديال الغبرة.', 'عليه غبار. كثير من الغبار.', 'Couvert de poussière. Beaucoup de poussière.', 'Dusty. Very dusty.'),
    },
    {
      id: 'mr_lockers', loc: 'mroom', prop: 'lockers', at: [78, 48, 22],
      name: L('الخزانات المرقّمة', 'الخزائن المرقّمة', 'Casiers numérotés', 'Numbered lockers'),
      text: [
        { text: L('من 1 حتى 8. الخزانة 7 مقفولة بقفل صغير.', 'من 1 إلى 8. الخزانة 7 مقفلة بقفل صغير.', 'De 1 à 8. Le casier 7 a un petit cadenas.', 'Numbered 1 to 8. Locker 7 has a small padlock.') },
        { if: { clue: 'envelope' }, text: L('الخزانة 7 محلولة وخاوية.', 'الخزانة 7 مفتوحة وفارغة.', 'Le casier 7 est ouvert et vide.', 'Locker 7 stands open and empty.') },
      ],
      accepts: [
        {
          item: 'key7', consume: true, gives: { clues: ['envelope'] },
          text: L('القفل تحلّ. لداخل: ظرف سميك.', 'انفتح القفل. في الداخل ظرف سميك.', 'Le cadenas cède. Dedans : une épaisse enveloppe.', 'The padlock opens. Inside: a thick envelope.'),
        },
      ],
    },
    {
      id: 'mr_thermos', loc: 'mroom', prop: 'thermos', at: [56, 40, 7], optional: true, gives: { clues: ['thermos'] }, doc: 'thermos',
      name: L('ترموس', 'ترمس', 'Thermos', 'Thermos'),
      text: L('فوق المولّد.', 'فوق المولّد.', 'Posé sur le générateur.', 'Sitting on the generator.'),
    },
  ],

  // ─────────────────────────────── Puzzles
  puzzles: {
    p_timeline: {
      type: 'order',
      requires: { all: [{ clue: 'log' }, { clue: 'access' }, { clue: 'receipt' }] },
      title: L('رتّب الليلة', 'أعِد ترتيب الليلة', 'Reconstituer la nuit', 'Rebuild the night'),
      prompt: L(
        'حطّ هاد الأحداث بالترتيب ديال الوقت، باستعمال الأوقات اللي لقيتي فالسجلات.',
        'رتّب هذه الأحداث زمنيًا مستعينًا بالأوقات الواردة في السجلات.',
        'Classez ces événements dans l’ordre, d’après les heures relevées dans les archives.',
        'Put these events in order, using the times found in the records.',
      ),
      items: {
        hale_in: L('هيل دخل للبرج', 'هيل يدخل البرج', 'Hale entre dans la tour', 'Hale enters the tower'),
        cut: L('الموجة تقطعات', 'انقطاع الموجة', 'La porteuse est coupée', 'The carrier is cut'),
        mira_in: L('ميرا دخلات للبرج', 'ميرا تدخل البرج', 'Mira entre dans la tour', 'Mira enters the tower'),
        back: L('الموجة رجعات 40 ثانية', 'عودة الموجة 40 ثانية', 'La porteuse revient 40 s', 'The carrier returns for 40 s'),
        mira_out: L('ميرا خرجات من البرج', 'ميرا تغادر البرج', 'Mira quitte la tour', 'Mira leaves the tower'),
        shop: L('ميرا فالسوبرمارشي', 'ميرا في المتجر', 'Mira au supermarché', 'Mira at the supermarket'),
      },
      shuffled: ['back', 'shop', 'hale_in', 'mira_out', 'cut', 'mira_in'],
      answer: ['hale_in', 'cut', 'mira_in', 'back', 'mira_out', 'shop'],
      wrong: L(
        'شي أحداث ما فبلاصتهمش. رجع للأوقات المكتوبة فالسجلات.',
        'بعض الأحداث في غير موضعها. عُد إلى الأوقات المدوّنة في السجلات.',
        'Certains événements ne sont pas à leur place. Revenez aux heures notées.',
        'Some events are out of place. Go back to the times in the records.',
      ),
      success: L(
        'الليلة ولات واضحة: هيل كان فالبرج قبل ما تتقطع الموجة.',
        'اتّضحت الليلة: كان هيل في البرج قبل انقطاع الموجة.',
        'La nuit s’éclaire : Hale était à la tour avant la coupure.',
        'The night comes clear: Hale was at the tower before the carrier was cut.',
      ),
      gives: { clues: ['timeline'] },
      hints: [
        L('كل سجل فيه أوقات. ما تتّكلش على الذاكرة ديال الناس، تّكل على الماكينات.', 'كلّ سجلّ يحمل أوقاتًا. لا تعتمد على ذاكرة الناس، بل على الآلات.', 'Chaque relevé porte des heures. Fiez-vous aux machines, pas aux souvenirs.', 'Every record carries times. Trust the machines, not people’s memories.'),
        L('سجل الكارطات فيه تلاتة ديال الأوقات، والسجل ديال الإذاعة فيه جوج. البون كيكمّل الليلة.', 'في سجلّ البطاقات ثلاثة أوقات، وفي سجلّ البثّ وقتان، والإيصال يكمل الليلة.', 'Le registre des badges donne trois heures, le journal d’antenne deux ; le ticket termine la nuit.', 'The access log gives three times, the broadcast log two; the receipt finishes the night.'),
        L('23:41 جا قبل 23:47، و23:55 قبل 23:58. البون ديال 00:21 هو اللخر.', 'يأتي 23:41 قبل 23:47، و23:55 قبل 23:58. وإيصال 00:21 هو الأخير.', '23 h 41 précède 23 h 47, et 23 h 55 précède 23 h 58. Le ticket de 0 h 21 ferme la marche.', '23:41 comes before 23:47, and 23:55 before 23:58. The 00:21 receipt comes last.'),
      ],
    },
    p_outage: {
      type: 'choice',
      requires: { all: [{ clue: 'report' }, { clue: 'freezer' }] },
      title: L('واش كان تقطيع الضو؟', 'هل انقطعت الكهرباء؟', 'Y a-t-il eu une panne ?', 'Was there an outage?'),
      prompt: L(
        'أشمن سجل كيبيّن بلي الحي الشمالي ما تقطعش عليه الضو داك الليلة؟',
        'أيّ سجلّ يثبت أن الحي الشمالي لم تنقطع عنه الكهرباء تلك الليلة؟',
        'Quel relevé prouve que le quartier nord n’a jamais perdu le courant cette nuit-là ?',
        'Which record proves the north district never lost power that night?',
      ),
      options: [
        { id: 'freezer', text: L('سجل حرارة الفريگو', 'سجلّ حرارة المجمّد', 'Le relevé du congélateur', 'The freezer temperature log') },
        { id: 'report', text: L('التقرير الرسمي', 'التقرير الرسمي', 'Le rapport officiel', 'The official report'), why: L('هادا هو الادعاء اللي كتحاول تختبر، ماشي الدليل.', 'هذا هو الادعاء الذي تختبره، لا الدليل.', 'C’est l’affirmation que vous testez, pas la preuve.', 'That’s the claim you’re testing, not the proof.') },
        { id: 'hale', text: L('تصريح هيل', 'إفادة هيل', 'La déclaration de Hale', 'Hale’s statement'), why: L('كلام هيل هو مصدر حكاية تقطيع الضو.', 'كلام هيل هو مصدر رواية الانقطاع.', 'Hale est justement la source de la panne.', 'Hale is the source of the outage story.') },
        { id: 'draft', text: L('مسودّة ميرا', 'مسوّدة ميرا', 'Le brouillon de Mira', 'Mira’s draft'), why: L('المسودة كتشرح علاش، ماشي واش كان الضو.', 'المسوّدة تشرح السبب، لا وجود الكهرباء.', 'Le brouillon explique un mobile, pas l’état du réseau.', 'The draft explains a motive, not the state of the grid.') },
      ],
      answer: 'freezer',
      wrong: L('هاد الوثيقة ما كتقولش شي حاجة على الضو ديال الحي.', 'هذه الوثيقة لا تقول شيئًا عن كهرباء الحي.', 'Ce document ne dit rien du courant dans le quartier.', 'That document says nothing about the district’s power.'),
      success: L(
        'الفريگو بقى بارد الليل كامل. ما كانش تقطيع. بنعلي غادي تبغي تسمع هادشي.',
        'بقي المجمّد باردًا طوال الليل. لم يكن هناك انقطاع. ستودّ بنعلي سماع هذا.',
        'Le congélateur est resté froid toute la nuit. Aucune panne. Benali voudra l’entendre.',
        'The freezer stayed cold all night. There was no outage. Benali will want to hear this.',
      ),
      hints: [
        L('تقطيع الضو كيخلّي أثر فكل ماكينة مربوطة بالشبكة، ماشي غير فالبرج.', 'انقطاع الكهرباء يترك أثرًا في كلّ آلة على الشبكة، لا في البرج وحده.', 'Une panne laisse des traces dans chaque appareil branché, pas seulement à la tour.', 'An outage leaves a trace in every machine on the grid, not just the tower.'),
        L('شوف شكون فالحي الشمالي كيسجّل حاجة بلا ما يتدخّل حد.', 'ابحث عمّا في الحي الشمالي يسجّل شيئًا دون تدخّل بشري.', 'Cherchez ce qui, dans le quartier nord, enregistre sans intervention humaine.', 'Look for something in the north district that records on its own.'),
        L('السوبرمارشي فالحي الشمالي، والفريگو ديالو كيكتب الحرارة دقيقة بدقيقة.', 'المتجر في الحي الشمالي، ومجمّده يدوّن الحرارة دقيقة بدقيقة.', 'Le supermarché est dans le quartier nord, et son congélateur note sa température minute par minute.', 'The supermarket is in the north district, and its freezer logs its temperature minute by minute.'),
      ],
    },
    p_code: {
      type: 'code',
      digits: 4,
      requires: { clue: 'codehint' },
      title: L('قفل بيت الصيانة', 'قفل غرفة الصيانة', 'Digicode de la maintenance', 'Maintenance keypad'),
      prompt: L('دخّل الرقم ديال أربعة ديال الأرقام.', 'أدخل الرمز المكوّن من أربعة أرقام.', 'Entrez le code à quatre chiffres.', 'Enter the four-digit code.'),
      answer: '1962',
      wrong: L('الضو حمر. فكّر فاش كانت ميرا كتقصد.', 'الضوء أحمر. فكّر فيما كانت ميرا تقصده.', 'Voyant rouge. Repensez à ce que Mira voulait dire.', 'Red light. Think about what Mira meant.'),
      success: L('الضو خضر. الباب تحلّ على بيت باردة.', 'الضوء أخضر. انفتح الباب على غرفة باردة.', 'Voyant vert. La porte s’ouvre sur une pièce froide.', 'Green light. The door opens on a cold room.'),
      hints: [
        L('ميرا ما كتبتش الرقم. كتبات فين كاين.', 'لم تكتب ميرا الرمز. كتبت أين يوجد.', 'Mira n’a pas écrit le code. Elle a écrit où il se trouve.', 'Mira didn’t write the code down. She wrote where it is.'),
        L('شي حاجة فالبرج مكتوب عليها عام.', 'شيء في البرج يحمل سنة.', 'Quelque chose à la tour porte une année.', 'Something at the tower carries a year.'),
        L('اللوحة النحاسية حدا الباب كتقول إمتى تبنى البرج.', 'اللوحة النحاسية قرب البوابة تذكر سنة بناء البرج.', 'La plaque en laiton près du portail donne l’année de construction.', 'The brass plaque by the gate gives the year the tower was built.'),
      ],
    },
  },

  // ─────────────────────────────── Deduction board
  deductions: [
    {
      id: 'd_manual', pair: ['log', 'breaker'], essential: true,
      text: L('الموجة تطفات وتشعلات باليد. البرج عمرو ما بقى بلا ضو.', 'أُطفئت الموجة وأعيدت يدويًا. لم يفقد البرج الكهرباء قط.', 'La porteuse a été coupée et rétablie à la main. La tour n’a jamais manqué de courant.', 'The carrier was switched off and on by hand. The tower never lost power.'),
    },
    {
      id: 'd_hale', pair: ['hale', 'access'], essential: true,
      text: L('هيل كان فالبرج مع 23:41، ماشي فالستوديو.', 'كان هيل في البرج عند 23:41، لا في الاستوديو.', 'Hale était à la tour à 23 h 41, pas au studio.', 'Hale was at the tower at 23:41, not in the studio.'),
    },
    {
      id: 'd_grid', pair: ['report', 'freezer'], essential: true,
      text: L('تقطيع الضو الرسمي عمرو ما وقع.', 'الانقطاع الرسمي لم يحدث قط.', 'La panne officielle n’a jamais eu lieu.', 'The official outage never happened.'),
    },
    {
      id: 'd_motive', pair: ['invoices', 'servicebook'], essential: true,
      text: L('هيل سنى على صيانة ما تداراتش. هادشي اللي كانت ميرا غادي تقول.', 'وقّع هيل على صيانة لم تُجرَ. هذا ما كانت ميرا ستقوله.', 'Hale a signé pour un entretien jamais fait. C’est ce que Mira allait dire.', 'Hale signed for maintenance that never happened. That’s what Mira was about to say.'),
    },
    {
      id: 'd_safe', pair: ['receipt', 'packed'],
      text: L('ميرا مشات من بعد نص الليل، بخاطرها، ومعاها شانطتها.', 'غادرت ميرا بعد منتصف الليل بإرادتها، ومعها حقيبتها.', 'Mira est partie après minuit, de son plein gré, avec son sac.', 'Mira left after midnight, by choice, with her bag.'),
    },
    {
      id: 'd_locker', pair: ['tape', 'envelope'],
      text: L('الرسالة ديال 23:58 كانت كتوجّه للخزانة 7.', 'رسالة 23:58 كانت تشير إلى الخزانة 7.', 'Le message de 23 h 58 menait au casier 7.', 'The 23:58 message pointed to locker 7.'),
    },
  ],
  contradictions: [
    { id: 'c_grid', pair: ['report', 'freezer'], resolvedBy: 'd_grid' },
    { id: 'c_hale', pair: ['hale', 'access'], resolvedBy: 'd_hale' },
    { id: 'c_carrier', pair: ['log', 'tape'], resolvedBy: 'd_manual' },
  ],

  // ─────────────────────────────── Objectives
  objectives: [
    {
      id: 'o_log', done: { clue: 'log' },
      text: L('شوف شنو سجّلات الإذاعة بنفسها داك الليلة.', 'اعرف ما سجّلته المحطة بنفسها تلك الليلة.', 'Découvrez ce que la station a elle-même enregistré cette nuit-là.', 'Find out what the station itself recorded that night.'),
    },
    {
      id: 'o_times', when: { clue: 'log' }, done: { all: [{ clue: 'access' }, { clue: 'receipt' }] },
      text: L('جمع الأوقات من أكثر من مصدر واحد.', 'اجمع الأوقات من أكثر من مصدر.', 'Recueillez des heures auprès de plusieurs sources.', 'Gather times from more than one source.'),
    },
    {
      id: 'o_timeline', when: { all: [{ clue: 'log' }, { clue: 'access' }, { clue: 'receipt' }] }, done: { puzzle: 'p_timeline' },
      text: L('رتّب الليلة على السبورة ديال الستوديو.', 'أعِد ترتيب الليلة على سبّورة الاستوديو.', 'Reconstituez la nuit sur le tableau du studio.', 'Rebuild the night on the studio whiteboard.'),
    },
    {
      id: 'o_outage', when: { clue: 'report' }, done: { puzzle: 'p_outage' },
      text: L('جرّب الرواية الرسمية: واش بصح تقطع الضو؟', 'اختبر الرواية الرسمية: هل انقطعت الكهرباء فعلًا؟', 'Mettez la version officielle à l’épreuve : y a-t-il vraiment eu une panne ?', 'Test the official story: was there really an outage?'),
    },
    {
      id: 'o_flat', when: { clue: 'draft' }, done: { visited: 'apartment' },
      text: L('شوف فين كانت ميرا عايشة.', 'تفقّد المكان الذي كانت تعيش فيه ميرا.', 'Voyez où vivait Mira.', 'See where Mira lived.'),
    },
    {
      id: 'o_tower', when: { puzzle: 'p_outage' }, done: { puzzle: 'p_code' },
      text: L('دخل للبرج.', 'ادخل البرج.', 'Entrez dans la tour.', 'Get inside the tower.'),
    },
    {
      id: 'o_locker', when: { puzzle: 'p_code' }, done: { clue: 'envelope' },
      text: L('لقى شنو خلّات ميرا — وعلاش.', 'اعثر على ما تركته ميرا، ولماذا.', 'Trouvez ce que Mira a laissé — et pourquoi.', 'Find what Mira left behind — and why.'),
    },
    {
      id: 'o_board', when: { clue: 'breaker' }, done: { all: [{ deduction: 'd_manual' }, { deduction: 'd_hale' }, { deduction: 'd_grid' }, { deduction: 'd_motive' }] },
      text: L('ربط الأدلة فاللوحة ديال الاستنتاج.', 'اربط الأدلة على لوحة الاستنتاج.', 'Reliez les preuves sur le tableau de déduction.', 'Connect the evidence on the deduction board.'),
    },
    {
      id: 'o_final', when: { all: [{ puzzle: 'p_timeline' }, { clue: 'breaker' }] }, done: { flag: '__never__' },
      text: L('قدّم الخلاصة ديالك.', 'قدّم استنتاجك.', 'Présentez votre conclusion.', 'Present your conclusion.'),
    },
  ],

  // ─────────────────────────────── Final deduction
  final: {
    requires: { all: [{ puzzle: 'p_timeline' }, { clue: 'breaker' }] },
    essentialDeductions: ['d_manual', 'd_hale', 'd_grid', 'd_motive'],
    questions: [
      {
        id: 'q_what', type: 'choice', core: true,
        prompt: L('شنو وقع للبث مع 23:47؟', 'ماذا حدث للبثّ عند 23:47؟', 'Qu’est-il arrivé à l’émission à 23 h 47 ?', 'What happened to the broadcast at 23:47?'),
        options: [
          { id: 'grid', text: L('تقطيع الضو فالحي طفا البرج', 'انقطاع في شبكة الحي أطفأ البرج', 'Une panne du quartier a coupé la tour', 'A district outage cut the tower') },
          { id: 'manual', text: L('شي واحد طفا المرسل باليد فالبرج', 'أطفأ أحدهم جهاز الإرسال يدويًا في البرج', 'Quelqu’un a coupé l’émetteur à la main, à la tour', 'Someone switched the transmitter off by hand at the tower') },
          { id: 'generator', text: L('المولّد القديم تخسّر', 'تعطّل المولّد القديم', 'Le vieux générateur a lâché', 'The old generator failed') },
          { id: 'mira', text: L('ميرا قطعات البث ديالها بيدها', 'قطعت ميرا بثّها بنفسها', 'Mira a coupé sa propre émission', 'Mira cut her own broadcast') },
        ],
        answer: 'manual',
      },
      {
        id: 'q_who', type: 'choice', core: true,
        prompt: L('شكون اللي قطع البث؟', 'من قطع البثّ؟', 'Qui a coupé l’émission ?', 'Who cut the broadcast?'),
        options: [
          { id: 'hale', text: L('فيكتور هيل', 'فيكتور هيل', 'Victor Hale', 'Victor Hale') },
          { id: 'mira', text: L('ميرا فال', 'ميرا فال', 'Mira Vale', 'Mira Vale') },
          { id: 'benali', text: L('المفتشة بنعلي', 'المفتشة بنعلي', 'L’agente Benali', 'Officer Benali') },
          { id: 'nobody', text: L('حتى واحد، كانت غير عطلة', 'لا أحد، مجرد عطل', 'Personne, une simple panne', 'Nobody — just a fault') },
        ],
        answer: 'hale',
      },
      {
        id: 'q_order', type: 'order',
        prompt: L('رتّب اللحظات المهمة.', 'رتّب اللحظات الحاسمة.', 'Ordonnez les moments clés.', 'Order the key moments.'),
        items: {
          hale_in: L('هيل دخل للبرج', 'هيل يدخل البرج', 'Hale entre dans la tour', 'Hale enters the tower'),
          cut: L('المرسل تطفى', 'إطفاء جهاز الإرسال', 'L’émetteur est coupé', 'Transmitter switched off'),
          mira_in: L('ميرا دخلات للبرج', 'ميرا تدخل البرج', 'Mira entre dans la tour', 'Mira enters the tower'),
          back: L('ميرا رجعات البث 40 ثانية', 'ميرا تعيد البثّ 40 ثانية', 'Mira rétablit l’antenne 40 s', 'Mira restores the signal for 40 s'),
          shop: L('ميرا فالسوبرمارشي', 'ميرا في المتجر', 'Mira au supermarché', 'Mira at the supermarket'),
        },
        shuffled: ['mira_in', 'shop', 'cut', 'back', 'hale_in'],
        answer: ['hale_in', 'cut', 'mira_in', 'back', 'shop'],
      },
      {
        id: 'q_contra', type: 'choice',
        prompt: L('أشمن ادعاء رسمي كتكذّبو الأدلة؟', 'أيّ ادعاء رسمي تدحضه الأدلة؟', 'Quelle affirmation officielle les preuves contredisent-elles ?', 'Which official claim does the evidence contradict?'),
        options: [
          { id: 'outage', text: L('«تقطيع الضو فالحي الشمالي»', '«انقطاع الشبكة في الحي الشمالي»', '« Une panne dans le quartier nord »', '“A north-district grid outage”') },
          { id: 'onair', text: L('«ميرا كانت فالهوا مع 23:30»', '«كانت ميرا على الهواء عند 23:30»', '« Mira était à l’antenne à 23 h 30 »', '“Mira was on air at 23:30”') },
          { id: 'duty', text: L('«هيل كان خدام داك الليلة»', '«كان هيل في الخدمة تلك الليلة»', '« Hale était de service cette nuit-là »', '“Hale was on duty that night”') },
        ],
        answer: 'outage',
      },
      {
        id: 'q_evidence', type: 'evidence',
        prompt: L('ختار الأدلة اللي كتسند الخلاصة ديالك.', 'اختر الأدلة التي تسند استنتاجك.', 'Choisissez les preuves qui soutiennent votre conclusion.', 'Choose the evidence that supports your conclusion.'),
        required: ['breaker', 'access', 'freezer', 'invoices'],
      },
      {
        id: 'q_open', type: 'choice',
        prompt: L('شنو اللي باقي ما متأكدينش منو؟', 'ما الذي يبقى غير مؤكَّد؟', 'Qu’est-ce qui reste incertain ?', 'What remains uncertain?'),
        options: [
          { id: 'where', text: L('فين كاينة ميرا دابا', 'أين توجد ميرا الآن', 'Où se trouve Mira aujourd’hui', 'Where Mira is now') },
          { id: 'deliberate', text: L('واش البث تقطع بالعاني', 'هل قُطع البثّ عمدًا', 'Si la coupure était volontaire', 'Whether the cut was deliberate') },
          { id: 'signer', text: L('شكون سنى الفاتورات', 'من وقّع الفواتير', 'Qui a signé les factures', 'Who signed the invoices') },
        ],
        answer: 'where',
      },
    ],
    hints: [
      L('ماشي «شكون» قبل «كيفاش». بدا بالماكينات اللي سجّلات الليلة.', 'ليس «من» قبل «كيف». ابدأ بالآلات التي سجّلت الليلة.', 'Pas « qui » avant « comment ». Commencez par les machines qui ont enregistré la nuit.', 'Not “who” before “how”. Start with the machines that recorded the night.'),
      L('لوحة القواطع ولوحة الكارطات كيقولو بجوج شنو وقع ومن كان تما.', 'لوحة القواطع وسجلّ البطاقات يقولان معًا ما حدث ومن كان هناك.', 'Le tableau des disjoncteurs et le registre des badges disent ensemble quoi et qui.', 'The breaker recorder and the access log together say what happened and who was there.'),
      L('اللي طفا باليد مع 23:47:12 هو اللي كان فالبرج من 23:41. والفريگو كيقول بلي الشبكة ما طفاتش.', 'من أطفأ يدويًا عند 23:47:12 هو من كان في البرج منذ 23:41. والمجمّد يؤكّد أن الشبكة لم تنطفئ.', 'Celui qui a coupé à la main à 23:47:12 est celui qui était à la tour depuis 23 h 41. Le congélateur dit que le réseau n’a jamais lâché.', 'Whoever switched off by hand at 23:47:12 was the one at the tower since 23:41. The freezer says the grid never failed.'),
    ],
  },

  // ─────────────────────────────── Endings
  endings: {
    strong: {
      title: L('الموجة كتقول الحقيقة', 'الموجة تقول الحقيقة', 'La porteuse dit vrai', 'The carrier tells the truth'),
      text: L(
        'بنعلي قرات الملف كامل وما قالت حتى كلمة. فالصباح، هيل تعيّط عليه للكوميسارية. الكوريي غادي ينشر «تخلّصو على والو» فالصفحة اللولى، بالإمضاء ديال ميرا.',
        'قرأت بنعلي الملف كاملًا دون أن تنطق بكلمة. في الصباح استُدعي هيل. وستنشر «الكورييه» مقال «دُفع ثمنها مقابل لا شيء» على صفحتها الأولى بتوقيع ميرا.',
        'Benali a lu tout le dossier sans un mot. Au matin, Hale est convoqué. Le Courrier publiera « Payées pour rien » en une, signé Mira Vale.',
        'Benali read the whole file without a word. By morning Hale was called in. The Courier will run “Paid for Nothing” on the front page, under Mira’s name.',
      ),
    },
    partial: {
      title: L('نص الحقيقة', 'نصف الحقيقة', 'Une demi-vérité', 'Half a truth'),
      text: L(
        'عرفتي بلي البث تقطع بالعاني، ولكن الملف ديالك فيه ثقوب. بنعلي غادي تحتاج أكثر باش تواجه هيل.',
        'عرفت أن البثّ قُطع عمدًا، لكن ملفّك فيه ثغرات. ستحتاج بنعلي إلى أكثر من ذلك لمواجهة هيل.',
        'Vous savez que la coupure était volontaire, mais votre dossier a des trous. Benali aura besoin de plus pour confronter Hale.',
        'You know the cut was deliberate, but your file has holes. Benali will need more to confront Hale.',
      ),
    },
    incomplete: {
      title: L('الإشارة ضعيفة', 'الإشارة ضعيفة', 'Signal faible', 'Weak signal'),
      text: L(
        'الخلاصة ما كتمشيش مع الأدلة. رجع للسجلات.',
        'الاستنتاج لا يتّفق مع الأدلة. عُد إلى السجلات.',
        'La conclusion ne tient pas face aux preuves. Retournez aux archives.',
        'The conclusion doesn’t hold against the evidence. Go back to the records.',
      ),
    },
  },
  uncertainty: L(
    'ميرا كتبات بلي هي بخير، ولكن حتى سجل ما كيقول فين مشات. الكار ديال 00:40 خرج من هولومير، والكورسي اللخر خاوي.',
    'كتبت ميرا أنها بخير، لكن لا سجلّ يقول إلى أين ذهبت. غادرت حافلة 00:40 هولومير، والمقعد الأخير شاغر.',
    'Mira écrit qu’elle va bien, mais aucun relevé ne dit où elle est allée. Le bus de 0 h 40 a quitté Hollowmere, dernier siège vide.',
    'Mira wrote that she is safe, but no record says where she went. The 00:40 bus left Hollowmere with its back seat empty.',
  ),
  noctaviae: {
    ending: L(
      'التصويرة ديال 1962؟ خليها عندك. كاين اللي كيتفكّر قبل من السجلات.',
      'صورة 1962؟ احتفظ بها. هناك من يتذكّر قبل السجلات.',
      'La photo de 1962 ? Gardez-la. Certains se souviennent avant les archives.',
      'The 1962 photograph? Keep it. Some of us remember before the records do.',
    ),
  },
  facts: [
    { clue: 'breaker', text: L('المرسل تطفى وتشعل باليد.', 'أُطفئ جهاز الإرسال وأعيد يدويًا.', 'L’émetteur a été coupé puis rétabli à la main.', 'The transmitter was switched off and on by hand.') },
    { clue: 'access', text: L('هيل دخل للبرج مع 23:41.', 'دخل هيل البرج عند 23:41.', 'Hale est entré dans la tour à 23 h 41.', 'Hale entered the tower at 23:41.') },
    { clue: 'freezer', text: L('الحي الشمالي ما تقطعش عليه الضو.', 'لم تنقطع الكهرباء عن الحي الشمالي.', 'Le quartier nord n’a jamais perdu le courant.', 'The north district never lost power.') },
    { clue: 'servicebook', text: L('الصيانة اللي تخلّصات عمرها ما تدارت.', 'الصيانة المدفوعة لم تُجرَ قط.', 'L’entretien payé n’a jamais été fait.', 'The maintenance that was paid for never happened.') },
    { clue: 'receipt', text: L('ميرا كانت حرّة ومزيانة مع 00:21.', 'كانت ميرا حرّة وبخير عند 00:21.', 'Mira était libre et en bonne santé à 0 h 21.', 'Mira was free and well at 00:21.') },
  ],

  // Scripted solution used by the automated tests (a valid, complete playthrough).
  walkthrough: [
    ['interact', 'st_log'], ['interact', 'st_tape'], ['interact', 'st_photo'],
    ['visit', 'police'], ['interact', 'po_report'], ['interact', 'po_statement'], ['interact', 'po_access'],
    ['visit', 'newspaper'], ['interact', 'np_desk'], ['interact', 'np_board'], ['interact', 'np_editor'],
    ['visit', 'market'], ['interact', 'sm_freezer'], ['interact', 'sm_cashier'], ['interact', 'sm_receipt'],
    ['visit', 'station'], ['solve', 'p_timeline', ['hale_in', 'cut', 'mira_in', 'back', 'mira_out', 'shop']],
    ['visit', 'police'], ['solve', 'p_outage', 'freezer'], ['interact', 'po_key'],
    ['visit', 'apartment'], ['interact', 'ap_notebook'], ['interact', 'ap_cup'], ['interact', 'ap_wardrobe'],
    ['visit', 'tower'], ['use', 'gatekey', 'tw_gate'], ['interact', 'tw_plaque'], ['solve', 'p_code', '1962'],
    ['visit', 'mroom'], ['interact', 'mr_breaker'], ['interact', 'mr_book'], ['use', 'key7', 'mr_lockers'], ['interact', 'mr_thermos'],
    ['connect', 'log', 'breaker'], ['connect', 'hale', 'access'], ['connect', 'report', 'freezer'], ['connect', 'invoices', 'servicebook'],
    ['connect', 'receipt', 'packed'], ['connect', 'tape', 'envelope'],
    ['final', { q_what: 'manual', q_who: 'hale', q_order: ['hale_in', 'cut', 'mira_in', 'back', 'shop'], q_contra: 'outage', q_evidence: ['breaker', 'access', 'freezer', 'invoices', 'receipt'], q_open: 'where' }],
  ],
};
