import { L } from '../core/i18n.js';

// ═══════════════════════════════════════════════════════════════════════════
// CASE B — THE HOLLOW HARVEST
// ═══════════════════════════════════════════════════════════════════════════
export const bible = {
  truth:
    'Committee chair Adela Thorn secretly revived the 1987 Lantern Procession, voted out in 1988. On 29 Oct she ' +
    'borrowed the archived timer card and on festival night swapped it into the bell timer. The normal festival card ' +
    'is radio-synced and rings single strokes (20:00, 22:00, 00:00). The 1987 card runs the timer in mechanical mode, ' +
    'reading the tower clock — fast by 17 minutes since the September storm — and rings three strokes at "20:00" and ' +
    '"22:00": 19:43 and 21:43 real time, and no closing bell at midnight. Older residents recognised the three-stroke cue (stop, raise lanterns, face the tower) and ' +
    'visitors copied them: the "synchronised" crowd. Separately and by accident, technician Sami Ouardi had put the ' +
    'festoon lights and the bell motor on the same circuit L2; the motor’s inrush tripped L2 at each strike, causing ' +
    'the blackouts. The "midnight bell" rumour is false. A third strike at 23:13 is on no card and caused no blackout ' +
    '(so it was not the motor); dust on the manual lever shows small paw prints. It is left open.',
  initialBelief: 'Something unnatural is controlling people through the bell.',
  characters: {
    adela: 'Knows she swapped the card; did not foresee the blackouts.',
    sami: 'Knows the wiring compromise; not that the card was swapped.',
    youssef: 'Vendor. Accurate witness of 19:43, but believes in the curse.',
    nadia: 'Open until 00:30; heard no midnight bell.',
    idris: 'Archivist. Knows the procession history and the 1924 legend.',
  },
  verified: ['schedule', 'powerlog', 'procedure', 'ledger', 'timercard', 'config', 'complaints', 'ribbon', 'motor', 'clocknote'],
  claims: ['youssef', 'nadia2'],
  rumors: ['rumor_spirit'],
  chronology: [
    ['Sept', 'Storm; tower clock starts running fast (clocknote)'],
    ['29 Oct', 'Adela borrows the 1987 card (ledger)'],
    ['31 Oct 19:43', 'Bell (card “20:00” tower time) trips L2; lights out; crowd freezes (powerlog, youssef, complaints)'],
    ['31 Oct 21:43', 'Bell (card “22:00”) trips L2 again (powerlog, complaints)'],
    ['31 Oct 23:13', 'Third strike — not on the card, no blackout (complaints, timercard)'],
    ['31 Oct 00:00', 'No bell, no calls (complaints, nadia2)'],
  ],
  theories: {
    haunting: { contradictedBy: ['powerlog', 'config', 'timercard', 'procedure', 'complaints'] },
    tradition: { supportedBy: ['procedure', 'youssef', 'ribbon', 'ledger'] },
  },
  unresolved: 'The 23:13 strike. Not on the card, not the motor. Paw prints on the manual lever.',
};

export default {
  id: 'harvest',
  num: '02',
  motif: 'harvest',
  accent: 'pumpkin',
  bible,
  title: L('الحصاد الخاوي', 'الحصاد الأجوف', 'La Moisson Creuse', 'The Hollow Harvest'),
  teaser: L(
    'الناقوس كيضرب فوقت غلط، الضو كيطفى، والناس كيوقفو بحال إلا شي حد كيحكم فيهم.',
    'الجرس يقرع في غير موعده، والأضواء تنطفئ، والناس يتوقّفون كأن أحدًا يتحكّم بهم.',
    'La cloche sonne à contretemps, les lumières s’éteignent, et la foule se fige comme un seul corps.',
    'The bell rings at the wrong times, the lights die, and the crowd stops as if moved by one hand.',
  ),
  radio: {
    freq: '98.7',
    lines: [
      L('راديو هولومير، ليلة الموسم… إلا كنتو كتسمعوني فوق الناقوس.', 'إذاعة هولومير، ليلة المهرجان… إن كنتم تسمعونني فوق صوت الجرس.', 'Radio Hollowmere, soirée du festival… si vous m’entendez par-dessus la cloche.', 'Radio Hollowmere, festival night… if you can hear me over the bell.'),
      L('فساحة الحصاد، الناقوس ضرب بكري — والضو كامل طفا معاه.', 'في ساحة الحصاد قرع الجرس مبكرًا، وانطفأت معه كلّ الأضواء.', 'Sur la place des moissons, la cloche a sonné trop tôt — et toutes les lampes se sont éteintes avec elle.', 'In the harvest square the bell rang early — and every lamp went out with it.'),
      L('الشهود كيقولو عشرات ديال الناس وقفو فدقة وحدة، الفنارات لفوق، وجوههم للصومعة ديال الساعة.', 'يقول الشهود إن العشرات توقّفوا دفعة واحدة، الفوانيس مرفوعة، ووجوههم نحو برج الساعة.', 'Des témoins disent que des dizaines de gens se sont arrêtés d’un coup, lanternes levées, face à la tour de l’horloge.', 'Witnesses say dozens stopped at once, lanterns raised, facing the clock tower.'),
      L('كاين اللي كيقول الموسم مسكون. اللجنة كتقول «مشكل تقني».', 'يقول بعضهم إن المهرجان مسكون. وتسمّيه اللجنة «مسألة تقنية».', 'Certains parlent de hantise. Le comité parle d’un « problème technique ».', 'Some are calling it a haunting. The committee calls it “a technical matter”.'),
      L('جوج مرات دابا. والمرة التالتة، ضرب الناقوس وحتى واحد ما كان فالصومعة… [تشويش]', 'مرّتان حتى الآن. وفي الثالثة قرع الجرس ولا أحد في البرج… [تشويش]', 'Deux fois déjà. Et la troisième, la cloche a sonné sans personne dans la tour… [grésillements]', 'Twice now. And the third time, the bell rang with nobody in the tower… [static]'),
    ],
  },
  reveal: L(
    'هولومير، 31 أكتوبر، 23:40. الفنارات ديال الموسم باقي شاعلين.',
    'هولومير، 31 أكتوبر، 23:40. ما تزال فوانيس المهرجان مضاءة.',
    'Hollowmere, 31 octobre, 23 h 40. Les lanternes du festival brûlent encore.',
    'Hollowmere, 31 October, 23:40. The festival lanterns are still lit.',
  ),
  start: 'square',

  locations: [
    {
      id: 'square', scene: 'square', map: [46, 44],
      name: L('ساحة الموسم', 'ساحة المهرجان', 'La place du festival', 'Festival square'),
      desc: L('القرع، الكوانب ديال الكاوكاو، والفنارات معلّقين بخيوط. الناس كيهضرو بصوت واطي.', 'يقطين وأكشاك وفوانيس معلّقة بالخيوط. الناس يتحدّثون همسًا.', 'Citrouilles, étals, guirlandes de lanternes. Les gens parlent à voix basse.', 'Pumpkins, stalls and strings of lanterns. People talk in low voices.'),
    },
    {
      id: 'clocktower', scene: 'clocktower', map: [74, 18],
      name: L('صومعة الساعة', 'برج الساعة', 'La tour de l’horloge', 'Clock tower'),
      desc: L('الدروج ضيقين. فوق، الناقوس ساكت بحال إلا كيتسنى.', 'الدرج ضيّق. وفي الأعلى جرس صامت كأنه ينتظر.', 'L’escalier est étroit. En haut, la cloche se tait comme si elle attendait.', 'The stairs are narrow. Above, the bell hangs silent, as if waiting.'),
    },
    {
      id: 'market', scene: 'market', map: [82, 52],
      name: L('السوبرمارشي', 'المتجر الكبير', 'Le supermarché', 'Supermarket'),
      desc: L('على نفس الخيط ديال الضو اللي كيغذّي الساحة.', 'على خطّ الكهرباء نفسه الذي يغذّي الساحة.', 'Sur la même ligne électrique que la place.', 'On the same power line as the square.'),
    },
    {
      id: 'archive', scene: 'archive', map: [18, 20],
      name: L('أرشيف المدينة', 'أرشيف البلدة', 'Les archives municipales', 'Town archive'),
      desc: L('صناديق الكارتون حتى للسقف، وريحة الورق القديم.', 'صناديق كرتون حتى السقف ورائحة الورق القديم.', 'Des cartons jusqu’au plafond et l’odeur du vieux papier.', 'Boxes to the ceiling and the smell of old paper.'),
    },
    {
      id: 'police', scene: 'police', map: [64, 78],
      name: L('الكوميسارية', 'مركز الشرطة', 'Le commissariat', 'Police station'),
      desc: L('التيليفون ما حبسش كيصوني الليلة كاملة.', 'لم يتوقّف الهاتف عن الرنين طوال الليل.', 'Le téléphone n’a pas cessé de sonner de la nuit.', 'The phone hasn’t stopped ringing all night.'),
    },
    {
      id: 'garden', scene: 'garden', map: [14, 62], unlock: { puzzle: 'h_gate' },
      name: L('الجردة المهجورة', 'الحديقة المهجورة', 'Le jardin abandonné', 'Abandoned garden'),
      desc: L('من هنا كانت كتبدا الموكب زمان. دابا غير الحشيش والشوك.', 'من هنا كان الموكب ينطلق قديمًا. لم يبقَ اليوم إلا العشب والشوك.', 'C’est d’ici que partait la procession. Il n’en reste que ronces et herbes folles.', 'The procession used to start here. Now there are only brambles.'),
    },
    {
      id: 'service', scene: 'machine', map: [34, 80], unlock: { flag: 'service_open' },
      name: L('بيت الخدمة ديال الموسم', 'غرفة خدمات المهرجان', 'Le local technique du festival', 'Festival service room'),
      desc: L('تحت الساحة. كابلات، صناديق، وماكينة كتحسب الوقت.', 'تحت الساحة: كابلات وصناديق وآلة تعدّ الوقت.', 'Sous la place : câbles, caisses, et une machine qui compte le temps.', 'Under the square: cables, crates, and a machine that counts time.'),
    },
  ],

  items: {
    servicekey: {
      icon: 'key',
      name: L('ساروت بيت الخدمة', 'مفتاح غرفة الخدمات', 'Clé du local technique', 'Service-room key'),
      desc: L('عليه ورقة: «الموسم — بيت الخدمة».', 'عليه بطاقة: «المهرجان — غرفة الخدمات».', 'Étiquette : « Festival — local technique ».', 'Tagged “Festival — service room”.'),
    },
  },

  clues: {
    schedule: {
      kind: 'document', status: 'verified', from: 'square',
      title: L('برنامج الموسم', 'برنامج المهرجان', 'Programme du festival', 'Festival schedule'),
      body: L(
        'موسم الحصاد — 31 أكتوبر\n20:00  الناقوس ديال الافتتاح\n22:00  الناقوس ديال الشطيح\n00:00  الناقوس ديال السدّان',
        'مهرجان الحصاد — 31 أكتوبر\n20:00  جرس الافتتاح\n22:00  جرس الرقص\n00:00  جرس الختام',
        'Fête des moissons — 31 octobre\n20 h 00  cloche d’ouverture\n22 h 00  cloche du bal\n0 h 00  cloche de clôture',
        'Harvest Festival — 31 October\n20:00  opening bell\n22:00  dance bell\n00:00  closing bell',
      ),
    },
    youssef: {
      kind: 'statement', status: 'unverified', from: 'square',
      title: L('شهادة يوسف، مول الكوشة', 'شهادة يوسف، صاحب الكشك', 'Témoignage de Youssef, marchand', 'Youssef’s statement (stallholder)'),
      body: L(
        '«الناقوس ضرب تلات مرات قبل التمنية. شفت فالمكانة ديالي: 19:43. الضو طفا معاه. الشيوخ وقفو فبلاصتهم، هزّو الفنارات وداروا وجوههم للصومعة. الزوار دارو بحالهم. نفس الشي مع 21:43.»',
        '«قرع الجرس ثلاث مرّات قبل الثامنة. نظرت إلى ساعتي: 19:43. انطفأت الأضواء معه. توقّف الكبار في أماكنهم ورفعوا الفوانيس واستداروا نحو البرج، وقلّدهم الزوّار. وتكرّر الأمر عند 21:43.»',
        '« La cloche a sonné trois coups avant huit heures. J’ai regardé ma montre : 19 h 43. Les lumières se sont éteintes avec. Les anciens se sont figés, lanternes levées, face à la tour. Les visiteurs les ont imités. Pareil à 21 h 43. »',
        '“The bell rang three times before eight. I checked my watch: 19:43. The lights went out with it. The old folks froze, raised their lanterns and faced the tower. The visitors copied them. Same again at 21:43.”',
      ),
    },
    rumor_spirit: {
      kind: 'rumor', status: 'rumor', from: 'square',
      title: L('ورقة «الخاوي فاق»', 'منشور «الأجوف استيقظ»', 'Tract « Le Creux s’éveille »', '“The Hollow Wakes” flyer'),
      body: L(
        '«الخاوي فاق! الناقوس ضرب مع الطناش بوحدو. اللي سمعو كيطيع.»',
        '«الأجوف استيقظ! قرع الجرس وحده عند منتصف الليل. من يسمعه يطيعه.»',
        '« Le Creux s’éveille ! La cloche a sonné seule à minuit. Qui l’entend obéit. »',
        '“THE HOLLOW WAKES! The bell rang by itself at midnight. Whoever hears it obeys.”',
      ),
    },
    scarecrow: {
      kind: 'object', status: 'verified', from: 'square', optional: true,
      title: L('الخيّال اللي «تحرّك»', 'الفزّاعة التي «تحرّكت»', 'L’épouvantail qui « a bougé »', 'The scarecrow that “moved”'),
      body: L(
        'آثار ديال الطباشير فالأرض وأسماء ديال الدراري: «ربحنا! 3 مرات». كانو كيلعبو بيه.',
        'آثار طباشير على الأرض وأسماء أطفال: «فزنا! 3 مرّات». كانوا يلعبون به.',
        'Des traces de craie au sol et des prénoms d’enfants : « Gagné ! 3 fois ». Ils jouaient avec.',
        'Chalk marks on the ground and children’s names: “WE WON! 3 times”. They were playing with it.',
      ),
    },
    clocknote: {
      kind: 'object', status: 'verified', from: 'clocktower',
      title: L('ورقة فالماكينة ديال الساعة', 'بطاقة على آلية الساعة', 'Étiquette sur le mécanisme', 'Tag on the clock mechanism'),
      body: L(
        '«من العاصفة ديال شتنبر، الساعة كتزيد — كتمشي قدّام. غادي تتصلّح من بعد الموسم. — س.و.»\nفالوضع الميكانيكي، الناقوس كيضرب على حساب هاد الساعة. فالوضع العادي، كيتبع إشارة الراديو.',
        '«منذ عاصفة سبتمبر والساعة تُسرع. تُضبط بعد المهرجان. — س.و.»\nفي الوضع الميكانيكي يقرع الجرس وفق هذه الساعة. وفي الوضع العادي يتبع إشارة الراديو.',
        '« Depuis l’orage de septembre, l’horloge avance. À régler après le festival. — S.O. »\nEn mode mécanique, la cloche suit cette horloge. En mode normal, elle suit le signal horaire radio.',
        '“Since the September storm the clock gains — it runs ahead. To be regulated after the festival. — S.O.”\nIn mechanical mode the bell strikes by this clock. In normal mode it follows the radio time signal.',
      ),
    },
    ribbon: {
      kind: 'object', status: 'verified', from: 'clocktower',
      title: L('شريط ديال الفنار', 'شريط الفانوس', 'Ruban de lanterne', 'Lantern ribbon'),
      body: L(
        'مطرّز: «الموكب 1987». فيه الغيس، والخيط مقطوع جديد. لقيتو حدا الباب ديال الصومعة.',
        'مطرّز: «الموكب 1987». ملطّخ بالوحل، وخيطه مقطوع حديثًا. وُجد قرب باب البرج.',
        'Brodé : « PROCESSION 1987 ». Boueux, le fil fraîchement coupé. Trouvé devant la porte de la tour.',
        'Embroidered “PROCESSION 1987”. Muddy, the thread freshly cut. Found at the tower door.',
      ),
    },
    motor: {
      kind: 'object', status: 'verified', from: 'clocktower',
      title: L('موتور الناقوس', 'محرّك الجرس', 'Moteur de la cloche', 'Bell motor'),
      body: L(
        'موتور كهربائي كيضرب الناقوس. الكابل نازل لبيت الخدمة، مكتوب عليه «L2».',
        'محرّك كهربائي يقرع الجرس. الكابل ينزل إلى غرفة الخدمات، ومكتوب عليه «L2».',
        'Un moteur électrique frappe la cloche. Le câble descend au local technique, étiqueté « L2 ».',
        'An electric motor strikes the bell. Its cable runs down to the service room, labelled “L2”.',
      ),
    },
    paws: {
      kind: 'object', status: 'unverified', from: 'clocktower', optional: true,
      title: L('الغبرة على الذراع', 'الغبار على الذراع', 'La poussière du levier', 'Dust on the lever'),
      body: L(
        'الذراع اليدوي ديال الناقوس. الغبرة متحرّكة، وفيها آثار صغار مدوّرين. ماشي ديال يد.',
        'الذراع اليدوي للجرس. الغبار مضطرب، وفيه آثار صغيرة مستديرة. ليست آثار يد.',
        'Le levier manuel de la cloche. La poussière est dérangée par de petites empreintes rondes. Pas une main.',
        'The bell’s manual striker lever. The dust is disturbed by small rounded prints. Not a hand.',
      ),
    },
    powerlog: {
      kind: 'record', status: 'verified', from: 'market',
      title: L('سجل الضو ديال السوبرمارشي', 'سجلّ كهرباء المتجر', 'Journal électrique du supermarché', 'Supermarket power log'),
      body: L(
        'الساعة مضبوطة على إشارة الراديو.\nتقطيع الشبكة:\n19:43:05  (38 ثانية)\n21:43:04  (41 ثانية)\nمن بعد 21:44: والو.',
        'الساعة مضبوطة على إشارة الراديو الزمنية.\nانقطاعات الشبكة:\n19:43:05  (38 ثانية)\n21:43:04  (41 ثانية)\nبعد 21:44: لا شيء.',
        'Horloge synchronisée sur le signal horaire radio.\nCoupures réseau :\n19:43:05  (38 s)\n21:43:04  (41 s)\nAprès 21 h 44 : rien.',
        'Clock synced to the radio time signal.\nMains interruptions:\n19:43:05  (38 s)\n21:43:04  (41 s)\nAfter 21:44: none.',
      ),
    },
    nadia2: {
      kind: 'statement', status: 'unverified', from: 'market',
      title: L('شهادة نادية', 'شهادة نادية', 'Témoignage de Nadia', 'Nadia’s statement'),
      body: L(
        '«بقيت حالّة حتى للطناش ونص. مع الطناش ما ضرب حتى ناقوس. كون ضرب، كون سمعتو.»',
        '«بقي المتجر مفتوحًا حتى منتصف الليل والنصف. لم يقرع أيّ جرس عند منتصف الليل، ولو قرع لسمعته.»',
        '« J’étais ouverte jusqu’à minuit et demi. Aucune cloche à minuit. Je l’aurais entendue. »',
        '“I was open until half past midnight. No bell rang at midnight. I’d have heard it.”',
      ),
    },
    procedure: {
      kind: 'document', status: 'verified', from: 'archive',
      title: L('نظام موكب الفنارات (1987)', 'إجراءات موكب الفوانيس (1987)', 'Règlement de la procession (1987)', 'Lantern Procession procedure (1987)'),
      body: L(
        'مع التلات ضربات ديال الناقوس، الضو كينقص.\nاللي هازين الفنارات كيوقفو فبلاصتهم، الفنار لفوق، وجوههم للصومعة، دقيقة.\nمن بعد كيمشيو للصومعة بلا هضرة.\nالقفل ديال باب الجردة (منين كتبدا الموكب) مضبوط على العام ديال آخر موكب.',
        'عند ضربات الجرس الثلاث تُخفَّض الأضواء.\nيقف حاملو الفوانيس في أماكنهم، الفانوس مرفوع، والوجه نحو البرج، دقيقة واحدة.\nثم يسيرون نحو البرج بصمت.\nقفل بوابة الحديقة (منطلق الموكب) مضبوط على سنة آخر موكب.',
        'Aux trois coups de cloche, les lampes sont baissées.\nLes porteurs s’immobilisent, lanterne levée, face à la tour, une minute.\nPuis ils marchent vers la tour en silence.\nLe cadenas du portail du jardin (départ de la procession) est réglé sur l’année de la dernière procession.',
        'At the bell’s three strokes, the lamps are dimmed.\nBearers stand still, lanterns raised, facing the tower, for one minute.\nThen they walk to the tower in silence.\nThe garden-gate lock (where the procession starts) is set to the year of the last procession.',
      ),
    },
    ledger: {
      kind: 'record', status: 'verified', from: 'archive',
      title: L('كناش الإعارة', 'سجلّ الإعارة', 'Registre des prêts', 'Borrowing ledger'),
      body: L(
        '29/10 — صندوق «الموكب 1987: كارطة التوقيت والشرايط» — تسلّفاتو: أ. ثورن\nرجوع: —',
        '29/10 — صندوق «موكب 1987: بطاقة التوقيت والأشرطة» — المستعيرة: أ. ثورن\nالإرجاع: —',
        '29/10 — boîte « Procession 1987 : carte de minuterie & rubans » — empruntée par A. Thorn\nRetour : —',
        '29/10 — box “Procession 1987: timer card & ribbons” — borrowed by A. Thorn\nReturned: —',
      ),
    },
    photo1924: {
      kind: 'photo', status: 'verified', from: 'archive', optional: true,
      title: L('تصويرة 1924', 'صورة 1924', 'Photo de 1924', 'Photograph, 1924'),
      body: L(
        'مكتوب تحت: «ناقوس الدقيقة الطلطاش». فالشرجم ديال الصومعة، قطة كحلة بعلامة هلال فالجبهة.',
        'كُتب تحتها: «جرس الدقيقة الثالثة عشرة». في نافذة البرج قطة سوداء على جبينها علامة هلال.',
        'Légende : « La cloche de la treizième minute ». À la fenêtre de la tour, une chatte noire au croissant pâle.',
        'Caption: “The thirteenth-minute bell”. In the tower window, a black cat with a pale crescent on her brow.',
      ),
    },
    complaints: {
      kind: 'record', status: 'verified', from: 'police',
      title: L('سجل البلاغات', 'سجلّ البلاغات', 'Main courante', 'Complaints log'),
      body: L(
        '19:44  ناقوس + الضو طفا، «الناس تجمّدو»\n21:44  ناقوس + الضو طفا\n23:13  ناقوس — الضو ما طفاش\n00:00  حتى بلاغ',
        '19:44  جرس + انقطاع الأضواء، «تجمّد الناس»\n21:44  جرس + انقطاع الأضواء\n23:13  جرس — دون انقطاع\n00:00  لا بلاغات',
        '19 h 44  cloche + coupure, « les gens se sont figés »\n21 h 44  cloche + coupure\n23 h 13  cloche — pas de coupure\n0 h 00  aucun appel',
        '19:44  bell + lights out, “people froze”\n21:44  bell + lights out\n23:13  bell — no blackout\n00:00  no calls',
      ),
    },
    offset: {
      kind: 'inference', status: 'verified', from: 'clocktower',
      title: L('الساعة قدّام 17 دقيقة', 'الساعة متقدّمة 17 دقيقة', 'L’horloge a 17 minutes d’avance', 'The clock is 17 minutes fast'),
      body: L(
        'الناقوس كيضرب على وقت الصومعة: «20:00» عندها = 19:43 الحقيقية.',
        'يقرع الجرس بتوقيت البرج: «20:00» عنده = 19:43 بالتوقيت الحقيقي.',
        'La cloche suit l’heure de la tour : « 20 h 00 » chez elle = 19 h 43 en vrai.',
        'The bell keeps tower time: “20:00” there is 19:43 real time.',
      ),
    },
    timercard: {
      kind: 'object', status: 'verified', from: 'service',
      title: L('كارطة التوقيت', 'بطاقة المؤقّت', 'Carte de la minuterie', 'Timer card'),
      body: L(
        'الكارطة اللي فالماكينة: «الموكب 1987 — تلات ضربات مع 20:00 و22:00. وضع ميكانيكي: كيقرا وقت الصومعة».\nالكارطة العادية ديال الموسم (مضبوطة بالراديو، ضربة وحدة مع 20:00 و22:00 و00:00) محيّدة وموحولة حداها.\nحتى ضربة مع 23:13 ما كاينة.',
        'البطاقة داخل الآلة: «موكب 1987 — ثلاث ضربات عند 20:00 و22:00. وضع ميكانيكي: يقرأ توقيت البرج».\nبطاقة المهرجان العادية (مضبوطة بالراديو، ضربة واحدة عند 20:00 و22:00 و00:00) منزوعة وموضوعة جانبًا.\nلا ضربة عند 23:13.',
        'Carte insérée : « PROCESSION 1987 — trois coups à 20 h 00 et 22 h 00. Mode mécanique : lit l’heure de la tour ».\nLa carte normale du festival (calée sur la radio, un coup à 20 h, 22 h et minuit) a été retirée, posée à côté.\nAucun coup à 23 h 13.',
        'Card inserted: “PROCESSION 1987 — three strokes at 20:00 and 22:00. Mechanical mode: reads the tower clock”.\nThe normal festival card (radio-synced, one stroke at 20:00, 22:00 and 00:00) has been removed and set aside.\nNo strike at 23:13.',
      ),
    },
    config: {
      kind: 'document', status: 'verified', from: 'service',
      title: L('ورقة التركيب', 'ورقة الإعداد', 'Fiche de montage', 'Setup sheet'),
      body: L(
        'تركيب مؤقت — س. وردي\nالضو ديال الخيوط + الموتور ديال الناقوس: بجوج على الدائرة L2 (الدائرة الاحتياطية ما خدّاماش).\nتنبيه: الموتور فاش كيبدا يقدر يطيّح L2.',
        'إعداد مؤقت — س. وردي\nأضواء الزينة + محرّك الجرس: كلاهما على الدائرة L2 (الدائرة الاحتياطية معطّلة).\nتنبيه: تيار إقلاع المحرّك قد يفصل L2.',
        'Montage provisoire — S. Ouardi\nGuirlandes + moteur de cloche : tous deux sur le circuit L2 (circuit de secours hors service).\nAttention : l’appel de courant du moteur peut faire sauter L2.',
        'Temporary setup — S. Ouardi\nFestoon lights + bell motor: both on circuit L2 (spare circuit out of service).\nWarning: motor inrush may trip L2.',
      ),
    },
  },

  objects: [
    // Square
    {
      id: 'sq_board', loc: 'square', prop: 'board', at: [22, 40, 18], gives: { clues: ['schedule'] }, doc: 'schedule',
      name: L('لوحة الإعلانات', 'لوحة الإعلانات', 'Panneau d’affichage', 'Noticeboard'),
      text: L('البرنامج ديال الليلة، مزوّق بالقرع.', 'برنامج الليلة مزيّن باليقطين.', 'Le programme du soir, orné de citrouilles.', 'Tonight’s programme, decorated with pumpkins.'),
    },
    {
      id: 'sq_vendor', loc: 'square', prop: 'stall', at: [70, 58, 22], gives: { clues: ['youssef'] }, doc: 'youssef',
      name: L('يوسف، مول الكوشة', 'يوسف، صاحب الكشك', 'Youssef, le marchand', 'Youssef at his stall'),
      text: L('كيحسب الكاوكاو المشوي وعينيه على الصومعة.', 'يعدّ الفول السوداني المحمّص وعيناه على البرج.', 'Il compte ses cacahuètes grillées, les yeux sur la tour.', 'Counting roasted peanuts, eyes on the tower.'),
    },
    {
      id: 'sq_flyer', loc: 'square', prop: 'poster', at: [46, 34, 10], gives: { clues: ['rumor_spirit'] }, doc: 'rumor_spirit',
      name: L('ورقة ملصقة', 'منشور ملصق', 'Tract collé', 'Pasted flyer'),
      text: L('الحبر باقي فازگ.', 'الحبر ما يزال رطبًا.', 'L’encre est encore fraîche.', 'The ink is still wet.'),
    },
    {
      id: 'sq_scarecrow', loc: 'square', prop: 'scarecrow', at: [88, 46, 10], optional: true, gives: { clues: ['scarecrow'] }, doc: 'scarecrow',
      name: L('الخيّال', 'الفزّاعة', 'L’épouvantail', 'Scarecrow'),
      text: L('كيقولو تحرّك بوحدو.', 'يقولون إنها تحرّكت وحدها.', 'On dit qu’il a bougé tout seul.', 'They say it moved on its own.'),
    },
    {
      id: 'sq_hatch', loc: 'square', prop: 'hatch', at: [36, 80, 14],
      name: L('باب ديال الأرض', 'باب أرضي', 'Trappe', 'Floor hatch'),
      text: [
        { text: L('مكتوب عليه: «خدمة — ممنوع».', 'مكتوب عليه: «خدمات — ممنوع الدخول».', 'Marqué « Service — interdit ».', 'Stencilled “Service — no entry”.') },
        { if: { flag: 'service_open' }, text: L('محلول. الدروج نازلين.', 'مفتوح. الدرج ينزل.', 'Ouverte. Des marches descendent.', 'Open. Steps lead down.') },
      ],
      accepts: [
        { item: 'servicekey', flag: 'service_open', consume: true, text: L('القفل تحلّ بصعوبة.', 'انفتح القفل بصعوبة.', 'Le cadenas cède avec peine.', 'The padlock gives, grudgingly.') },
      ],
    },
    // Clock tower
    {
      id: 'ct_clock', loc: 'clocktower', prop: 'clockface', at: [50, 30, 22], puzzle: 'h_offset',
      name: L('وجه الساعة', 'ميناء الساعة', 'Le cadran', 'Clock face'),
      text: [
        { text: L('العقارب كيتحرّكو. ولكن واش مضبوطين؟', 'العقارب تتحرّك. لكن هل هي مضبوطة؟', 'Les aiguilles avancent. Mais sont-elles justes ?', 'The hands move. But are they right?') },
        { if: { puzzle: 'h_offset' }, text: L('17 دقيقة قدّام. دابا عرفتي.', 'متقدّمة 17 دقيقة. صرت تعرف.', '17 minutes d’avance. Maintenant vous savez.', '17 minutes fast. Now you know.') },
      ],
      locked: L('باش تعرف واش الساعة مضبوطة، خاصك وقت مكتوب ووقت حقيقي من مصدر آخر.', 'لتعرف إن كانت الساعة مضبوطة، تحتاج إلى وقت مبرمج ووقت حقيقي من مصدر آخر.', 'Pour juger l’horloge, il faut une heure prévue et une heure réelle venue d’ailleurs.', 'To judge the clock you need a scheduled time and a real time from somewhere else.'),
    },
    {
      id: 'ct_tag', loc: 'clocktower', prop: 'paper', at: [28, 56, 10], gives: { clues: ['clocknote'] }, doc: 'clocknote',
      name: L('ورقة مربوطة', 'بطاقة معلّقة', 'Étiquette attachée', 'Tied-on tag'),
      text: L('مربوطة بخيط فالماكينة.', 'مربوطة بخيط إلى الآلية.', 'Nouée au mécanisme.', 'Tied to the mechanism.'),
    },
    {
      id: 'ct_motor', loc: 'clocktower', prop: 'motor', at: [74, 54, 14], gives: { clues: ['motor'] }, doc: 'motor',
      name: L('موتور الناقوس', 'محرّك الجرس', 'Moteur de cloche', 'Bell motor'),
      text: L('سخون شوية.', 'دافئ قليلًا.', 'Encore tiède.', 'Faintly warm.'),
    },
    {
      id: 'ct_ribbon', loc: 'clocktower', prop: 'ribbon', at: [44, 84, 10], gives: { clues: ['ribbon'] }, doc: 'ribbon',
      name: L('شي حاجة فالأرض', 'شيء على الأرض', 'Quelque chose au sol', 'Something on the floor'),
      text: L('شريط مطرّز فالغيس.', 'شريط مطرّز في الوحل.', 'Un ruban brodé dans la boue.', 'An embroidered ribbon in the mud.'),
    },
    {
      id: 'ct_lever', loc: 'clocktower', prop: 'lever', at: [88, 30, 8], optional: true, gives: { clues: ['paws'] }, doc: 'paws',
      name: L('الذراع اليدوي', 'الذراع اليدوي', 'Levier manuel', 'Manual lever'),
      text: L('للضرب باليد. حتى واحد ما بقى كيستعملو.', 'للقرع اليدوي. لم يعد أحد يستعمله.', 'Pour sonner à la main. Plus personne ne s’en sert.', 'For ringing by hand. Nobody uses it any more.'),
    },
    // Market
    {
      id: 'mk_ups', loc: 'market', prop: 'printout', at: [26, 60, 14], gives: { clues: ['powerlog'] }, doc: 'powerlog',
      name: L('صندوق الضو', 'صندوق الكهرباء', 'Onduleur', 'Backup power unit'),
      text: L('كيطبع كل مرة كتطيح الشبكة.', 'يطبع كلّما انقطعت الشبكة.', 'Il imprime chaque coupure du réseau.', 'It prints every time the mains drops.'),
    },
    {
      id: 'mk_cashier', loc: 'market', prop: 'cashier', at: [70, 52, 14], gives: { clues: ['nadia2'] }, doc: 'nadia2',
      name: L('نادية', 'نادية', 'Nadia', 'Nadia'),
      text: L('عيانة، ولكن متيقة فراسها.', 'متعبة لكنها واثقة.', 'Fatiguée, mais sûre d’elle.', 'Tired, but certain.'),
    },
    {
      id: 'mk_clock', loc: 'market', prop: 'wallclock', at: [52, 26, 9],
      name: L('ساعة الحيط', 'ساعة الحائط', 'Horloge murale', 'Wall clock'),
      text: L('«مضبوطة بالراديو.» كتقول الحقيقة، على الأقل هي.', '«مضبوطة بالراديو.» على الأقل هذه تقول الحقيقة.', '« Radio-pilotée. » Elle, au moins, dit l’heure juste.', '“Radio-controlled.” This one, at least, tells the truth.'),
    },
    // Archive
    {
      id: 'ar_procedure', loc: 'archive', prop: 'folder', at: [30, 64, 14], gives: { clues: ['procedure'] }, doc: 'procedure',
      name: L('ملف «الموكب»', 'ملف «الموكب»', 'Dossier « Procession »', '“Procession” folder'),
      text: L('ملف رقيق، ختم 1987.', 'ملف رقيق عليه ختم 1987.', 'Une chemise mince, tampon de 1987.', 'A thin folder stamped 1987.'),
    },
    {
      id: 'ar_ledger', loc: 'archive', prop: 'logbook', at: [56, 70, 14], gives: { clues: ['ledger'] }, doc: 'ledger',
      name: L('كناش الإعارة', 'سجلّ الإعارة', 'Registre des prêts', 'Borrowing ledger'),
      text: L('آخر سطر كتب هاد السيمانة.', 'آخر سطر كُتب هذا الأسبوع.', 'La dernière ligne date de cette semaine.', 'The last line was written this week.'),
    },
    {
      id: 'ar_idris', loc: 'archive', prop: 'archivist', at: [80, 54, 14],
      name: L('إدريس، مول الأرشيف', 'إدريس، أمين الأرشيف', 'Idris, l’archiviste', 'Idris the archivist'),
      text: L(
        '«الموكب حيّدوه فـ1988. قالو كيخلّع السيّاح. ولكن الشيوخ ما نساوش.»',
        '«أُلغي الموكب سنة 1988. قالوا إنه يخيف السيّاح. لكن الكبار لم ينسوا.»',
        '« La procession a été supprimée en 1988. Trop inquiétante pour les touristes. Les anciens n’ont pas oublié. »',
        '“The procession was voted out in 1988. Too eerie for tourists, they said. The old ones never forgot.”',
      ),
    },
    {
      id: 'ar_photo', loc: 'archive', prop: 'frame', at: [64, 28, 9], optional: true, gives: { clues: ['photo1924'] }, doc: 'photo1924',
      name: L('تصويرة باهتة', 'صورة باهتة', 'Photo pâlie', 'Faded photograph'),
      text: L('معلقة عوجة.', 'معلّقة مائلة.', 'Accrochée de travers.', 'Hung crooked.'),
    },
    {
      id: 'ar_gate', loc: 'archive', prop: 'gate', at: [12, 56, 16], puzzle: 'h_gate',
      name: L('باب الجردة', 'بوابة الحديقة', 'Portail du jardin', 'Garden gate'),
      text: [
        { text: L('قفل بأربعة ديال الأرقام، ديال شي عام.', 'قفل بأربعة أرقام، كأنها سنة.', 'Un cadenas à quatre chiffres. Une année ?', 'A four-digit lock. A year?') },
        { if: { puzzle: 'h_gate' }, text: L('محلول. الجردة كتسناك.', 'مفتوح. الحديقة تنتظرك.', 'Ouvert. Le jardin vous attend.', 'Open. The garden waits.') },
      ],
      locked: L('ما تخمّنش. شي وثيقة فالأرشيف كتقول كيفاش تضبط هاد القفل.', 'لا تخمّن. وثيقة ما في الأرشيف تذكر كيف ضُبط هذا القفل.', 'Ne devinez pas. Un document des archives dit comment ce cadenas a été réglé.', 'Don’t guess. A document in the archive says how this lock was set.'),
    },
    // Police
    {
      id: 'pc_log', loc: 'police', prop: 'printout', at: [30, 64, 14], gives: { clues: ['complaints'] }, doc: 'complaints',
      name: L('سجل البلاغات', 'سجلّ البلاغات', 'Main courante', 'Complaints log'),
      text: L('مكتوب بزربة، ساعة بساعة.', 'مكتوب على عجل، ساعة بساعة.', 'Écrit à la hâte, heure par heure.', 'Written in haste, hour by hour.'),
    },
    {
      id: 'pc_benali', loc: 'police', prop: 'officer', at: [76, 52, 14],
      name: L('المفتشة بنعلي', 'المفتشة بنعلي', 'Agente Benali', 'Officer Benali'),
      text: L(
        '«نص المدينة كيقول شي حاجة مسكونة. أنا عندي غير الأوقات. فرّق ليا بين داكشي اللي تبت وداكشي اللي تعاود.»',
        '«نصف البلدة يتحدّث عن مسّ. لديّ الأوقات فقط. ميّز لي بين ما ثبت وما يُروى.»',
        '« La moitié de la ville parle de hantise. Moi, j’ai des heures. Séparez-moi le prouvé du raconté. »',
        '“Half the town says it’s haunted. All I have are times. Sort what’s proven from what’s told.”',
      ),
    },
    {
      id: 'pc_board', loc: 'police', prop: 'whiteboard', at: [50, 28, 20], puzzle: 'h_claims',
      name: L('سبورة البلاغات', 'سبّورة البلاغات', 'Tableau des signalements', 'Reports board'),
      text: [
        { text: L('خمسة ديال الجمل مكتوبين بلا ترتيب.', 'خمس جمل مكتوبة دون ترتيب.', 'Cinq affirmations griffonnées en vrac.', 'Five claims scrawled in no order.') },
        { if: { puzzle: 'h_claims' }, text: L('دابا كل جملة فالخانة ديالها.', 'كلّ جملة الآن في خانتها.', 'Chaque affirmation est à sa place.', 'Every claim is in its column now.') },
      ],
      locked: L('باش تفرّز هاد الجمل، خاصك سجل البلاغات، الإشاعة، والوثيقة اللي كتشرح سلوك الشيوخ.', 'لفرز هذه الجمل تحتاج سجلّ البلاغات والإشاعة والوثيقة التي تشرح سلوك الكبار.', 'Pour trier ces affirmations, il faut la main courante, la rumeur, et le document qui explique le geste des anciens.', 'To sort these claims you need the complaints log, the rumour, and the document that explains what the elders did.'),
    },
    // Garden
    {
      id: 'gd_shed', loc: 'garden', prop: 'shed', at: [66, 54, 26], gives: { items: ['servicekey'] },
      name: L('براكة الموسم', 'كوخ المهرجان', 'Cabane du festival', 'Festival shed'),
      text: [
        { text: L('فلداخل، ساروت معلّق بورقة.', 'في الداخل مفتاح معلّق ببطاقة.', 'À l’intérieur, une clé étiquetée.', 'Inside, a tagged key on a nail.') },
        { if: { item: 'servicekey' }, text: L('المسمار خاوي.', 'المسمار فارغ.', 'Le clou est vide.', 'The nail is empty.') },
      ],
    },
    {
      id: 'gd_lanterns', loc: 'garden', prop: 'lantern', at: [30, 60, 12],
      name: L('الفنارات القدام', 'الفوانيس القديمة', 'Vieilles lanternes', 'Old lanterns'),
      text: L(
        'صف ديال الفنارات ديال الموكب. وحدة ناقصة، والبلاصة ديالها نقية من الغبرة.',
        'صفّ من فوانيس الموكب. ينقص واحد، ومكانه خالٍ من الغبار.',
        'Une rangée de lanternes de procession. Il en manque une ; sa place est sans poussière.',
        'A row of procession lanterns. One is missing; its place is free of dust.',
      ),
    },
    // Service room
    {
      id: 'sr_timer', loc: 'service', prop: 'timer', at: [30, 50, 18], gives: { clues: ['timercard'] }, doc: 'timercard',
      name: L('ماكينة التوقيت', 'آلة التوقيت', 'Minuterie', 'Timer unit'),
      text: L('كارطة مثقوبة داخلة فيها.', 'بطاقة مثقّبة داخلها.', 'Une carte perforée y est insérée.', 'A punched card is slotted in.'),
    },
    {
      id: 'sr_sheet', loc: 'service', prop: 'paper', at: [58, 66, 12], gives: { clues: ['config'] }, doc: 'config',
      name: L('ورقة مسمّرة', 'ورقة مثبّتة', 'Feuille punaisée', 'Pinned sheet'),
      text: L('خط ديال تقني زربان.', 'خطّ فنّي مستعجل.', 'L’écriture d’un technicien pressé.', 'A hurried technician’s hand.'),
    },
    {
      id: 'sr_panel', loc: 'service', prop: 'breaker', at: [80, 44, 16], puzzle: 'h_cause',
      name: L('لوحة الدوائر', 'لوحة الدوائر', 'Tableau des circuits', 'Circuit panel'),
      text: [
        { text: L('عدّاد L2 كيقول: طاح جوج مرات.', 'عدّاد L2 يشير: فُصل مرّتين.', 'Compteur de L2 : deux déclenchements.', 'L2 trip counter: 2.') },
        { if: { puzzle: 'h_cause' }, text: L('L2 والموتور: عرفتي شكون كيطيّح شكون.', 'L2 والمحرّك: عرفت من يُسقط من.', 'L2 et le moteur : vous savez qui fait tomber qui.', 'L2 and the motor: you know which trips which.') },
      ],
      locked: L('قبل ما تحكم على هاد اللوحة، قرا كيفاش تركّبات، وقارن مع الأوقات ديال تقطيع الضو.', 'قبل الحكم على هذه اللوحة اقرأ كيف رُكّبت وقارن بأوقات الانقطاع.', 'Avant de juger ce tableau, lisez comment il a été monté et comparez avec les heures de coupure.', 'Before judging this panel, read how it was wired and compare with the outage times.'),
    },
  ],

  puzzles: {
    h_offset: {
      type: 'choice',
      requires: { all: [{ clue: 'schedule' }, { clue: 'powerlog' }] },
      title: L('شحال قدّام الساعة؟', 'كم تتقدّم الساعة؟', 'De combien l’horloge avance-t-elle ?', 'How fast is the clock?'),
      prompt: L(
        'الناقوس خاصو يضرب مع 20:00 و22:00. الضو طاح مع 19:43 و21:43 بالوقت الحقيقي. شحال قدّام الساعة ديال الصومعة؟',
        'يُفترض أن يقرع الجرس عند 20:00 و22:00. انقطعت الكهرباء عند 19:43 و21:43 بالتوقيت الحقيقي. كم تتقدّم ساعة البرج؟',
        'La cloche devait sonner à 20 h et 22 h. Le courant a sauté à 19 h 43 et 21 h 43, heure réelle. De combien l’horloge de la tour avance-t-elle ?',
        'The bell should strike at 20:00 and 22:00. The power dropped at 19:43 and 21:43 real time. How fast is the tower clock?',
      ),
      options: [
        { id: '13', text: L('13 دقيقة', '13 دقيقة', '13 minutes', '13 minutes'), why: L('عاود الحساب من 19:43 حتى 20:00.', 'أعد الحساب من 19:43 إلى 20:00.', 'Refaites le compte de 19 h 43 à 20 h.', 'Count again from 19:43 to 20:00.') },
        { id: '17', text: L('17 دقيقة', '17 دقيقة', '17 minutes', '17 minutes') },
        { id: '43', text: L('43 دقيقة', '43 دقيقة', '43 minutes', '43 minutes'), why: L('43 هي الدقايق ديال الوقت، ماشي الفرق.', '43 هي الدقائق في الساعة، لا الفرق.', '43, ce sont les minutes affichées, pas l’écart.', '43 is the minute reading, not the difference.') },
        { id: '60', text: L('ساعة كاملة', 'ساعة كاملة', 'Une heure', 'A full hour'), why: L('الفرق صغير من ساعة.', 'الفرق أصغر من ساعة.', 'L’écart est bien moindre qu’une heure.', 'The gap is much smaller than an hour.') },
      ],
      answer: '17',
      wrong: L('ماشي هادا الفرق.', 'ليس هذا هو الفرق.', 'Ce n’est pas l’écart.', 'That isn’t the gap.'),
      success: L('17 دقيقة. الناقوس ما كذبش، الساعة هي اللي كذبات.', '17 دقيقة. لم يكذب الجرس، بل الساعة.', '17 minutes. La cloche n’a pas menti ; c’est l’horloge.', '17 minutes. The bell didn’t lie; the clock did.'),
      gives: { clues: ['offset'] },
      hints: [
        L('ماشي الوقت اللي ضرب فيه الناقوس اللي غلط. شوف شكون كيقول للناقوس إمتى يضرب.', 'ليس توقيت الجرس هو الخاطئ بالضرورة. انظر من يخبر الجرس متى يقرع.', 'Ce n’est pas forcément la cloche qui se trompe. Regardez ce qui lui dit quand sonner.', 'It isn’t necessarily the bell that’s wrong. Look at what tells it when to ring.'),
        L('قارن الوقت المكتوب فالبرنامج مع الوقت الحقيقي ديال تقطيع الضو.', 'قارن الوقت المكتوب في البرنامج بالوقت الحقيقي للانقطاع.', 'Comparez l’heure du programme et l’heure réelle de la coupure.', 'Compare the scheduled time with the real time of the outage.'),
        L('من 19:43 حتى 20:00 كاين 17 دقيقة. نفس الفرق من 21:43 حتى 22:00.', 'من 19:43 إلى 20:00 سبع عشرة دقيقة، والفرق نفسه من 21:43 إلى 22:00.', 'De 19 h 43 à 20 h, 17 minutes. Même écart de 21 h 43 à 22 h.', 'From 19:43 to 20:00 is 17 minutes. Same gap from 21:43 to 22:00.'),
      ],
    },
    h_gate: {
      type: 'code',
      digits: 4,
      requires: { clue: 'procedure' },
      title: L('قفل باب الجردة', 'قفل بوابة الحديقة', 'Cadenas du jardin', 'Garden-gate lock'),
      prompt: L('دخّل أربعة ديال الأرقام.', 'أدخل أربعة أرقام.', 'Entrez quatre chiffres.', 'Enter four digits.'),
      answer: '1987',
      wrong: L('القفل ما تحلّش.', 'لم ينفتح القفل.', 'Le cadenas résiste.', 'The lock doesn’t give.'),
      success: L('الباب تحلّ مع تزييرة ديال الحديد القديم.', 'انفتحت البوابة بصرير حديد قديم.', 'Le portail s’ouvre dans un grincement de vieux fer.', 'The gate opens with a groan of old iron.'),
      hints: [
        L('الوثيقة اللي كتشرح الموكب كتقول حتى كيفاش تضبط هاد القفل.', 'الوثيقة التي تشرح الموكب تذكر أيضًا كيف ضُبط هذا القفل.', 'Le document qui décrit la procession dit aussi comment ce cadenas a été réglé.', 'The document that describes the procession also says how this lock was set.'),
        L('القفل مضبوط على عام ديال آخر موكب.', 'القفل مضبوط على سنة آخر موكب.', 'Le cadenas est réglé sur l’année de la dernière procession.', 'The lock is set to the year of the last procession.'),
        L('النظام والشريط بجوج فيهم نفس العام. وإدريس كيقول الموكب تحيّد فالعام اللي من موراه.', 'الإجراءات والشريط يحملان السنة نفسها، ويقول إدريس إن الموكب أُلغي في السنة التي تليها.', 'Le règlement et le ruban portent la même année, et Idris dit que la procession a été supprimée l’année suivante.', 'The procedure and the ribbon carry the same year, and Idris says the procession was voted out the year after.'),
      ],
    },
    h_claims: {
      type: 'classify',
      requires: { all: [{ clue: 'complaints' }, { clue: 'rumor_spirit' }, { clue: 'procedure' }] },
      title: L('فرّز البلاغات', 'افرز البلاغات', 'Trier les signalements', 'Sort the claims'),
      prompt: L(
        'حطّ كل جملة فالخانة ديالها: ثابتة بالسجلات، تفسير معقول، ولا إشاعة.',
        'ضع كلّ جملة في خانتها: ثابتة بالسجلات، أو تفسير مدعوم، أو إشاعة.',
        'Classez chaque affirmation : prouvée par les relevés, interprétation fondée, ou rumeur.',
        'Place each claim: proven by records, supported interpretation, or rumour.',
      ),
      categories: {
        verified: L('ثابتة', 'ثابتة', 'Prouvée', 'Proven'),
        interpretation: L('تفسير', 'تفسير', 'Interprétation', 'Interpretation'),
        rumor: L('إشاعة', 'إشاعة', 'Rumeur', 'Rumour'),
      },
      statements: {
        s_times: L('الناقوس ضرب مع 19:43 و21:43.', 'قرع الجرس عند 19:43 و21:43.', 'La cloche a sonné à 19 h 43 et 21 h 43.', 'The bell rang at 19:43 and 21:43.'),
        s_lights: L('الضو طفا فنفس الوقت اللي ضرب فيه الناقوس.', 'انطفأت الأضواء لحظة قرع الجرس.', 'Les lumières se sont éteintes quand la cloche a sonné.', 'The lights failed when the bell rang.'),
        s_elders: L('الشيوخ كانو كيتبعو نظام قديم.', 'كان الكبار يتّبعون إجراءً قديمًا.', 'Les anciens suivaient un vieux règlement.', 'The elders were following an old procedure.'),
        s_midnight: L('الناقوس ضرب بوحدو مع الطناش.', 'قرع الجرس وحده عند منتصف الليل.', 'La cloche a sonné seule à minuit.', 'The bell rang by itself at midnight.'),
        s_obey: L('اللي كيسمع الناقوس كيطيع.', 'من يسمع الجرس يطيعه.', 'Qui entend la cloche obéit.', 'Whoever hears the bell obeys.'),
      },
      answer: { s_times: 'verified', s_lights: 'verified', s_elders: 'interpretation', s_midnight: 'rumor', s_obey: 'rumor' },
      wrong: L('شي جمل ما فبلاصتهمش. سول راسك: شكون سجّل هادشي؟', 'بعض الجمل في غير مكانها. اسأل نفسك: من سجّل هذا؟', 'Certaines affirmations sont mal rangées. Demandez-vous : qui l’a enregistré ?', 'Some claims are misplaced. Ask yourself: who recorded this?'),
      success: L('بنعلي نقلات السبورة فالكناش ديالها. «هادشي كنقدر نخدم بيه.»', 'نقلت بنعلي السبّورة إلى دفترها. «بهذا أستطيع أن أعمل.»', 'Benali recopie le tableau. « Avec ça, je peux travailler. »', 'Benali copies the board into her notebook. “This I can work with.”'),
      hints: [
        L('سول على كل جملة: واش كاينة ماكينة ولا سجل كيقولها، ولا غير الناس؟', 'اسأل عن كلّ جملة: هل تقولها آلة أو سجلّ، أم الناس فقط؟', 'Pour chaque phrase : un appareil ou un registre l’atteste-t-il, ou seulement des gens ?', 'For each claim: does a machine or a record say it, or only people?'),
        L('سجل البلاغات ما فيه حتى حاجة مع الطناش. والنظام ديال 1987 كيشرح الوقفة.', 'سجلّ البلاغات خالٍ عند منتصف الليل، وإجراءات 1987 تشرح الوقوف.', 'La main courante est vide à minuit, et le règlement de 1987 explique l’immobilité.', 'The complaints log is empty at midnight, and the 1987 procedure explains the freeze.'),
        L('الأوقات والضو: ثابتة. الشيوخ والنظام: تفسير. الطناش والطاعة: إشاعة.', 'الأوقات والأضواء: ثابتة. الكبار والإجراء: تفسير. منتصف الليل والطاعة: إشاعة.', 'Heures et lumières : prouvé. Anciens et règlement : interprétation. Minuit et obéissance : rumeur.', 'Times and lights: proven. Elders and procedure: interpretation. Midnight and obeying: rumour.'),
      ],
    },
    h_cause: {
      type: 'choice',
      requires: { all: [{ clue: 'config' }, { clue: 'powerlog' }] },
      title: L('علاش طفا الضو؟', 'لماذا انطفأت الأضواء؟', 'Pourquoi les lumières tombaient ?', 'Why did the lights fail?'),
      prompt: L('شنو اللي كان كيطفي الضو كل مرة كيضرب الناقوس؟', 'ما الذي كان يطفئ الأضواء كلّما قرع الجرس؟', 'Qu’est-ce qui coupait la lumière à chaque coup de cloche ?', 'What cut the lights every time the bell rang?'),
      options: [
        { id: 'shared', text: L('الموتور ديال الناقوس والضو بجوج على L2', 'محرّك الجرس والأضواء معًا على L2', 'Moteur de cloche et guirlandes partagent L2', 'The bell motor and the lights share circuit L2') },
        { id: 'grid', text: L('الشبكة ديال المدينة طاحت', 'سقطت شبكة البلدة', 'Le réseau de la ville a lâché', 'The town grid failed'), why: L('سجل السوبرمارشي كيبيّن تقطيع قصير مع الناقوس بالضبط، ماشي طيحة كبيرة.', 'سجلّ المتجر يُظهر انقطاعًا قصيرًا متزامنًا مع الجرس، لا انهيارًا عامًا.', 'Le relevé montre des coupures brèves, pile au coup de cloche — pas une panne générale.', 'The log shows brief drops exactly at the bell — not a general failure.') },
        { id: 'sabotage', text: L('شي واحد طفا الضو بيدو', 'أطفأ أحدهم الأضواء يدويًا', 'Quelqu’un a éteint à la main', 'Someone switched them off by hand'), why: L('العدّاد كيقول «طاح»، ماشي «تطفى».', 'العدّاد يقول «فُصل تلقائيًا» لا «أُطفئ».', 'Le compteur dit « déclenché », pas « éteint ».', 'The counter says “tripped”, not “switched off”.') },
        { id: 'card', text: L('الكارطة كتطفي الضو', 'البطاقة تطفئ الأضواء', 'La carte coupe la lumière', 'The timer card cuts the lights'), why: L('الكارطة كتقول غير إمتى يضرب الناقوس.', 'البطاقة تحدّد فقط متى يقرع الجرس.', 'La carte ne commande que la cloche.', 'The card only tells the bell when to strike.') },
      ],
      answer: 'shared',
      wrong: L('هادشي ما كيشرحش علاش الضو كيطيح مع الناقوس بالضبط.', 'هذا لا يفسّر تزامن الانقطاع مع الجرس.', 'Cela n’explique pas la coïncidence exacte avec la cloche.', 'That doesn’t explain why it happens exactly with the bell.'),
      success: L('الموتور كيجبد الضو فاش كيبدا، وL2 كيطيح. حادث، ماشي لعنة.', 'يسحب المحرّك تيارًا عند إقلاعه فتنفصل L2. حادث، لا لعنة.', 'Le moteur appelle trop de courant au démarrage et L2 saute. Un accident, pas une malédiction.', 'The motor draws a surge on start and L2 trips. An accident, not a curse.'),
      hints: [
        L('كل مرة طفا الضو، كان الناقوس كيضرب. شنو كيربط بيناتهم فالحيوط؟', 'كلّما انطفأت الأضواء كان الجرس يقرع. ما الذي يصل بينهما داخل الجدران؟', 'Chaque coupure tombe avec la cloche. Qu’est-ce qui les relie dans les murs ?', 'Every blackout came with the bell. What connects them inside the walls?'),
        L('ورقة التركيب كتقول فين تربط الموتور. الكابل ديال الموتور عليه نفس الرمز.', 'ورقة الإعداد تقول أين وُصل المحرّك، وكابله يحمل الرمز نفسه.', 'La fiche de montage dit où est branché le moteur, et son câble porte le même repère.', 'The setup sheet says where the motor is wired, and its cable carries the same label.'),
        L('الضو والموتور بجوج على L2. الموتور كيطيّح L2 فاش كيبدا.', 'الأضواء والمحرّك على L2، والمحرّك يفصل L2 عند إقلاعه.', 'Guirlandes et moteur sont sur L2, et le moteur fait sauter L2 en démarrant.', 'The lights and the motor are both on L2, and the motor trips L2 when it starts.'),
      ],
    },
  },

  deductions: [
    {
      id: 'd_early', pair: ['schedule', 'powerlog'], essential: true,
      text: L('الناقوس ضرب 17 دقيقة قبل الوقت، مع 19:43 و21:43.', 'قرع الجرس قبل موعده بسبع عشرة دقيقة، عند 19:43 و21:43.', 'La cloche a sonné 17 minutes trop tôt, à 19 h 43 et 21 h 43.', 'The bell rang 17 minutes early, at 19:43 and 21:43.'),
    },
    {
      id: 'd_tradition', pair: ['procedure', 'youssef'], essential: true,
      text: L('«الجمهور اللي تجمّد» كان كيتبع الإشارة ديال الموكب القديم.', 'كان «الجمهور المتجمّد» يتّبع إشارة الموكب القديم.', 'La foule « figée » suivait le signal de l’ancienne procession.', 'The “frozen” crowd was following the old procession cue.'),
    },
    {
      id: 'd_circuit', pair: ['config', 'powerlog'], essential: true,
      text: L('كل تقطيع كان من الموتور اللي كيطيّح الدائرة المشتركة.', 'كلّ انقطاع سببه المحرّك الذي يفصل الدائرة المشتركة.', 'Chaque coupure venait du moteur qui faisait sauter le circuit partagé.', 'Each blackout was the bell motor tripping the shared circuit.'),
    },
    {
      id: 'd_card', pair: ['ledger', 'timercard'], essential: true,
      text: L('أديلا تسلّفات الكارطة ديال 1987 وحطّاتها فالماكينة — بالعاني.', 'استعارت أديلا بطاقة 1987 ووضعتها في المؤقّت عمدًا.', 'Adela a emprunté la carte de 1987 et l’a placée dans la minuterie — délibérément.', 'Adela borrowed the 1987 card and set it in the timer — on purpose.'),
    },
    {
      id: 'd_ribbon', pair: ['ribbon', 'ledger'],
      text: L('الشريط جا من الصندوق اللي تسلّفات أديلا.', 'الشريط من الصندوق الذي استعارته أديلا.', 'Le ruban vient de la boîte empruntée par Adela.', 'The ribbon came from the box Adela borrowed.'),
    },
    {
      id: 'd_midnight', pair: ['rumor_spirit', 'complaints'],
      text: L('حتى واحد ما بلّغ على ناقوس مع الطناش. الإشاعة غلط.', 'لم يبلّغ أحد عن جرس عند منتصف الليل. الإشاعة باطلة.', 'Personne n’a signalé de cloche à minuit. La rumeur est fausse.', 'Nobody reported a midnight bell. The rumour is false.'),
    },
    {
      id: 'd_1313', pair: ['complaints', 'timercard'],
      text: L('ضربة 23:13 ما كايناش فالكارطة، وما طفاش معاها الضو. ماشي الماكينة، وماشي الموتور.', 'ضربة 23:13 ليست في البطاقة، ولم تنطفئ معها الأضواء. لا المؤقّت ولا المحرّك.', 'Le coup de 23 h 13 n’est pas sur la carte et n’a rien coupé. Ni la minuterie, ni le moteur.', 'The 23:13 strike isn’t on the card and caused no blackout. Not the timer, not the motor.'),
    },
  ],
  contradictions: [
    { id: 'c_time', pair: ['schedule', 'youssef'], resolvedBy: 'd_early' },
    { id: 'c_midnight', pair: ['rumor_spirit', 'nadia2'], resolvedBy: 'd_midnight' },
    { id: 'c_1313', pair: ['complaints', 'timercard'], resolvedBy: 'd_1313' },
  ],

  objectives: [
    {
      id: 'o_square', done: { all: [{ clue: 'schedule' }, { clue: 'youssef' }] },
      text: L('سمع للساحة: شنو كان مبرمج، وشنو وقع بصح؟', 'أصغِ إلى الساحة: ما المبرمج، وما الذي حدث فعلًا؟', 'Écoutez la place : qu’était-il prévu, que s’est-il vraiment passé ?', 'Listen to the square: what was planned, and what actually happened?'),
    },
    {
      id: 'o_time', when: { clue: 'schedule' }, done: { puzzle: 'h_offset' },
      text: L('لقا وقت حقيقي باش تقارن مع الصومعة.', 'جد وقتًا حقيقيًا لتقارنه بالبرج.', 'Trouvez une heure fiable pour la comparer à la tour.', 'Find a trustworthy time to compare against the tower.'),
    },
    {
      id: 'o_elders', when: { clue: 'youssef' }, done: { clue: 'procedure' },
      text: L('علاش الشيوخ عرفو شنو يديرو؟ قلّب فالماضي.', 'لماذا عرف الكبار ما يفعلون؟ ابحث في الماضي.', 'Pourquoi les anciens savaient-ils quoi faire ? Fouillez le passé.', 'Why did the elders know what to do? Dig into the past.'),
    },
    {
      id: 'o_claims', when: { clue: 'rumor_spirit' }, done: { puzzle: 'h_claims' },
      text: L('فرّق بين داكشي اللي تبت وداكشي اللي كيتعاود.', 'ميّز بين ما ثبت وما يُروى.', 'Séparez ce qui est prouvé de ce qui se raconte.', 'Separate what’s proven from what’s being said.'),
    },
    {
      id: 'o_garden', when: { clue: 'procedure' }, done: { puzzle: 'h_gate' },
      text: L('لقا فين كان كيبدا الموكب.', 'اعثر على منطلق الموكب.', 'Trouvez d’où partait la procession.', 'Find where the procession used to begin.'),
    },
    {
      id: 'o_service', when: { puzzle: 'h_gate' }, done: { flag: 'service_open' },
      text: L('هبط لبيت الخدمة تحت الساحة.', 'انزل إلى غرفة الخدمات تحت الساحة.', 'Descendez au local technique sous la place.', 'Get down into the service room under the square.'),
    },
    {
      id: 'o_cause', when: { flag: 'service_open' }, done: { all: [{ puzzle: 'h_cause' }, { clue: 'timercard' }] },
      text: L('فرّق بين الحادث والفعل المقصود.', 'ميّز بين الحادث والفعل المتعمّد.', 'Distinguez l’accident de l’acte délibéré.', 'Tell the accident apart from the deliberate act.'),
    },
    {
      id: 'o_board', when: { clue: 'timercard' }, done: { all: [{ deduction: 'd_early' }, { deduction: 'd_tradition' }, { deduction: 'd_circuit' }, { deduction: 'd_card' }] },
      text: L('ربط الأدلة فاللوحة.', 'اربط الأدلة على اللوحة.', 'Reliez les preuves sur le tableau.', 'Connect the evidence on the board.'),
    },
    {
      id: 'o_final', when: { all: [{ puzzle: 'h_cause' }, { clue: 'timercard' }] }, done: { flag: '__never__' },
      text: L('قدّم الخلاصة ديالك.', 'قدّم استنتاجك.', 'Présentez votre conclusion.', 'Present your conclusion.'),
    },
  ],

  final: {
    requires: { all: [{ puzzle: 'h_cause' }, { clue: 'timercard' }, { puzzle: 'h_offset' }] },
    essentialDeductions: ['d_early', 'd_tradition', 'd_circuit', 'd_card'],
    questions: [
      {
        id: 'q_sync', type: 'choice', core: true,
        prompt: L('علاش الناس تحرّكو بحال واحد؟', 'لماذا تحرّك الناس كأنهم شخص واحد؟', 'Pourquoi la foule a-t-elle agi comme un seul corps ?', 'Why did people act in unison?'),
        options: [
          { id: 'tradition', text: L('الشيوخ عرفو الإشارة ديال الموكب القديم، والزوار تبعوهم', 'عرف الكبار إشارة الموكب القديم فقلّدهم الزوّار', 'Les anciens ont reconnu le signal de la procession ; les visiteurs ont suivi', 'The elders recognised the old procession cue; visitors copied them') },
          { id: 'hysteria', text: L('خوف جماعي', 'هلع جماعي', 'Une hystérie collective', 'Mass hysteria') },
          { id: 'spirit', text: L('شي روح كتحكم فيهم بالناقوس', 'روح تتحكّم بهم عبر الجرس', 'Un esprit les commandait par la cloche', 'A spirit controlled them through the bell') },
          { id: 'prank', text: L('ضحكة منظّمة ديال الدراري', 'مزحة منظّمة من المراهقين', 'Une farce organisée par des ados', 'An organised prank by teenagers') },
        ],
        answer: 'tradition',
      },
      {
        id: 'q_bell', type: 'choice', core: true,
        prompt: L('علاش الناقوس ضرب فوقت غلط؟', 'لماذا قرع الجرس في غير موعده؟', 'Pourquoi la cloche sonnait-elle à contretemps ?', 'Why did the bell ring at the wrong times?'),
        options: [
          { id: 'card', text: L('كارطة 1987 فالماكينة، والساعة قدّام 17 دقيقة', 'بطاقة 1987 في المؤقّت، والساعة متقدّمة 17 دقيقة', 'La carte de 1987 dans la minuterie, et une horloge en avance de 17 minutes', 'The 1987 card in the timer, and a clock 17 minutes fast') },
          { id: 'hand', text: L('شي واحد كان كيضرب باليد', 'كان أحدهم يقرعه باليد', 'Quelqu’un sonnait à la main', 'Someone rang it by hand') },
          { id: 'surge', text: L('الضو كان كيطلع وينزل', 'تذبذب التيار الكهربائي', 'Des surtensions électriques', 'Power surges') },
          { id: 'broken', text: L('الماكينة مخسّرة', 'الآلية معطّلة', 'Un mécanisme cassé', 'A broken mechanism') },
        ],
        answer: 'card',
      },
      {
        id: 'q_lights', type: 'choice',
        prompt: L('شنو اللي طفا الضو؟', 'ما الذي أطفأ الأضواء؟', 'Qu’est-ce qui a coupé la lumière ?', 'What caused the blackouts?'),
        options: [
          { id: 'shared', text: L('الموتور والضو على نفس الدائرة', 'المحرّك والأضواء على الدائرة نفسها', 'Moteur et lumières sur le même circuit', 'Motor and lights on the same circuit') },
          { id: 'sabotage', text: L('تخريب', 'تخريب', 'Un sabotage', 'Sabotage') },
          { id: 'grid', text: L('الشبكة ديال المدينة', 'شبكة البلدة', 'Le réseau de la ville', 'The town grid') },
        ],
        answer: 'shared',
      },
      {
        id: 'q_deliberate', type: 'choice',
        prompt: L('أشمن حاجة كانت مقصودة؟', 'ما الفعل الذي كان متعمّدًا؟', 'Quel geste était délibéré ?', 'Which act was deliberate?'),
        options: [
          { id: 'adela', text: L('أديلا حطّات الكارطة القديمة', 'وضعت أديلا البطاقة القديمة', 'Adela a inséré l’ancienne carte', 'Adela setting the old card') },
          { id: 'sami', text: L('سامي ركّب الضو والموتور مع بعض', 'جمع سامي الأضواء والمحرّك', 'Sami a branché lumières et moteur ensemble', 'Sami wiring lights and motor together') },
          { id: 'storm', text: L('الساعة اللي كتزيد', 'الساعة المتقدّمة', 'L’horloge qui avance', 'The clock running fast') },
        ],
        answer: 'adela',
      },
      {
        id: 'q_rumor', type: 'choice',
        prompt: L('أشمن ادعاء كتكذّبو الأدلة؟', 'أيّ ادعاء تدحضه الأدلة؟', 'Quelle affirmation les preuves démentent-elles ?', 'Which claim does the evidence disprove?'),
        options: [
          { id: 'midnight', text: L('«الناقوس ضرب مع الطناش بوحدو»', '«قرع الجرس وحده عند منتصف الليل»', '« La cloche a sonné seule à minuit »', '“The bell rang by itself at midnight”') },
          { id: 'early', text: L('«الناقوس ضرب مع 19:43»', '«قرع الجرس عند 19:43»', '« La cloche a sonné à 19 h 43 »', '“The bell rang at 19:43”') },
          { id: 'froze', text: L('«الشيوخ وقفو فبلاصتهم»', '«توقّف الكبار في أماكنهم»', '« Les anciens se sont figés »', '“The elders stood still”') },
        ],
        answer: 'midnight',
      },
      {
        id: 'q_evidence', type: 'evidence',
        prompt: L('ختار الأدلة اللي كتسند الخلاصة ديالك.', 'اختر الأدلة التي تسند استنتاجك.', 'Choisissez les preuves qui soutiennent votre conclusion.', 'Choose the evidence that supports your conclusion.'),
        required: ['powerlog', 'procedure', 'config', 'ledger', 'timercard'],
      },
      {
        id: 'q_open', type: 'choice',
        prompt: L('شنو باقي مفتوح؟', 'ما الذي يبقى مفتوحًا؟', 'Qu’est-ce qui reste ouvert ?', 'What remains open?'),
        options: [
          { id: 'strike', text: L('الضربة ديال 23:13', 'ضربة 23:13', 'Le coup de 23 h 13', 'The 23:13 strike') },
          { id: 'cardwho', text: L('شكون بدّل الكارطة', 'من بدّل البطاقة', 'Qui a changé la carte', 'Who changed the card') },
          { id: 'lightswhy', text: L('علاش طفا الضو', 'لماذا انطفأت الأضواء', 'Pourquoi la lumière tombait', 'Why the lights failed') },
        ],
        answer: 'strike',
      },
    ],
    hints: [
      L('فهاد القضية، جوج حكايات كيتلاقاو فنفس الدقيقة: واحد قديم، وواحد كهربائي.', 'في هذه القضية حكايتان تلتقيان في الدقيقة نفسها: واحدة قديمة وأخرى كهربائية.', 'Ici, deux histoires se croisent à la même minute : une ancienne, une électrique.', 'Two stories meet at the same minute here: an old one and an electrical one.'),
      L('الناس تبعو النظام ديال 1987؛ الضو طاح بسبب L2. شكون حطّ الكارطة؟ الكناش كيعرف.', 'تبع الناس إجراء 1987، والأضواء سقطت بسبب L2. من وضع البطاقة؟ السجلّ يعرف.', 'La foule suivait 1987 ; la lumière tombait à cause de L2. Qui a posé la carte ? Le registre le sait.', 'The crowd followed 1987; the lights fell because of L2. Who set the card? The ledger knows.'),
      L('اللي مقصود: الكارطة (أديلا). اللي حادث: L2 والساعة. اللي غلط: الطناش. واللي باقي: 23:13.', 'المتعمّد: البطاقة (أديلا). العارض: L2 والساعة. الباطل: منتصف الليل. والمفتوح: 23:13.', 'Délibéré : la carte (Adela). Accidentel : L2 et l’horloge. Faux : minuit. Ouvert : 23 h 13.', 'Deliberate: the card (Adela). Accidental: L2 and the clock. False: midnight. Open: 23:13.'),
    ],
  },

  endings: {
    strong: {
      title: L('الموكب رجع', 'عاد الموكب', 'La procession revient', 'The procession returns'),
      text: L(
        'أديلا اعترفات بلا ما تحني راسها: «بغيت غير يتفكّرو.» سامي غادي يفرّق الدوائر قبل الصباح. واللجنة صوّتات: العام الجاي، الموكب غادي يرجع — بالعلم ديال الناس كاملين، وبساعة مضبوطة.',
        'اعترفت أديلا دون أن تخفض رأسها: «أردت فقط أن يتذكّروا.» سيفصل سامي الدوائر قبل الصباح. وصوّتت اللجنة: سيعود الموكب في العام المقبل، علنًا، وبساعة مضبوطة.',
        'Adela avoue sans baisser la tête : « Je voulais seulement qu’ils se souviennent. » Sami séparera les circuits avant l’aube. Le comité a voté : la procession reviendra l’an prochain — au grand jour, et à l’heure.',
        'Adela admits it without lowering her head: “I only wanted them to remember.” Sami will separate the circuits before dawn. The committee has voted: the procession returns next year — openly, and on time.',
      ),
    },
    partial: {
      title: L('الساحة هدات', 'هدأت الساحة', 'La place s’apaise', 'The square calms down'),
      text: L(
        'الناس فهمو بلي ماشي لعنة، ولكن شي خيوط باقي مخلطين: شكون دار شنو، وعلاش.',
        'فهم الناس أنها ليست لعنة، لكن بعض الخيوط ما تزال متشابكة: من فعل ماذا، ولماذا.',
        'On a compris que ce n’était pas une malédiction, mais des fils restent emmêlés : qui a fait quoi, et pourquoi.',
        'People understand it wasn’t a curse, but some threads are still tangled: who did what, and why.',
      ),
    },
    incomplete: {
      title: L('الناقوس باقي كيضرب فالراس', 'ما يزال الجرس يدقّ في الرؤوس', 'La cloche sonne encore dans les têtes', 'The bell still rings in people’s heads'),
      text: L('الخلاصة ديالك ما كتصمدش قدّام السجلات. رجع للساحة.', 'استنتاجك لا يصمد أمام السجلات. عُد إلى الساحة.', 'Votre conclusion ne résiste pas aux relevés. Retournez sur la place.', 'Your conclusion doesn’t stand up to the records. Go back to the square.'),
    },
  },
  uncertainty: L(
    'مع 23:13 ضرب الناقوس مرة وحدة. ما كايناش فالكارطة، والضو ما طاحش. فوق، فالغبرة ديال الذراع، آثار صغار مدوّرين.',
    'عند 23:13 قرع الجرس مرة واحدة. ليست في البطاقة، ولم تنقطع الكهرباء. وفي الأعلى، في غبار الذراع، آثار صغيرة مستديرة.',
    'À 23 h 13, la cloche a sonné une fois. Pas sur la carte, pas de coupure. Là-haut, dans la poussière du levier, de petites empreintes rondes.',
    'At 23:13 the bell rang once. Not on the card, no blackout. Up above, in the dust on the lever, small rounded prints.',
  ),
  noctaviae: {
    ending: L(
      '23:13؟ كاين ناقوس ما كيحتاجش لكارطة. خليه يبقى سؤال — الأسئلة كتعيش كثر.',
      '23:13؟ بعض الأجراس لا تحتاج بطاقة. دعه سؤالًا، فالأسئلة تعيش أطول.',
      '23 h 13 ? Certaines cloches n’ont pas besoin de carte. Laissez-la rester une question — les questions vivent plus longtemps.',
      '23:13? Some bells need no card. Let it stay a question — questions live longer.',
    ),
  },
  facts: [
    { clue: 'powerlog', text: L('الناقوس ضرب مع 19:43 و21:43، والضو طاح معاه.', 'قرع الجرس عند 19:43 و21:43، وانقطعت معه الكهرباء.', 'La cloche a sonné à 19 h 43 et 21 h 43, et la lumière est tombée avec.', 'The bell rang at 19:43 and 21:43, and the power dropped with it.') },
    { clue: 'procedure', text: L('الوقفة الجماعية هي الإشارة ديال موكب 1987.', 'الوقوف الجماعي هو إشارة موكب 1987.', 'L’immobilité collective est le signal de la procession de 1987.', 'The collective freeze is the 1987 procession cue.') },
    { clue: 'config', text: L('الموتور والضو على L2: حادث تقني.', 'المحرّك والأضواء على L2: حادث تقني.', 'Moteur et lumières sur L2 : un accident technique.', 'Motor and lights on L2: a technical accident.') },
    { clue: 'ledger', text: L('أديلا تسلّفات الكارطة ديال 1987.', 'استعارت أديلا بطاقة 1987.', 'Adela a emprunté la carte de 1987.', 'Adela borrowed the 1987 card.') },
    { clue: 'complaints', text: L('حتى ناقوس ما ضرب مع الطناش.', 'لم يقرع أيّ جرس عند منتصف الليل.', 'Aucune cloche n’a sonné à minuit.', 'No bell rang at midnight.') },
  ],

  walkthrough: [
    ['visit', 'square'], ['interact', 'sq_board'], ['interact', 'sq_vendor'], ['interact', 'sq_flyer'], ['interact', 'sq_scarecrow'],
    ['visit', 'market'], ['interact', 'mk_ups'], ['interact', 'mk_cashier'],
    ['visit', 'clocktower'], ['interact', 'ct_tag'], ['interact', 'ct_motor'], ['interact', 'ct_ribbon'], ['interact', 'ct_lever'], ['solve', 'h_offset', '17'],
    ['visit', 'archive'], ['interact', 'ar_procedure'], ['interact', 'ar_ledger'], ['interact', 'ar_photo'], ['solve', 'h_gate', '1987'],
    ['visit', 'police'], ['interact', 'pc_log'], ['solve', 'h_claims', { s_times: 'verified', s_lights: 'verified', s_elders: 'interpretation', s_midnight: 'rumor', s_obey: 'rumor' }],
    ['visit', 'garden'], ['interact', 'gd_shed'], ['interact', 'gd_lanterns'],
    ['visit', 'square'], ['use', 'servicekey', 'sq_hatch'],
    ['visit', 'service'], ['interact', 'sr_timer'], ['interact', 'sr_sheet'], ['solve', 'h_cause', 'shared'],
    ['connect', 'schedule', 'powerlog'], ['connect', 'procedure', 'youssef'], ['connect', 'config', 'powerlog'], ['connect', 'ledger', 'timercard'],
    ['connect', 'ribbon', 'ledger'], ['connect', 'rumor_spirit', 'complaints'], ['connect', 'complaints', 'timercard'],
    ['final', { q_sync: 'tradition', q_bell: 'card', q_lights: 'shared', q_deliberate: 'adela', q_rumor: 'midnight', q_evidence: ['powerlog', 'procedure', 'config', 'ledger', 'timercard'], q_open: 'strike' }],
  ],
};
