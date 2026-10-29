import { L } from '../core/i18n.js';

// ═══════════════════════════════════════════════════════════════════════════
// CASE C — THE HOUSE WITH NO ADDRESS
// ═══════════════════════════════════════════════════════════════════════════
export const bible = {
  truth:
    'No. 7 Weavers’ Lane, built 1921 by architect Ilyas Marrow (lintel “I.M. 1921”, round window, crescent ' +
    'weathervane), stands behind the hedges of today’s 15 Linden Street. In 1968 the town planned a road through ' +
    'Weavers’ Lane; demolition order 68/14 withdrew the address of No. 7 and the lane was merged into Linden Street ' +
    'and renumbered. In 1969 the road project was abandoned and the demolition orders annulled — but the registry ' +
    'was never corrected. Marrow received the annulment letter and chose not to forward it: an unlisted house was ' +
    'left alone. The 1970 map therefore shows no house between 13 and 15. The house was never demolished.',
  initialBelief: 'Either the house never existed, or it was demolished and people misremember it.',
  characters: {
    haddad: 'Old resident; remembers the lane being renamed and the road that never came.',
    clerk: 'Registry clerk (1968), only through documents.',
    marrow: 'Owner; kept the annulment letter and stayed silent.',
    archivist: 'Idris; provides maps and the registry.',
  },
  verified: ['map1955', 'map1970', 'registry', 'clipping', 'photo', 'plate', 'letter', 'decree'],
  claims: ['haddad', 'neverexisted'],
  chronology: [
    ['1921', 'House built by I. Marrow (photo, lintel)'],
    ['1955', 'Map shows No. 7 Weavers’ Lane (map1955)'],
    ['1968', 'Road plan; order 68/14 withdraws the address; lane merged into Linden St and renumbered (registry, decree)'],
    ['1969', 'Road abandoned, orders annulled (clipping, letter)'],
    ['1970', 'New map: no house between 13 and 15 (map1970)'],
  ],
  theories: {
    neverExisted: { contradictedBy: ['map1955', 'photo', 'plate', 'registry'] },
    demolished: { contradictedBy: ['clipping', 'letter', 'weathervane'] },
    bureaucracy: { supportedBy: ['registry', 'decree', 'clipping', 'letter', 'map1970'] },
  },
  unresolved: 'Why Marrow chose silence for the rest of his life is only half explained by his note.',
};

export default {
  id: 'house',
  num: '03',
  motif: 'house',
  accent: 'moss',
  bible,
  title: L('الدار اللي بلا عنوان', 'البيت الذي بلا عنوان', 'La Maison sans adresse', 'The House with No Address'),
  teaser: L(
    'دار كاينة فالتصاور والخرايط القديمة، ومحيّدة من السجلات. شكون اللي مسحها؟',
    'بيت يظهر في الصور والخرائط القديمة، ويغيب عن السجلات. من محاه؟',
    'Une maison présente sur les vieilles photos et cartes, absente des registres. Qui l’a effacée ?',
    'A house in old photographs and maps, missing from every register. Who erased it?',
  ),
  radio: {
    freq: '98.7',
    lines: [
      L('راديو هولومير، «أسئلة المستمعين»… السؤال ديال الليلة جا فبرية بلا طابع.', 'إذاعة هولومير، «أسئلة المستمعين»… سؤال الليلة وصل في رسالة بلا طابع.', 'Radio Hollowmere, « Questions d’auditeurs »… la question du soir est arrivée dans une lettre sans timbre.', 'Radio Hollowmere, “Listeners’ Questions”… tonight’s question came in a letter with no stamp.'),
      L('«فين مشات الدار رقم 7؟» داخلها تصويرة: دار بشرجم مدوّر، وفوقها هلال من حديد.', '«أين ذهب البيت رقم 7؟» وفي داخلها صورة: بيت بنافذة مستديرة، وفوقه هلال من حديد.', '« Où est passée la maison n° 7 ? » Avec une photo : une fenêtre ronde, un croissant de fer sur le toit.', '“Where did house number 7 go?” Inside, a photograph: a round window, an iron crescent on the roof.'),
      L('البلدية كتقول: هاد العنوان ما كاينش. عمرو ما كان.', 'تقول البلدية: هذا العنوان غير موجود، ولم يوجد قط.', 'La mairie répond : cette adresse n’existe pas. Elle n’a jamais existé.', 'The town hall says: that address does not exist. It never did.'),
      L('ولكن جدّاتنا كيتفكّرو زنقة، ودار، وناس كانو ساكنين فيها.', 'لكن جدّاتنا يتذكّرن زقاقًا، وبيتًا، وأناسًا سكنوه.', 'Pourtant nos grands-mères se souviennent d’une ruelle, d’une maison, et de ceux qui y vivaient.', 'Yet our grandmothers remember a lane, a house, and the people who lived there.'),
      L('إلا شي واحد كيعرف فين كاينة… [تشويش]', 'إن كان أحد يعرف أين هي… [تشويش]', 'Si quelqu’un sait où elle se trouve… [grésillements]', 'If anyone knows where it stands… [static]'),
    ],
  },
  reveal: L(
    'هولومير، 31 أكتوبر. فشي بلاصة بين جوج ديال الأرقام، دار كتسنى.',
    'هولومير، 31 أكتوبر. في مكان ما بين رقمين، بيت ينتظر.',
    'Hollowmere, 31 octobre. Quelque part entre deux numéros, une maison attend.',
    'Hollowmere, 31 October. Somewhere between two numbers, a house is waiting.',
  ),
  start: 'archive',

  locations: [
    {
      id: 'archive', scene: 'archive', map: [18, 18],
      name: L('أرشيف البلدية', 'الأرشيف البلدي', 'Archives municipales', 'Municipal archive'),
      desc: L('خرايط ملويين ودفاتر ديال الملكية. إدريس كيتسناك.', 'خرائط ملفوفة ودفاتر ملكية. إدريس ينتظرك.', 'Cartes roulées et registres fonciers. Idris vous attend.', 'Rolled maps and property registers. Idris is expecting you.'),
    },
    {
      id: 'square', scene: 'square', map: [44, 40],
      name: L('الساحة العمومية', 'الساحة العامة', 'La place publique', 'Public square'),
      desc: L('الشيوخ جالسين على البنك ديال العادة.', 'الشيوخ جالسون على مقعدهم المعتاد.', 'Les anciens occupent leur banc habituel.', 'The old men sit on their usual bench.'),
    },
    {
      id: 'newspaper', scene: 'newsroom', map: [74, 18],
      name: L('الجريدة', 'مكتب الجريدة', 'Le journal', 'Newspaper office'),
      desc: L('الأرشيف ديال الكوريي مخبّي فالقبو.', 'أرشيف «الكورييه» محفوظ في القبو.', 'Les archives du Courrier dorment au sous-sol.', 'The Courier’s archive sleeps in the basement.'),
    },
    {
      id: 'street', scene: 'street', map: [80, 48], unlock: { puzzle: 'c_maps' },
      name: L('زنقة الزيزفون', 'شارع الزيزفون', 'Rue des Tilleuls', 'Linden Street'),
      desc: L('ديور قدام، أرقام جداد. كاين شي حاجة ما مركّباش.', 'بيوت قديمة وأرقام جديدة. شيء ما لا يستقيم.', 'Vieilles maisons, numéros neufs. Quelque chose cloche.', 'Old houses, new numbers. Something doesn’t add up.'),
    },
    {
      id: 'garden', scene: 'garden', map: [58, 66], unlock: { puzzle: 'c_photo' },
      name: L('الجردة', 'الحديقة', 'Le jardin', 'Garden'),
      desc: L('ممر ضيّق ورا الشجر. الحيط مغطّي بالعرش.', 'ممرّ ضيّق خلف السياج. الجدار مغطّى باللبلاب.', 'Un passage étroit derrière la haie. Le mur disparaît sous le lierre.', 'A narrow passage behind the hedge. The wall is lost under ivy.'),
    },
    {
      id: 'house', scene: 'house', map: [84, 82], unlock: { puzzle: 'c_word' },
      name: L('الدار المهجورة', 'البيت المهجور', 'La maison abandonnée', 'Abandoned house'),
      desc: L('الغبرة، والضو داخل من الشرجم المدوّر.', 'غبار، وضوء يدخل من النافذة المستديرة.', 'De la poussière, et la lumière qui tombe de la fenêtre ronde.', 'Dust, and light falling through the round window.'),
    },
    {
      id: 'hidden', scene: 'hidden', map: [34, 84], unlock: { flag: 'shelf_open' },
      name: L('البيت المخبية', 'الغرفة المخفية', 'La pièce cachée', 'Hidden room'),
      desc: L('مكتب صغير، شمعة مطفية، ورسائل مربوطة بخيط.', 'مكتب صغير وشمعة مطفأة ورسائل مربوطة بخيط.', 'Un petit bureau, une bougie éteinte, des lettres nouées.', 'A small study, a dead candle, letters tied with string.'),
    },
  ],

  items: {
    crescent: {
      icon: 'crescent',
      name: L('هلال من النحاس', 'هلال نحاسي', 'Croissant de laiton', 'Brass crescent'),
      desc: L('قطعة ثقيلة على شكل هلال، بحال اللي فوق السطح.', 'قطعة ثقيلة على شكل هلال، كالتي فوق السطح.', 'Une pièce lourde en forme de croissant, comme celle du toit.', 'A heavy crescent-shaped piece, like the one on the roof.'),
      misfit: L('ما عندو فين يدخل هنا.', 'لا مكان له هنا.', 'Il n’a pas sa place ici.', 'There’s nowhere for it here.'),
    },
  },

  clues: {
    map1955: {
      kind: 'document', status: 'verified', from: 'archive',
      title: L('خريطة 1955', 'خريطة 1955', 'Plan de 1955', '1955 map'),
      body: L(
        'زنقة الدرّازة: 1، 3، 5، 7، 9.\nالرقم 7 مرسوم بدائرة صغيرة فوق السطح: الريحية.\nزنقة الدرّازة كتلاقى مع زنقة الزيزفون عند البير.',
        'زقاق النسّاجين: 1، 3، 5، 7، 9.\nالرقم 7 مرسوم بدائرة صغيرة فوق السطح: دوّارة الريح.\nيلتقي زقاق النسّاجين بشارع الزيزفون عند البئر.',
        'Rue des Tisserands : 1, 3, 5, 7, 9.\nLe n° 7 porte un petit rond sur le toit : la girouette.\nLa rue des Tisserands rejoint la rue des Tilleuls au puits.',
        'Weavers’ Lane: 1, 3, 5, 7, 9.\nNo. 7 has a small circle drawn on its roof: the weathervane.\nWeavers’ Lane meets Linden Street at the well.',
      ),
    },
    map1970: {
      kind: 'document', status: 'verified', from: 'archive',
      title: L('خريطة 1970', 'خريطة 1970', 'Plan de 1970', '1970 map'),
      body: L(
        'زنقة الزيزفون: …، 11، 13، 15، 17.\nزنقة الدرّازة ما بقاتش. البير باقي.\nبين 13 و15: بلاصة خاوية مكتوب عليها «جردة».',
        'شارع الزيزفون: …، 11، 13، 15، 17.\nلم يعد زقاق النسّاجين موجودًا. البئر باقية.\nبين 13 و15: فراغ مكتوب عليه «حديقة».',
        'Rue des Tilleuls : …, 11, 13, 15, 17.\nLa rue des Tisserands a disparu. Le puits est toujours là.\nEntre 13 et 15 : un blanc marqué « jardin ».',
        'Linden Street: …, 11, 13, 15, 17.\nWeavers’ Lane is gone. The well remains.\nBetween 13 and 15: a blank marked “garden”.',
      ),
    },
    decree: {
      kind: 'document', status: 'verified', from: 'archive',
      title: L('قرار 1968', 'قرار 1968', 'Arrêté de 1968', '1968 decree'),
      body: L(
        'زنقة الدرّازة كتدخل فزنقة الزيزفون. الأرقام كتعاود: 1 ← 9، 3 ← 11، 5 ← 13، 9 ← 17.\nالرقم 7: «ما عندوش رقم جديد — قرار الهدم 68/14».',
        'يُضمّ زقاق النسّاجين إلى شارع الزيزفون. إعادة الترقيم: 1 ← 9، 3 ← 11، 5 ← 13، 9 ← 17.\nالرقم 7: «بلا رقم جديد — أمر الهدم 68/14».',
        'La rue des Tisserands est rattachée à la rue des Tilleuls. Renumérotation : 1 → 9, 3 → 11, 5 → 13, 9 → 17.\nN° 7 : « pas de nouveau numéro — arrêté de démolition 68/14 ».',
        'Weavers’ Lane is merged into Linden Street. Renumbering: 1 → 9, 3 → 11, 5 → 13, 9 → 17.\nNo. 7: “no new number — demolition order 68/14”.',
      ),
    },
    registry: {
      kind: 'record', status: 'verified', from: 'archive',
      title: L('سجل الملكية', 'سجلّ الملكية', 'Registre foncier', 'Property register'),
      body: L(
        '7، زنقة الدرّازة — المالك: إ. م[...]\nتبنات: 1921\n1968: «العنوان تحيّد في انتظار الهدم (68/14)».\nمن بعد: حتى سطر.',
        '7، زقاق النسّاجين — المالك: إ. م[...]\nسنة البناء: 1921\n1968: «سُحب العنوان في انتظار الهدم (68/14)».\nبعد ذلك: لا شيء.',
        '7, rue des Tisserands — propriétaire : I. M[…]\nConstruite : 1921\n1968 : « adresse retirée dans l’attente de la démolition (68/14) ».\nEnsuite : rien.',
        '7 Weavers’ Lane — owner: I. M[…]\nBuilt: 1921\n1968: “address withdrawn pending demolition (68/14)”.\nAfter that: nothing.',
      ),
    },
    neverexisted: {
      kind: 'rumor', status: 'rumor', from: 'archive',
      title: L('ورقة البلدية', 'ردّ البلدية', 'Réponse de la mairie', 'Town hall reply'),
      body: L(
        '«ما كاين حتى عنوان «7 زنقة الدرّازة» فالسجلات الحالية. هاد الدار عمرها ما كانت.»',
        '«لا يوجد عنوان «7 زقاق النسّاجين» في السجلات الحالية. هذا البيت لم يوجد قط.»',
        '« Aucune adresse « 7, rue des Tisserands » dans les registres actuels. Cette maison n’a jamais existé. »',
        '“There is no address ‘7 Weavers’ Lane’ in current records. This house never existed.”',
      ),
    },
    haddad: {
      kind: 'statement', status: 'unverified', from: 'square',
      title: L('شهادة سي حداد', 'شهادة السيد حدّاد', 'Témoignage de M. Haddad', 'Mr Haddad’s statement'),
      body: L(
        '«زنقة الدرّازة؟ بدّلو ليها السمية وأنا صغير. قالو غادي يدوّزو طريق كبيرة، ويطيّحو الديور. الطريق عمرها ما جات. مول الرقم 7 كان مهندس، كيرسم الفنارات ديال الحديد. ما بقيتش شفتو.»',
        '«زقاق النسّاجين؟ غيّروا اسمه وأنا صغير. قالوا إنهم سيشقّون طريقًا كبيرًا ويهدمون البيوت. لم يأتِ الطريق قط. صاحب الرقم 7 كان مهندسًا يرسم الفوانيس الحديدية. لم أعد أراه.»',
        '« La rue des Tisserands ? Rebaptisée quand j’étais petit. On parlait d’une grande route, de maisons rasées. La route n’est jamais venue. Le propriétaire du 7 était architecte, il dessinait des ferronneries. Je ne l’ai plus revu. »',
        '“Weavers’ Lane? They renamed it when I was a boy. They talked of a big road and knocking houses down. The road never came. The owner of No. 7 was an architect, drew ironwork. I never saw him again.”',
      ),
    },
    clipping: {
      kind: 'document', status: 'verified', from: 'newspaper',
      title: L('قصاصة ديال 1969', 'قصاصة 1969', 'Coupure de 1969', '1969 clipping'),
      body: L(
        '«الطريق ديال الزيزفون تلغات» — الكوريي، 12 مارس 1969\nالمجلس لغى المشروع. «جميع قرارات الهدم المرتبطة بيه ملغية.»\nما كاين حتى كلمة على الأرقام.',
        '«إلغاء طريق الزيزفون» — الكورييه، 12 مارس 1969\nألغى المجلس المشروع. «جميع أوامر الهدم المرتبطة به ملغاة.»\nلا كلمة عن الأرقام.',
        '« La route des Tilleuls abandonnée » — Le Courrier, 12 mars 1969\nLe conseil renonce au projet. « Tous les arrêtés de démolition liés sont annulés. »\nPas un mot sur les numéros.',
        '“Linden road abandoned” — The Courier, 12 March 1969\nThe council drops the project. “All related demolition orders are annulled.”\nNot a word about the numbers.',
      ),
    },
    photo: {
      kind: 'photo', status: 'verified', from: 'newspaper',
      title: L('تصويرة الدار', 'صورة البيت', 'Photo de la maison', 'Photograph of the house'),
      body: L(
        'دار بزوج طبقات. شرجم مدوّر فوق الباب. فوق السطح: ريحية حديد على شكل هلال. على العتبة منقوش: «I.M. 1921».',
        'بيت من طابقين. نافذة مستديرة فوق الباب. وفوق السطح: دوّارة ريح حديدية على شكل هلال. وعلى العتبة نقش: «I.M. 1921».',
        'Une maison à deux étages. Une fenêtre ronde au-dessus de la porte. Sur le toit, une girouette en forme de croissant. Sur le linteau : « I.M. 1921 ».',
        'A two-storey house. A round window above the door. On the roof, a crescent-shaped iron weathervane. On the lintel: “I.M. 1921”.',
      ),
    },
    weathervane: {
      kind: 'object', status: 'verified', from: 'street',
      title: L('الهلال فوق الشجر', 'الهلال فوق السياج', 'Le croissant au-dessus de la haie', 'Crescent above the hedge'),
      body: L(
        'ورا الشجر ديال رقم 15، كتبان ريحية على شكل هلال. ما كاينش فحتى سطح ديال الزنقة.',
        'خلف سياج الرقم 15 تظهر دوّارة ريح على شكل هلال، لا تعلو أيّ سطح في الشارع.',
        'Derrière la haie du n° 15 dépasse une girouette en croissant. Elle n’appartient à aucun toit de la rue.',
        'Behind the hedge of No. 15, a crescent weathervane shows. It belongs to no roof on the street.',
      ),
    },
    plate: {
      kind: 'object', status: 'verified', from: 'garden',
      title: L('بلاكة «7»', 'لوحة «7»', 'Plaque « 7 »', 'Enamel plate “7”'),
      body: L(
        'بلاكة ديال الإيمايل، زرقا، مكتوب عليها «7 — زنقة الدرّازة». مدفونة نص الدفنة حدا الحيط.',
        'لوحة مينا زرقاء كُتب عليها «7 — زقاق النسّاجين»، مدفونة نصفها قرب الجدار.',
        'Une plaque émaillée bleue : « 7 — rue des Tisserands », à moitié enterrée contre le mur.',
        'A blue enamel plate reading “7 — Weavers’ Lane”, half-buried against the wall.',
      ),
    },
    lintel: {
      kind: 'object', status: 'verified', from: 'garden',
      title: L('الباب اللور', 'الباب الخلفي', 'La porte de derrière', 'The back door'),
      body: L(
        'قفل قديم بالحروف. منقوش فوقو: «قول السمية القديمة ديال الزنقة، والدار غادي تعرفك.»',
        'قفل قديم بالحروف، ونُقش فوقه: «انطق الاسم القديم للزقاق، فيعرفك البيت.»',
        'Une vieille serrure à lettres. Gravé au-dessus : « Dis l’ancien nom de la rue, et la maison te reconnaîtra. »',
        'An old letter lock. Carved above it: “Speak the lane’s old name and the house will know you.”',
      ),
    },
    letter: {
      kind: 'document', status: 'verified', from: 'hidden',
      title: L('برية الإلغاء', 'رسالة الإلغاء', 'Lettre d’annulation', 'Annulment letter'),
      body: L(
        'من البلدية لـ إ. مارو، 20 مارس 1969:\n«قرار الهدم 68/14 تلغى. خاصك تقدّم طلب باش يتسجّل العنوان ديالك من جديد.»\nالظرف محلول. حتى طلب ما تصيفط.',
        'من البلدية إلى إ. مارو، 20 مارس 1969:\n«أُلغي أمر الهدم 68/14. يُرجى تقديم طلب لإعادة تسجيل عنوانكم.»\nالظرف مفتوح، ولم يُرسَل أيّ طلب.',
        'De la mairie à I. Marrow, 20 mars 1969 :\n« L’arrêté de démolition 68/14 est annulé. Veuillez demander la réinscription de votre adresse. »\nL’enveloppe est ouverte. Aucune demande n’a été envoyée.',
        'From the town hall to I. Marrow, 20 March 1969:\n“Demolition order 68/14 is annulled. Please apply to have your address re-registered.”\nThe envelope is open. No application was ever sent.',
      ),
    },
    note: {
      kind: 'document', status: 'verified', from: 'hidden',
      title: L('ورقة مارو', 'ورقة مارو', 'Le mot de Marrow', 'Marrow’s note'),
      body: L(
        '«خليهم ينساو الرقم. الدار كتتفكّر. دار ما عندهاش عنوان، حتى واحد ما كيجي يطيّحها.» — إ.م.',
        '«دعهم ينسَون الرقم. البيت يتذكّر. بيت بلا عنوان لا يأتي أحد ليهدمه.» — إ.م.',
        '« Qu’ils oublient le numéro. La maison, elle, se souvient. Une maison sans adresse, personne ne vient la démolir. » — I.M.',
        '“Let them forget the number. The house remembers. A house with no address, no one comes to knock down.” — I.M.',
      ),
    },
    portrait: {
      kind: 'photo', status: 'verified', from: 'hidden', optional: true,
      title: L('بورتري 1931', 'بورتريه 1931', 'Portrait de 1931', 'Portrait, 1931'),
      body: L(
        'إلياس مارو، 1931. فحجرو قطة كحلة، وعلى جبهتها هلال رقيق.',
        'إلياس مارو، 1931. في حجره قطة سوداء على جبينها هلال رفيع.',
        'Ilyas Marrow, 1931. Sur ses genoux, une chatte noire au fin croissant pâle.',
        'Ilyas Marrow, 1931. On his lap, a black cat with a thin pale crescent on her brow.',
      ),
    },
    well: {
      kind: 'object', status: 'verified', from: 'square', optional: true,
      title: L('البير ديال الساحة', 'بئر الساحة', 'Le puits de la place', 'The square’s well'),
      body: L(
        'منقوش على الحجر: «زنقة الدرّازة ← ». السهم كيشير لجيهة زنقة الزيزفون.',
        'منقوش على الحجر: «زقاق النسّاجين ←». السهم يشير نحو شارع الزيزفون.',
        'Gravé dans la pierre : « Rue des Tisserands → ». La flèche pointe vers la rue des Tilleuls.',
        'Carved in the stone: “Weavers’ Lane →”. The arrow points toward Linden Street.',
      ),
    },
    chain: {
      kind: 'inference', status: 'verified', from: 'archive',
      title: L('سلسلة السجلات', 'سلسلة السجلات', 'La chaîne des registres', 'The chain of records'),
      body: L(
        '1955 الرقم 7 كاين → 1968 العنوان تحيّد وتعاودات الأرقام → 1969 الهدم تلغى → 1970 خريطة بلا 7.',
        '1955 الرقم 7 موجود ← 1968 سحب العنوان وإعادة الترقيم ← 1969 إلغاء الهدم ← 1970 خريطة بلا 7.',
        '1955 le n° 7 existe → 1968 adresse retirée, renumérotation → 1969 démolition annulée → 1970 plan sans le 7.',
        '1955 No. 7 exists → 1968 address withdrawn, street renumbered → 1969 demolition annulled → 1970 map without No. 7.',
      ),
    },
  },

  objects: [
    // Archive
    {
      id: 'ar_map55', loc: 'archive', prop: 'map', at: [28, 62, 22], gives: { clues: ['map1955'] }, doc: 'map1955',
      name: L('خريطة قديمة', 'خريطة قديمة', 'Vieux plan', 'Old map'),
      text: L('ورق صفر، مكتوب فالزاوية 1955.', 'ورق مصفرّ، كُتب في زاويته 1955.', 'Papier jauni, daté de 1955 dans un coin.', 'Yellowed paper, dated 1955 in a corner.'),
    },
    {
      id: 'ar_map70', loc: 'archive', prop: 'map', at: [56, 66, 20], gives: { clues: ['map1970'] }, doc: 'map1970',
      name: L('خريطة جديدة', 'خريطة أحدث', 'Plan plus récent', 'Newer map'),
      text: L('مطبوعة، 1970. الألوان باقيين واضحين.', 'مطبوعة سنة 1970، وألوانها ما تزال واضحة.', 'Imprimé, 1970. Les couleurs tiennent encore.', 'Printed, 1970. The colours still hold.'),
    },
    {
      id: 'ar_registry', loc: 'archive', prop: 'logbook', at: [80, 66, 14], gives: { clues: ['registry'] }, doc: 'registry',
      name: L('دفتر الملكية', 'دفتر الملكية', 'Registre foncier', 'Property register'),
      text: L('السمية ديال المالك مسيوقة بالما.', 'اسم المالك ممسوح بالماء.', 'Le nom du propriétaire a été délavé.', 'The owner’s name has been washed out.'),
    },
    {
      id: 'ar_decree', loc: 'archive', prop: 'folder', at: [44, 32, 12], gives: { clues: ['decree'] }, show: { clue: 'registry' }, doc: 'decree',
      name: L('ملف «68/14»', 'ملف «68/14»', 'Dossier « 68/14 »', 'File “68/14”'),
      text: L('إدريس لقاه من بعد ما شاف الرقم فالدفتر.', 'عثر عليه إدريس بعد أن رأى الرقم في الدفتر.', 'Idris l’a retrouvé après avoir vu le numéro dans le registre.', 'Idris found it after seeing the number in the register.'),
    },
    {
      id: 'ar_reply', loc: 'archive', prop: 'paper', at: [66, 34, 10], gives: { clues: ['neverexisted'] }, doc: 'neverexisted',
      name: L('جواب البلدية', 'ردّ البلدية', 'Réponse de la mairie', 'Town hall reply'),
      text: L('مختوم، مسني، ومتيقن بزاف.', 'مختوم وموقّع وواثق جدًا.', 'Tamponnée, signée, très sûre d’elle.', 'Stamped, signed, very sure of itself.'),
    },
    {
      id: 'ar_table', loc: 'archive', prop: 'lighttable', at: [16, 32, 16], puzzle: 'c_maps',
      name: L('طبلة الضو', 'طاولة الإضاءة', 'Table lumineuse', 'Light table'),
      text: [
        { text: L('مزيانة باش تحط خريطة فوق خريطة.', 'تصلح لوضع خريطة فوق أخرى.', 'Idéale pour superposer deux plans.', 'Good for laying one map over another.') },
        { if: { puzzle: 'c_maps' }, text: L('الخريطتين متطابقين. الرقم 7 كيطيح بين 13 و15.', 'الخريطتان متطابقتان. الرقم 7 يقع بين 13 و15.', 'Les deux plans coïncident. Le n° 7 tombe entre le 13 et le 15.', 'The maps align. No. 7 falls between 13 and 15.') },
      ],
      locked: L('خاصك جوج ديال الخرايط من وقتين مختلفين، والقرار اللي بدّل الأرقام.', 'تحتاج خريطتين من زمنين مختلفين، والقرار الذي غيّر الأرقام.', 'Il faut deux plans d’époques différentes, et l’arrêté qui a changé les numéros.', 'You need two maps from different years, and the decree that changed the numbers.'),
    },
    {
      id: 'ar_chain', loc: 'archive', prop: 'whiteboard', at: [86, 30, 16], puzzle: 'c_chain',
      name: L('حبل الأوراق', 'حبل الأوراق', 'Fil à documents', 'Document line'),
      text: [
        { text: L('حبل وملاقط، باش ترتّب الوثائق على حساب الوقت.', 'حبل وملاقط لترتيب الوثائق زمنيًا.', 'Une ficelle et des pinces pour ordonner les pièces.', 'A string and pegs for putting documents in order.') },
        { if: { puzzle: 'c_chain' }, text: L('الوثائق معلّقين بالترتيب. القصة ولات واضحة.', 'الوثائق معلّقة بالترتيب. اتّضحت القصة.', 'Les pièces pendent dans l’ordre. L’histoire se lit.', 'The documents hang in order. The story reads clearly.') },
      ],
      locked: L('خاصك الخرايط، القرار، والقصاصة ديال الجريدة.', 'تحتاج الخرائط والقرار وقصاصة الجريدة.', 'Il faut les plans, l’arrêté et la coupure de presse.', 'You need the maps, the decree and the newspaper clipping.'),
    },
    // Square
    {
      id: 'sq_haddad', loc: 'square', prop: 'oldman', at: [34, 58, 14], gives: { clues: ['haddad'] }, doc: 'haddad',
      name: L('سي حداد', 'السيد حدّاد', 'M. Haddad', 'Mr Haddad'),
      text: L('عندو 84 عام والذاكرة ديالو حادّة.', 'عمره 84 عامًا وذاكرته حادّة.', '84 ans, la mémoire aiguisée.', 'Eighty-four, with a sharp memory.'),
    },
    {
      id: 'sq_well', loc: 'square', prop: 'well', at: [66, 62, 16], optional: true, gives: { clues: ['well'] }, doc: 'well',
      name: L('البير القديم', 'البئر القديمة', 'Le vieux puits', 'The old well'),
      text: L('حجر قديم، والحروف بالكاد كيبانو.', 'حجر قديم، حروفه بالكاد تظهر.', 'Vieille pierre, lettres à peine lisibles.', 'Old stone, the letters barely legible.'),
    },
    // Newspaper
    {
      id: 'np_clipping', loc: 'newspaper', prop: 'cabinet', at: [30, 54, 18], gives: { clues: ['clipping'] }, doc: 'clipping',
      name: L('أرشيف 1969', 'أرشيف 1969', 'Archives 1969', '1969 archive'),
      text: L('الصفحة ديال 12 مارس مطوية.', 'صفحة 12 مارس مطويّة.', 'La page du 12 mars est cornée.', 'The 12 March page is dog-eared.'),
    },
    {
      id: 'np_photo', loc: 'newspaper', prop: 'frame', at: [66, 32, 12], gives: { clues: ['photo'] }, doc: 'photo',
      name: L('تصويرة فالحيط', 'صورة على الجدار', 'Photo au mur', 'Photograph on the wall'),
      text: L('«ديور الدرّازة، 1950».', '«بيوت النسّاجين، 1950».', '« Maisons des Tisserands, 1950 ».', '“Weavers’ houses, 1950”.'),
    },
    // Street
    {
      id: 'st_13', loc: 'street', prop: 'facade', at: [24, 50, 26],
      name: L('رقم 13', 'الرقم 13', 'Le n° 13', 'No. 13'),
      text: L('شرجم مربّع، سطح بلا ريحية. البلاكة جديدة.', 'نافذة مربّعة وسطح بلا دوّارة. اللوحة جديدة.', 'Fenêtre carrée, toit sans girouette. Plaque neuve.', 'Square window, no weathervane. New number plate.'),
    },
    {
      id: 'st_15', loc: 'street', prop: 'hedge', at: [62, 56, 30],
      name: L('رقم 15 والشجر', 'الرقم 15 والسياج', 'Le n° 15 et sa haie', 'No. 15 and its hedge'),
      text: L('شجر عالي بزاف لدار صغيرة بحال هادي.', 'سياج أعلى من اللازم لبيت صغير كهذا.', 'Une haie bien haute pour une si petite maison.', 'A very tall hedge for such a small house.'),
    },
    {
      id: 'st_vane', loc: 'street', prop: 'weathervane', at: [70, 16, 10], gives: { clues: ['weathervane'] }, doc: 'weathervane',
      name: L('شي حاجة فوق الشجر', 'شيء فوق السياج', 'Quelque chose au-dessus de la haie', 'Something above the hedge'),
      text: L('كتدور مع الريح.', 'تدور مع الريح.', 'Ça tourne avec le vent.', 'It turns with the wind.'),
    },
    {
      id: 'st_compare', loc: 'street', prop: 'clipboard', at: [88, 70, 10], puzzle: 'c_photo',
      name: L('قارن مع التصويرة', 'قارن بالصورة', 'Comparer avec la photo', 'Compare with the photograph'),
      text: [
        { text: L('حطّ التصويرة قدّام عينيك وشوف الزنقة.', 'ضع الصورة أمام عينيك وانظر إلى الشارع.', 'Tenez la photo devant vous et regardez la rue.', 'Hold the photograph up and look down the street.') },
        { if: { puzzle: 'c_photo' }, text: L('لقيتي الممر ورا الشجر.', 'وجدت الممرّ خلف السياج.', 'Vous avez trouvé le passage derrière la haie.', 'You found the passage behind the hedge.') },
      ],
      locked: L('خاصك تصويرة الدار، وشي حاجة فالزنقة كتشبه ليها.', 'تحتاج صورة البيت، وشيئًا في الشارع يشبهها.', 'Il faut la photo de la maison, et un détail de la rue qui lui ressemble.', 'You need the photograph of the house, and something on the street that matches it.'),
    },
    // Garden
    {
      id: 'gd_plate', loc: 'garden', prop: 'plate', at: [24, 78, 12], gives: { clues: ['plate'] }, doc: 'plate',
      name: L('شي حاجة زرقا فالتراب', 'شيء أزرق في التراب', 'Quelque chose de bleu dans la terre', 'Something blue in the soil'),
      text: L('حرف ديال الإيمايل كيلمع تحت الورق.', 'حافة مينا تلمع تحت الأوراق.', 'Un bord d’émail luit sous les feuilles.', 'An enamel edge gleams under the leaves.'),
    },
    {
      id: 'gd_door', loc: 'garden', prop: 'door', at: [62, 50, 18], gives: { clues: ['lintel'] }, puzzle: 'c_word', doc: 'lintel',
      name: L('الباب اللور', 'الباب الخلفي', 'Porte de derrière', 'Back door'),
      text: [
        { text: L('قفل بالحروف ونقش فوقو.', 'قفل بالحروف ونقش فوقه.', 'Une serrure à lettres et une inscription.', 'A letter lock and an inscription.') },
        { if: { puzzle: 'c_word' }, text: L('الباب محلول. الدار عرفاتك.', 'الباب مفتوح. عرفك البيت.', 'La porte est ouverte. La maison vous a reconnu.', 'The door is open. The house knows you.') },
      ],
      locked: L('باش تجاوب، خاصك تعرف السمية القديمة ديال الزنقة: شي خريطة قديمة ولا شي واحد كيتفكّر.', 'لتجيب، تحتاج الاسم القديم للزقاق: خريطة قديمة أو شخص يتذكّر.', 'Pour répondre, il faut l’ancien nom de la rue : un vieux plan ou un témoin.', 'To answer, you need the lane’s old name: an old map or someone who remembers.'),
    },
    {
      id: 'gd_window', loc: 'garden', prop: 'roundwindow', at: [86, 30, 10],
      name: L('الشرجم المدوّر', 'النافذة المستديرة', 'La fenêtre ronde', 'The round window'),
      text: L('بحال اللي فالتصويرة. نفس الإطار، نفس الشقّة.', 'كما في الصورة: الإطار نفسه، والشقّ نفسه.', 'Comme sur la photo. Même cadre, même fêlure.', 'Like the photograph. Same frame, same crack.'),
    },
    // House
    {
      id: 'hs_desk', loc: 'house', prop: 'drawer', at: [30, 66, 16], gives: { items: ['crescent'] },
      name: L('المكتب ديال مارو', 'مكتب مارو', 'Le bureau de Marrow', 'Marrow’s desk'),
      text: [
        { text: L('المجر الفوقاني كيتحلّ بصعوبة.', 'الدرج العلوي يُفتح بصعوبة.', 'Le tiroir du haut résiste.', 'The top drawer sticks.') },
        { if: { item: 'crescent' }, text: L('المجر خاوي دابا، غير الغبرة.', 'الدرج فارغ الآن، إلا من الغبار.', 'Le tiroir est vide, sauf la poussière.', 'The drawer is empty now, but for dust.') },
      ],
    },
    {
      id: 'hs_plans', loc: 'house', prop: 'map', at: [60, 70, 18],
      name: L('رسومات ديال الحديد', 'رسوم حديدية', 'Dessins de ferronnerie', 'Ironwork drawings'),
      text: L('فنارات، شبابك، وريحية على شكل هلال. كلشي مسني «إ.م.»', 'فوانيس وشبابيك ودوّارة على شكل هلال، كلّها موقّعة «إ.م.»', 'Lanternes, grilles, et une girouette en croissant. Tout est signé « I.M. »', 'Lanterns, grilles, and a crescent weathervane. All signed “I.M.”'),
    },
    {
      id: 'hs_shelf', loc: 'house', prop: 'bookcase', at: [82, 46, 18],
      name: L('الخزانة ديال الكتب', 'خزانة الكتب', 'La bibliothèque', 'Bookcase'),
      text: [
        { text: L('فالوسط، فراغ صغير منقوش على شكل هلال.', 'في وسطها تجويف صغير منحوت على شكل هلال.', 'Au centre, une petite encoche en forme de croissant.', 'In the middle, a small crescent-shaped recess.') },
        { if: { flag: 'shelf_open' }, text: L('الخزانة دارت على راسها. ورّاها، بيت.', 'دارت الخزانة على محورها، وخلفها غرفة.', 'La bibliothèque a pivoté. Derrière, une pièce.', 'The bookcase has swung aside. Behind it, a room.') },
      ],
      accepts: [
        { item: 'crescent', flag: 'shelf_open', consume: true, text: L('الهلال دخل بلاصتو. تك. الخزانة تحرّكات.', 'استقرّ الهلال في مكانه. نقرة. تحرّكت الخزانة.', 'Le croissant s’emboîte. Un déclic. La bibliothèque bouge.', 'The crescent clicks into place. The bookcase moves.') },
      ],
    },
    // Hidden room
    {
      id: 'hd_letters', loc: 'hidden', prop: 'envelope', at: [34, 66, 14], gives: { clues: ['letter'] }, doc: 'letter',
      name: L('رسائل مربوطة', 'رسائل مربوطة', 'Lettres nouées', 'Tied letters'),
      text: L('اللولة عليها الطابع ديال البلدية.', 'الأولى تحمل ختم البلدية.', 'La première porte le cachet de la mairie.', 'The first bears the town hall seal.'),
    },
    {
      id: 'hd_note', loc: 'hidden', prop: 'notebook', at: [60, 70, 10], gives: { clues: ['note'] }, doc: 'note',
      name: L('ورقة فوق المكتب', 'ورقة على المكتب', 'Un mot sur le bureau', 'Note on the desk'),
      text: L('مكتوبة بالريشة، بخط مرتب.', 'مكتوبة بالريشة بخطّ متأنٍّ.', 'Écrit à la plume, d’une main soignée.', 'Written with a nib, in a careful hand.'),
    },
    {
      id: 'hd_portrait', loc: 'hidden', prop: 'frame', at: [80, 34, 12], optional: true, gives: { clues: ['portrait'] }, doc: 'portrait',
      name: L('بورتري', 'بورتريه', 'Portrait', 'Portrait'),
      text: L('مقلوب على الحيط.', 'مقلوب نحو الجدار.', 'Retourné contre le mur.', 'Turned to face the wall.'),
    },
  ],

  puzzles: {
    c_maps: {
      type: 'choice',
      requires: { all: [{ clue: 'map1955' }, { clue: 'map1970' }, { clue: 'decree' }] },
      title: L('حطّ الخريطة فوق الخريطة', 'طابِق الخريطتين', 'Superposer les plans', 'Overlay the maps'),
      prompt: L(
        'على حساب القرار ديال 1968، فين كتطيح الرقم 7 القديمة فزنقة الزيزفون؟',
        'بحسب قرار 1968، أين يقع الرقم 7 القديم في شارع الزيزفون؟',
        'D’après l’arrêté de 1968, où tombe l’ancien n° 7 dans la rue des Tilleuls ?',
        'According to the 1968 decree, where does old No. 7 fall on Linden Street?',
      ),
      options: [
        { id: '13_15', text: L('بين 13 و15', 'بين 13 و15', 'Entre le 13 et le 15', 'Between 13 and 15') },
        { id: '15', text: L('هي رقم 15', 'هو الرقم 15', 'C’est le n° 15', 'It is No. 15'), why: L('رقم 15 كان 7؟ شوف القرار: 7 ما عندهاش رقم جديد.', 'هل كان الرقم 15 هو 7؟ القرار يقول إن 7 بلا رقم جديد.', 'Le 15 serait l’ancien 7 ? L’arrêté dit que le 7 n’a reçu aucun numéro.', 'Was 15 once 7? The decree says No. 7 got no new number.') },
        { id: '17', text: L('هي رقم 17', 'هو الرقم 17', 'C’est le n° 17', 'It is No. 17'), why: L('17 هي 9 القديمة.', 'الرقم 17 هو 9 القديم.', 'Le 17 est l’ancien 9.', '17 is the old No. 9.') },
        { id: 'well', text: L('حدا البير', 'قرب البئر', 'Près du puits', 'By the well'), why: L('البير هو فين كتلاقى الزنقتين، ماشي فين كاينة الدار.', 'البئر حيث يلتقي الشارعان، لا حيث البيت.', 'Le puits marque le croisement, pas la maison.', 'The well marks the junction, not the house.') },
      ],
      answer: '13_15',
      wrong: L('هادشي ما كيمشيش مع الأرقام الجداد.', 'هذا لا يتّفق مع الأرقام الجديدة.', 'Ça ne colle pas avec la renumérotation.', 'That doesn’t fit the renumbering.'),
      success: L('5 ولات 13، و9 ولات 17. 7 بقات بلا رقم — بين 13 و15، فين الخريطة كتقول «جردة».', 'صار 5 هو 13، و9 هو 17. وبقي 7 بلا رقم بين 13 و15، حيث تقول الخريطة «حديقة».', 'Le 5 est devenu 13, le 9 est devenu 17. Le 7 n’a rien reçu : entre 13 et 15, là où le plan dit « jardin ».', '5 became 13 and 9 became 17. No. 7 got nothing: between 13 and 15, where the map says “garden”.'),
      hints: [
        L('ما تقرأش الخريطة الجديدة بوحدها. شي وثيقة كتشرح كيفاش تبدّلو الأرقام.', 'لا تقرأ الخريطة الجديدة وحدها. هناك وثيقة تشرح كيف تغيّرت الأرقام.', 'Ne lisez pas le plan récent seul. Un document explique la renumérotation.', 'Don’t read the new map on its own. A document explains how the numbers changed.'),
        L('القرار كيعطي لكل رقم قديم رقم جديد. شوف الجيران ديال 7.', 'يعطي القرار لكلّ رقم قديم رقمًا جديدًا. انظر إلى جيران الرقم 7.', 'L’arrêté donne un nouveau numéro à chaque ancien. Regardez les voisins du 7.', 'The decree gives each old number a new one. Look at No. 7’s neighbours.'),
        L('5 ← 13 و 9 ← 17. اللي كان بيناتهم، دابا بين 13 و15… ولا 17؟ الخريطة كتقول «جردة» بين 13 و15.', '5 ← 13 و9 ← 17. ما بينهما الآن بين 13 و15، حيث تقول الخريطة «حديقة».', '5 → 13 et 9 → 17. Ce qui était entre eux est entre 13 et 15, là où le plan indique « jardin ».', '5 → 13 and 9 → 17. Whatever stood between them is now between 13 and 15, where the map says “garden”.'),
      ],
    },
    c_photo: {
      type: 'match',
      requires: { all: [{ clue: 'photo' }, { clue: 'weathervane' }] },
      title: L('التصويرة والزنقة', 'الصورة والشارع', 'La photo et la rue', 'Photograph and street'),
      prompt: L(
        'ربط كل تفصيلة من التصويرة باللي كتشوف فالزنقة دابا.',
        'اربط كلّ تفصيل في الصورة بما تراه في الشارع الآن.',
        'Associez chaque détail de la photo à ce que vous voyez aujourd’hui dans la rue.',
        'Match each detail in the photograph to what you can see on the street today.',
      ),
      left: {
        vane: L('الريحية على شكل هلال', 'دوّارة الريح الهلالية', 'La girouette en croissant', 'The crescent weathervane'),
        window: L('الشرجم المدوّر', 'النافذة المستديرة', 'La fenêtre ronde', 'The round window'),
        lane: L('الزنقة اللي كانت قدّام الدار', 'الزقاق أمام البيت', 'La ruelle devant la maison', 'The lane in front of the house'),
      },
      right: {
        hedge: L('فوق الشجر ديال رقم 15', 'فوق سياج الرقم 15', 'Au-dessus de la haie du 15', 'Above the hedge of No. 15'),
        nothing: L('ما كاينش فحتى دار باينة', 'غير ظاهرة في أيّ بيت', 'Sur aucune maison visible', 'On no visible house'),
        linden: L('دابا جزء من زنقة الزيزفون', 'صار جزءًا من شارع الزيزفون', 'Aujourd’hui partie de la rue des Tilleuls', 'Now part of Linden Street'),
        no13: L('رقم 13', 'الرقم 13', 'Le n° 13', 'No. 13'),
      },
      answer: { vane: 'hedge', window: 'nothing', lane: 'linden' },
      wrong: L('شي تفاصيل ما متطابقينش. عاود شوف الواجهات.', 'بعض التفاصيل غير متطابقة. أعِد النظر في الواجهات.', 'Certains détails ne correspondent pas. Regardez de nouveau les façades.', 'Some details don’t match. Look at the façades again.'),
      success: L('الدار كاينة — غير ما كتبانش من الزنقة. ممر ضيق كيدوّز ورا الشجر.', 'البيت موجود، لكنه لا يُرى من الشارع. ممرّ ضيّق يمرّ خلف السياج.', 'La maison est là — invisible depuis la rue. Un passage étroit longe la haie.', 'The house is there — just not visible from the street. A narrow passage runs behind the hedge.'),
      hints: [
        L('بدا بالتفصيلة اللي ما يمكنش تتخبّا: اللي فوق السطح.', 'ابدأ بالتفصيل الذي لا يمكن إخفاؤه: ما فوق السطح.', 'Commencez par le détail impossible à cacher : celui du toit.', 'Start with the detail that can’t be hidden: the one on the roof.'),
        L('الهلال كيبان من الزنقة، ولكن الواجهة لا. والزنقة القديمة بدّلات السمية.', 'الهلال يظهر من الشارع، أمّا الواجهة فلا. والزقاق القديم غيّر اسمه.', 'Le croissant se voit de la rue, la façade non. Et la ruelle a changé de nom.', 'The crescent shows from the street; the façade doesn’t. And the old lane changed its name.'),
        L('الهلال فوق شجر 15، الشرجم المدوّر ما كيبانش، والزنقة ولات زنقة الزيزفون.', 'الهلال فوق سياج 15، والنافذة المستديرة لا تظهر، والزقاق صار شارع الزيزفون.', 'Croissant au-dessus de la haie du 15, fenêtre ronde invisible, ruelle devenue rue des Tilleuls.', 'Crescent above No. 15’s hedge, round window not visible, lane now part of Linden Street.'),
      ],
    },
    c_word: {
      type: 'word',
      requires: { all: [{ clue: 'lintel' }, { any: [{ clue: 'map1955' }, { clue: 'haddad' }] }] },
      title: L('السمية القديمة', 'الاسم القديم', 'L’ancien nom', 'The old name'),
      prompt: L(
        '«قول السمية القديمة ديال الزنقة.» كتب السمية بلغتك.',
        '«انطق الاسم القديم للزقاق.» اكتب الاسم بلغتك.',
        '« Dis l’ancien nom de la rue. » Écrivez le nom dans votre langue.',
        '“Speak the lane’s old name.” Type the name in your language.',
      ),
      // The lane's name in each language; all are accepted, prefixes like "rue des" are ignored.
      answers: {
        dar: ['الدرازة', 'زنقة الدرازة', 'الدرّازة'],
        ar: ['النساجين', 'زقاق النساجين', 'النسّاجين'],
        fr: ['Tisserands', 'rue des Tisserands'],
        en: ['Weavers', 'Weavers Lane', 'Weavers’ Lane'],
      },
      filler: ['rue', 'des', 'de', 'la', 'lane', 'street', 'the', 'زنقة', 'زقاق', 'درب', 'شارع'],
      wrong: L('القفل ما تحرّكش. هادي ماشي السمية القديمة.', 'لم يتحرّك القفل. ليس هذا الاسم القديم.', 'La serrure ne bouge pas. Ce n’est pas l’ancien nom.', 'The lock doesn’t move. That isn’t the old name.'),
      success: L('الحروف تصفّفو. الباب تحلّ بشوية.', 'اصطفّت الحروف. انفتح الباب ببطء.', 'Les lettres s’alignent. La porte s’ouvre doucement.', 'The letters align. The door opens slowly.'),
      hints: [
        L('الزنقة ما كانتش ديما سميتها الزيزفون.', 'لم يكن اسم الشارع دائمًا «الزيزفون».', 'La rue ne s’est pas toujours appelée « des Tilleuls ».', 'The street wasn’t always called Linden.'),
        L('الخريطة ديال 1955 وسي حداد بجوج كيذكرو السمية القديمة.', 'خريطة 1955 والسيد حدّاد يذكران الاسم القديم.', 'Le plan de 1955 et M. Haddad donnent tous deux l’ancien nom.', 'The 1955 map and Mr Haddad both give the old name.'),
        L('السمية القديمة كتسمّي الحرفة ديال الناس اللي كانو ساكنين تما — اللي كيخدمو الثوب.', 'الاسم القديم يسمّي حرفة سكّانه: من يصنعون النسيج.', 'L’ancien nom désigne le métier de ses habitants : ceux qui tissaient.', 'The old name names the trade of the people who lived there: the ones who wove cloth.'),
      ],
    },
    c_chain: {
      type: 'order',
      requires: { all: [{ clue: 'map1955' }, { clue: 'map1970' }, { clue: 'decree' }, { clue: 'registry' }, { clue: 'clipping' }] },
      title: L('رتّب السجلات', 'رتّب السجلات', 'Ordonner les registres', 'Order the records'),
      prompt: L('رتّب الوثائق على حساب التاريخ ديالها.', 'رتّب الوثائق بحسب تاريخها.', 'Classez les documents par date.', 'Put the documents in date order.'),
      items: {
        built: L('الدار تبنات (العتبة)', 'بناء البيت (العتبة)', 'Construction (linteau)', 'House built (lintel)'),
        m55: L('خريطة فيها الرقم 7', 'خريطة فيها الرقم 7', 'Plan avec le n° 7', 'Map showing No. 7'),
        decree: L('العنوان تحيّد والأرقام تبدّلو', 'سحب العنوان وتغيير الأرقام', 'Adresse retirée, renumérotation', 'Address withdrawn, renumbering'),
        annul: L('الطريق تلغات والهدم حتى هو', 'إلغاء الطريق والهدم', 'Route et démolition annulées', 'Road and demolition annulled'),
        m70: L('خريطة بلا الرقم 7', 'خريطة بلا الرقم 7', 'Plan sans le n° 7', 'Map without No. 7'),
      },
      shuffled: ['annul', 'm70', 'built', 'decree', 'm55'],
      answer: ['built', 'm55', 'decree', 'annul', 'm70'],
      wrong: L('شي وثائق ما فبلاصتهمش. شوف التواريخ المكتوبة.', 'بعض الوثائق في غير موضعها. انظر إلى التواريخ.', 'Certaines pièces sont mal placées. Regardez les dates.', 'Some documents are out of place. Check the dates.'),
      success: L('السجلات كيحكيو قصة وحدة: الهدم تلغى، والعنوان عمرو ما رجع.', 'تروي السجلات قصة واحدة: أُلغي الهدم، ولم يعد العنوان قط.', 'Les registres racontent une seule histoire : démolition annulée, adresse jamais rétablie.', 'The records tell one story: the demolition was annulled, the address never restored.'),
      gives: { clues: ['chain'] },
      hints: [
        L('كل وثيقة فيها عام. ما تحتاجش أكثر من هادشي.', 'لكلّ وثيقة سنة. لا تحتاج أكثر.', 'Chaque pièce porte une année. Il n’en faut pas plus.', 'Each document carries a year. You need nothing more.'),
        L('1921، 1955، 1968، 1969، 1970.', '1921، 1955، 1968، 1969، 1970.', '1921, 1955, 1968, 1969, 1970.', '1921, 1955, 1968, 1969, 1970.'),
        L('الإلغاء (1969) جا قبل الخريطة الجديدة (1970) — وهادشي هو اللي كيخلّي الغياب ديال 7 غريب.', 'جاء الإلغاء (1969) قبل الخريطة الجديدة (1970)، وهذا ما يجعل غياب 7 غريبًا.', 'L’annulation (1969) précède le nouveau plan (1970) — c’est ce qui rend l’absence du 7 si étrange.', 'The annulment (1969) comes before the new map (1970) — which is what makes No. 7’s absence so strange.'),
      ],
    },
  },

  deductions: [
    {
      id: 'd_withdrawn', pair: ['registry', 'decree'], essential: true,
      text: L('العنوان تحيّد فـ1968 بسبب الهدم، والأرقام تبدّلو فنفس العام.', 'سُحب العنوان سنة 1968 بسبب الهدم، وتغيّرت الأرقام في العام نفسه.', 'L’adresse a été retirée en 1968 pour la démolition, l’année de la renumérotation.', 'The address was withdrawn in 1968 for demolition, the same year the street was renumbered.'),
    },
    {
      id: 'd_annulled', pair: ['clipping', 'registry'], essential: true,
      text: L('الهدم تلغى فـ1969، ولكن السجل عمرو ما تصحّح.', 'أُلغي الهدم سنة 1969، لكن السجلّ لم يُصحَّح قط.', 'La démolition a été annulée en 1969, mais le registre n’a jamais été corrigé.', 'The demolition was annulled in 1969, but the register was never corrected.'),
    },
    {
      id: 'd_exists', pair: ['photo', 'weathervane'], essential: true,
      text: L('الدار ديال التصويرة باقا واقفة ورا رقم 15.', 'بيت الصورة ما يزال قائمًا خلف الرقم 15.', 'La maison de la photo est toujours debout derrière le n° 15.', 'The house in the photograph still stands behind No. 15.'),
    },
    {
      id: 'd_silence', pair: ['letter', 'note'], essential: true,
      text: L('مارو وصلاتو برية الإلغاء وسكت بالعاني.', 'تلقّى مارو رسالة الإلغاء وصمت عمدًا.', 'Marrow a reçu l’annulation et a choisi de se taire.', 'Marrow received the annulment and chose to stay silent.'),
    },
    {
      id: 'd_plate', pair: ['plate', 'map1955'],
      text: L('البلاكة كتأكد: هادي هي 7 زنقة الدرّازة.', 'اللوحة تؤكّد: هذا هو 7 زقاق النسّاجين.', 'La plaque le confirme : c’est bien le 7, rue des Tisserands.', 'The plate confirms it: this is 7 Weavers’ Lane.'),
    },
    {
      id: 'd_myth', pair: ['neverexisted', 'map1955'],
      text: L('«عمرها ما كانت» غلط: الخريطة ديال 1955 فيها الدار.', '«لم يوجد قط» خطأ: خريطة 1955 تُظهر البيت.', '« N’a jamais existé » est faux : le plan de 1955 montre la maison.', '“Never existed” is false: the 1955 map shows the house.'),
    },
  ],
  contradictions: [
    { id: 'c_exist', pair: ['neverexisted', 'map1955'], resolvedBy: 'd_myth' },
    { id: 'c_demolished', pair: ['registry', 'weathervane'], resolvedBy: 'd_exists' },
    { id: 'c_restored', pair: ['clipping', 'map1970'], resolvedBy: 'd_annulled' },
  ],

  objectives: [
    {
      id: 'o_maps', done: { all: [{ clue: 'map1955' }, { clue: 'map1970' }] },
      text: L('قارن الخريطة القديمة مع الجديدة.', 'قارن الخريطة القديمة بالجديدة.', 'Comparez l’ancien plan et le nouveau.', 'Compare the old map with the new one.'),
    },
    {
      id: 'o_numbers', when: { clue: 'map1970' }, done: { puzzle: 'c_maps' },
      text: L('فهم كيفاش تبدّلو الأرقام.', 'افهم كيف تغيّرت الأرقام.', 'Comprenez comment les numéros ont changé.', 'Work out how the numbers changed.'),
    },
    {
      id: 'o_photo', when: { puzzle: 'c_maps' }, done: { puzzle: 'c_photo' },
      text: L('لقا الدار فالزنقة بالتفاصيل ديال التصويرة.', 'جد البيت في الشارع بتفاصيل الصورة.', 'Retrouvez la maison dans la rue grâce aux détails de la photo.', 'Find the house on the street using the photograph’s details.'),
    },
    {
      id: 'o_witness', when: { clue: 'map1955' }, done: { clue: 'haddad' },
      text: L('سول شي واحد كيتفكّر الزنقة.', 'اسأل من يتذكّر الزقاق.', 'Interrogez quelqu’un qui se souvient de la ruelle.', 'Ask someone who remembers the lane.'),
    },
    {
      id: 'o_enter', when: { puzzle: 'c_photo' }, done: { puzzle: 'c_word' },
      text: L('دخل للدار.', 'ادخل البيت.', 'Entrez dans la maison.', 'Get into the house.'),
    },
    {
      id: 'o_chain', when: { clue: 'clipping' }, done: { puzzle: 'c_chain' },
      text: L('رتّب السجلات وشوف فين تقطعات السلسلة.', 'رتّب السجلات وانظر أين انقطعت السلسلة.', 'Ordonnez les registres et voyez où la chaîne se rompt.', 'Order the records and see where the chain breaks.'),
    },
    {
      id: 'o_hidden', when: { puzzle: 'c_word' }, done: { clue: 'letter' },
      text: L('الدار عندها سرّ. لقاه.', 'للبيت سرّ. اعثر عليه.', 'La maison a un secret. Trouvez-le.', 'The house is keeping a secret. Find it.'),
    },
    {
      id: 'o_board', when: { clue: 'letter' }, done: { all: [{ deduction: 'd_withdrawn' }, { deduction: 'd_annulled' }, { deduction: 'd_exists' }, { deduction: 'd_silence' }] },
      text: L('ربط الأدلة فاللوحة.', 'اربط الأدلة على اللوحة.', 'Reliez les preuves sur le tableau.', 'Connect the evidence on the board.'),
    },
    {
      id: 'o_final', when: { all: [{ clue: 'letter' }, { puzzle: 'c_chain' }] }, done: { flag: '__never__' },
      text: L('قدّم الخلاصة ديالك.', 'قدّم استنتاجك.', 'Présentez votre conclusion.', 'Present your conclusion.'),
    },
  ],

  final: {
    requires: { all: [{ clue: 'letter' }, { puzzle: 'c_chain' }] },
    essentialDeductions: ['d_withdrawn', 'd_annulled', 'd_exists', 'd_silence'],
    questions: [
      {
        id: 'q_what', type: 'choice', core: true,
        prompt: L('علاش الدار ما عندهاش عنوان؟', 'لماذا لا يملك البيت عنوانًا؟', 'Pourquoi la maison n’a-t-elle pas d’adresse ?', 'Why does the house have no address?'),
        options: [
          { id: 'withdrawn', text: L('العنوان تحيّد على قبل هدم تلغى، والسجل عمرو ما تصحّح', 'سُحب العنوان من أجل هدم أُلغي، ولم يُصحَّح السجلّ قط', 'L’adresse a été retirée pour une démolition annulée, sans correction du registre', 'The address was withdrawn for a demolition that was cancelled, and never restored') },
          { id: 'never', text: L('الدار عمرها ما كانت', 'البيت لم يوجد قط', 'La maison n’a jamais existé', 'The house never existed') },
          { id: 'demolished', text: L('الدار تهدّمات', 'هُدم البيت', 'La maison a été démolie', 'The house was demolished') },
          { id: 'error', text: L('غلطة ديال الطباعة فالخريطة', 'خطأ مطبعي في الخريطة', 'Une coquille sur le plan', 'A printing error on the map') },
        ],
        answer: 'withdrawn',
      },
      {
        id: 'q_silent', type: 'choice', core: true,
        prompt: L('علاش ما رجعش العنوان من بعد 1969؟', 'لماذا لم يُستعَد العنوان بعد 1969؟', 'Pourquoi l’adresse n’a-t-elle pas été rétablie après 1969 ?', 'Why was the address not restored after 1969?'),
        options: [
          { id: 'marrow', text: L('مارو ما طلبش، بالعاني', 'لم يطلب مارو ذلك عمدًا', 'Marrow n’en a jamais fait la demande, volontairement', 'Marrow chose never to apply') },
          { id: 'lost', text: L('البرية ضاعت فالبوسطة', 'ضاعت الرسالة في البريد', 'La lettre s’est perdue', 'The letter was lost in the post') },
          { id: 'council', text: L('المجلس رفض', 'رفض المجلس', 'Le conseil a refusé', 'The council refused') },
        ],
        answer: 'marrow',
      },
      {
        id: 'q_order', type: 'order',
        prompt: L('رتّب السلسلة.', 'رتّب السلسلة.', 'Ordonnez la chaîne.', 'Order the chain.'),
        items: {
          m55: L('1955: الرقم 7 فالخريطة', '1955: الرقم 7 على الخريطة', '1955 : le n° 7 sur le plan', '1955: No. 7 on the map'),
          decree: L('1968: العنوان تحيّد', '1968: سحب العنوان', '1968 : adresse retirée', '1968: address withdrawn'),
          annul: L('1969: الهدم تلغى', '1969: إلغاء الهدم', '1969 : démolition annulée', '1969: demolition annulled'),
          m70: L('1970: خريطة بلا 7', '1970: خريطة بلا 7', '1970 : plan sans le 7', '1970: map without No. 7'),
        },
        shuffled: ['annul', 'm70', 'm55', 'decree'],
        answer: ['m55', 'decree', 'annul', 'm70'],
      },
      {
        id: 'q_contra', type: 'choice',
        prompt: L('أشمن ادعاء كتكذّبو الأدلة؟', 'أيّ ادعاء تدحضه الأدلة؟', 'Quelle affirmation les preuves démentent-elles ?', 'Which claim does the evidence contradict?'),
        options: [
          { id: 'never', text: L('«هاد الدار عمرها ما كانت»', '«هذا البيت لم يوجد قط»', '« Cette maison n’a jamais existé »', '“This house never existed”') },
          { id: 'renamed', text: L('«الزنقة بدّلات السمية»', '«تغيّر اسم الزقاق»', '« La rue a changé de nom »', '“The lane was renamed”') },
          { id: 'road', text: L('«الطريق تلغات»', '«أُلغي الطريق»', '« La route a été abandonnée »', '“The road was abandoned”') },
        ],
        answer: 'never',
      },
      {
        id: 'q_evidence', type: 'evidence',
        prompt: L('ختار الأدلة المستقلة اللي كتسند الخلاصة.', 'اختر الأدلة المستقلّة التي تسند الاستنتاج.', 'Choisissez les preuves indépendantes qui soutiennent la conclusion.', 'Choose the independent evidence that supports the conclusion.'),
        required: ['map1955', 'registry', 'clipping', 'letter', 'weathervane'],
      },
      {
        id: 'q_open', type: 'choice',
        prompt: L('شنو اللي باقي ما تشرحش كامل؟', 'ما الذي لم يُفسَّر كاملًا؟', 'Qu’est-ce qui n’est expliqué qu’à moitié ?', 'What is only half explained?'),
        options: [
          { id: 'why', text: L('علاش مارو اختار السكوت طول حياتو', 'لماذا اختار مارو الصمت طوال حياته', 'Pourquoi Marrow a choisi le silence toute sa vie', 'Why Marrow chose silence for the rest of his life') },
          { id: 'where', text: L('فين كاينة الدار', 'أين البيت', 'Où se trouve la maison', 'Where the house is') },
          { id: 'when', text: L('إمتى تحيّد العنوان', 'متى سُحب العنوان', 'Quand l’adresse a été retirée', 'When the address was withdrawn') },
        ],
        answer: 'why',
      },
    ],
    hints: [
      L('دار ما تقدرش تغبر. غير الورق اللي كيقدر. تبّع الورق.', 'البيت لا يختفي، الأوراق وحدها تختفي. تتبّع الأوراق.', 'Une maison ne disparaît pas ; seuls les papiers disparaissent. Suivez les papiers.', 'A house can’t vanish; only paperwork can. Follow the paperwork.'),
      L('السجل كيقول «تحيّد»، والقصاصة كتقول «تلغى». والبرية كتقول شكون كان خاصو يصحّح.', 'السجلّ يقول «سُحب»، والقصاصة تقول «أُلغي»، والرسالة تقول من كان عليه التصحيح.', 'Le registre dit « retirée », la coupure dit « annulé », la lettre dit qui devait corriger.', 'The register says “withdrawn”, the clipping says “annulled”, the letter says who had to fix it.'),
      L('العنوان تحيّد على قبل الهدم، الهدم تلغى، ومارو ما طلبش يرجع العنوان. اللي باقي غامض هو علاش بالضبط.', 'سُحب العنوان من أجل الهدم، ثم أُلغي الهدم، ولم يطلب مارو استعادة العنوان. يبقى الدافع الدقيق غامضًا.', 'Adresse retirée pour la démolition, démolition annulée, et Marrow n’a jamais demandé la réinscription. Reste à savoir pourquoi, au fond.', 'Address withdrawn for demolition, demolition annulled, and Marrow never applied to restore it. What stays unclear is exactly why.'),
    ],
  },

  endings: {
    strong: {
      title: L('الرقم 7، زنقة الدرّازة', '7، زقاق النسّاجين', '7, rue des Tisserands', '7 Weavers’ Lane'),
      text: L(
        'إدريس كتب سطر جديد فالدفتر، أول سطر من 1968: «العنوان باقي: الدار عمرها ما تهدّمات.» البلاكة الزرقا رجعات للباب. الشرجم المدوّر كيشوف للزنقة من جديد.',
        'كتب إدريس سطرًا جديدًا في الدفتر، الأول منذ 1968: «العنوان قائم: البيت لم يُهدم قط.» عادت اللوحة الزرقاء إلى الباب، وعادت النافذة المستديرة تطلّ على الشارع.',
        'Idris écrit une ligne dans le registre, la première depuis 1968 : « Adresse maintenue : la maison n’a jamais été démolie. » La plaque bleue retrouve la porte. La fenêtre ronde regarde de nouveau la rue.',
        'Idris writes a new line in the register, the first since 1968: “Address stands: the house was never demolished.” The blue plate goes back on the door. The round window looks out on the street again.',
      ),
    },
    partial: {
      title: L('دار بنص قصة', 'بيت بنصف حكاية', 'Une maison, une demi-histoire', 'A house with half a story'),
      text: L(
        'لقيتي الدار، ولكن الورق ما مربوطش مزيان. البلدية غادي تحتاج سلسلة كاملة باش تصحّح.',
        'وجدت البيت، لكن الأوراق غير مترابطة كفاية. ستحتاج البلدية سلسلة كاملة لتصحّح.',
        'Vous avez trouvé la maison, mais les papiers ne se tiennent pas encore. La mairie voudra une chaîne complète.',
        'You found the house, but the paperwork doesn’t hold together yet. The town hall will want a complete chain.',
      ),
    },
    incomplete: {
      title: L('العنوان باقي غابر', 'ما يزال العنوان غائبًا', 'L’adresse reste introuvable', 'The address is still missing'),
      text: L('الخلاصة ديالك ما كتمشيش مع السجلات. رجع للأرشيف.', 'استنتاجك لا يتّفق مع السجلات. عُد إلى الأرشيف.', 'Votre conclusion ne colle pas aux registres. Retournez aux archives.', 'Your conclusion doesn’t match the records. Go back to the archive.'),
    },
  },
  uncertainty: L(
    'مارو كتب: «دار ما عندهاش عنوان، حتى واحد ما كيجي يطيّحها.» ولكن كاين برية أخرى مسدودة، بلا سمية، ما تحلّاتش. وهو ما حلّهاش حتى هو.',
    'كتب مارو: «بيت بلا عنوان لا يأتي أحد ليهدمه.» لكن ثمة رسالة أخرى مغلقة، بلا اسم، لم تُفتح. ولم يفتحها هو أيضًا.',
    'Marrow a écrit : « Une maison sans adresse, personne ne vient la démolir. » Mais une autre lettre reste fermée, sans nom. Il ne l’a jamais ouverte non plus.',
    'Marrow wrote: “A house with no address, no one comes to knock down.” But another letter lies sealed, unnamed. He never opened it either.',
  ),
  noctaviae: {
    ending: L(
      '1931؟ رسم الودنين ديالي كبار بزاف. ولكن الهلال… الهلال صحيح.',
      '1931؟ رسم أذنيّ أكبر ممّا ينبغي. لكن الهلال… الهلال صحيح.',
      '1931 ? Il m’a dessiné les oreilles trop grandes. Mais le croissant… le croissant est juste.',
      '1931? He drew my ears too large. But the crescent… the crescent is right.',
    ),
  },
  facts: [
    { clue: 'map1955', text: L('فـ1955، الرقم 7 كان فزنقة الدرّازة.', 'في 1955 كان الرقم 7 في زقاق النسّاجين.', 'En 1955, le n° 7 existait rue des Tisserands.', 'In 1955, No. 7 stood on Weavers’ Lane.') },
    { clue: 'registry', text: L('العنوان تحيّد فـ1968 في انتظار الهدم.', 'سُحب العنوان سنة 1968 في انتظار الهدم.', 'L’adresse a été retirée en 1968 dans l’attente de la démolition.', 'The address was withdrawn in 1968 pending demolition.') },
    { clue: 'clipping', text: L('الهدم تلغى فـ1969.', 'أُلغي الهدم سنة 1969.', 'La démolition a été annulée en 1969.', 'The demolition was annulled in 1969.') },
    { clue: 'weathervane', text: L('الدار باقا واقفة ورا رقم 15.', 'البيت ما يزال قائمًا خلف الرقم 15.', 'La maison tient toujours debout derrière le n° 15.', 'The house still stands behind No. 15.') },
    { clue: 'letter', text: L('مارو عرف وما طلبش يرجع العنوان.', 'علم مارو ولم يطلب استعادة العنوان.', 'Marrow savait et n’a jamais demandé la réinscription.', 'Marrow knew and never applied to restore it.') },
  ],

  walkthrough: [
    ['visit', 'archive'], ['interact', 'ar_map55'], ['interact', 'ar_map70'], ['interact', 'ar_registry'], ['interact', 'ar_decree'], ['interact', 'ar_reply'],
    ['solve', 'c_maps', '13_15'],
    ['visit', 'square'], ['interact', 'sq_haddad'], ['interact', 'sq_well'],
    ['visit', 'newspaper'], ['interact', 'np_clipping'], ['interact', 'np_photo'],
    ['visit', 'archive'], ['solve', 'c_chain', ['built', 'm55', 'decree', 'annul', 'm70']],
    ['visit', 'street'], ['interact', 'st_13'], ['interact', 'st_15'], ['interact', 'st_vane'], ['solve', 'c_photo', { vane: 'hedge', window: 'nothing', lane: 'linden' }],
    ['visit', 'garden'], ['interact', 'gd_plate'], ['interact', 'gd_window'], ['interact', 'gd_door'], ['solve', 'c_word', 'Weavers'],
    ['visit', 'house'], ['interact', 'hs_desk'], ['interact', 'hs_plans'], ['use', 'crescent', 'hs_shelf'],
    ['visit', 'hidden'], ['interact', 'hd_letters'], ['interact', 'hd_note'], ['interact', 'hd_portrait'],
    ['connect', 'registry', 'decree'], ['connect', 'clipping', 'registry'], ['connect', 'photo', 'weathervane'], ['connect', 'letter', 'note'],
    ['connect', 'plate', 'map1955'], ['connect', 'neverexisted', 'map1955'],
    ['final', { q_what: 'withdrawn', q_silent: 'marrow', q_order: ['m55', 'decree', 'annul', 'm70'], q_contra: 'never', q_evidence: ['map1955', 'registry', 'clipping', 'letter', 'weathervane', 'photo'], q_open: 'why' }],
  ],
};
