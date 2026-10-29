import { L } from '../i18n.js';

// Interface strings. Order of arguments: Darija, Arabic (MSA), French, English.
export const UI = {
  // ── General
  appName: L('نوكتافيا', 'نوكتافيا', 'NOCTAVIAE', 'NOCTAVIAE'),
  townName: L('هولومير', 'هولومير', 'Hollowmere', 'Hollowmere'),
  close: L('سدّ', 'إغلاق', 'Fermer', 'Close'),
  back: L('رجع', 'رجوع', 'Retour', 'Back'),
  cancel: L('لا، رجع', 'إلغاء', 'Annuler', 'Cancel'),
  confirm: L('أكّد', 'تأكيد', 'Confirmer', 'Confirm'),
  continue: L('كمّل', 'متابعة', 'Continuer', 'Continue'),
  skip: L('دوّز', 'تخطٍّ', 'Passer', 'Skip'),
  menu: L('القائمة', 'القائمة', 'Menu', 'Menu'),
  settings: L('الإعدادات', 'الإعدادات', 'Réglages', 'Settings'),
  language: L('اللغة', 'اللغة', 'Langue', 'Language'),
  sound: L('الصوت', 'الصوت', 'Son', 'Sound'),
  soundOn: L('الصوت خدّام', 'الصوت مُفعَّل', 'Son activé', 'Sound on'),
  soundOff: L('الصوت مطفي', 'الصوت متوقف', 'Son coupé', 'Sound off'),
  motion: L('الحركة', 'الحركة', 'Animations', 'Motion'),
  motionSystem: L('بحال الجهاز', 'حسب الجهاز', 'Selon l’appareil', 'Device setting'),
  motionFull: L('كاملة', 'كاملة', 'Complètes', 'Full'),
  motionReduced: L('خفيفة', 'مخفَّفة', 'Réduites', 'Reduced'),
  loading: L('كيتحمّل…', 'جارٍ التحميل…', 'Chargement…', 'Loading…'),

  // ── Title
  titleTagline: L(
    'مدينة صغيرة. بزاف ديال الأوراق. شي حاجة ما مسجّلاش.',
    'بلدة صغيرة، وسجلات كثيرة، وشيء لم يُسجَّل قط.',
    'Une petite ville. Beaucoup d’archives. Une chose jamais consignée.',
    'A small town. A great many records. One thing never written down.',
  ),
  titleInvestigate: L('بدا التحقيق', 'ابدأ التحقيق', 'Enquêter', 'Investigate'),
  titleContinue: L('كمّل التحقيق', 'تابِع التحقيق', 'Reprendre l’enquête', 'Continue investigation'),
  titleContinueCase: L('القضية: {case}', 'القضية: {case}', 'Affaire : {case}', 'Case: {case}'),
  titleEvents: L('دخل لحدث', 'الانضمام إلى فعالية', 'Rejoindre un événement', 'Join an event'),
  titleHint: L(
    'القطة كتشوف داكشي اللي الناس كيدوّزو.',
    'القطة ترى ما يغفل عنه الناس.',
    'La chatte voit ce que les gens laissent passer.',
    'The cat sees what people walk past.',
  ),

  // ── Case selection
  casesTitle: L('ختار قضية', 'اختر قضية', 'Choisissez une affaire', 'Choose a case'),
  casesSubtitle: L(
    'تلاتة ديال الملفات مفتوحين على مكتب هولومير.',
    'ثلاثة ملفات مفتوحة على مكتب هولومير.',
    'Trois dossiers restent ouverts sur le bureau de Hollowmere.',
    'Three files lie open on Hollowmere’s desk.',
  ),
  caseNew: L('جديدة', 'جديدة', 'Nouvelle', 'New'),
  caseInProgress: L('فالطريق', 'قيد التحقيق', 'En cours', 'In progress'),
  caseCompleted: L('مسدودة', 'مكتملة', 'Close', 'Completed'),
  caseBegin: L('حلّ الملف', 'افتح الملف', 'Ouvrir le dossier', 'Open the file'),
  caseResume: L('كمّل من فين حبستي', 'تابِع من حيث توقفت', 'Reprendre où vous étiez', 'Resume where you left off'),
  caseReplay: L('عاود من اللول', 'أعِد من البداية', 'Rejouer depuis le début', 'Replay from the start'),
  caseFileNo: L('ملف رقم {n}', 'ملف رقم {n}', 'Dossier n° {n}', 'File no. {n}'),
  caseBestScore: L('أحسن نقطة: {score}', 'أفضل نتيجة: {score}', 'Meilleur score : {score}', 'Best score: {score}'),
  replayTitle: L('تعاود القضية من اللول؟', 'إعادة القضية من البداية؟', 'Rejouer cette affaire ?', 'Replay this case?'),
  replayBody: L(
    'غادي يتمسح التقدم ديال هاد القضية بوحدها: الأدلة، الحوايج، الألغاز، النقط ديال التلميحات والتلميحات اللي شريتي. أحسن نقطة كتبقى محفوظة. القضايا الأخرى ما كيتقاسوش.',
    'سيُمحى تقدّم هذه القضية وحدها: الأدلة والأغراض والألغاز ونقاط التلميح والتلميحات المشتراة. تبقى أفضل نتيجة محفوظة، ولا تتأثر القضايا الأخرى.',
    'Seule la progression de cette affaire sera effacée : preuves, objets, énigmes, points d’indice et indices achetés. Le meilleur score est conservé. Les autres affaires ne sont pas touchées.',
    'Only this case’s progress will be erased: evidence, items, puzzles, hint points and purchased hints. Your best score is kept. Other cases are not affected.',
  ),

  // ── Radio
  radioTuning: L('كنقلّب على الموجة…', 'جارٍ ضبط الموجة…', 'Recherche de la fréquence…', 'Tuning…'),
  radioSignal: L('الإشارة', 'الإشارة', 'Signal', 'Signal'),
  radioTurnOn: L('شعل الراديو', 'شغّل المذياع', 'Allumer la radio', 'Switch on the radio'),
  radioNext: L('الجملة الجاية', 'العبارة التالية', 'Suite', 'Next line'),
  radioTranscript: L('النص ديال الإذاعة', 'نص البث', 'Transcription', 'Transcript'),
  radioLost: L('الإشارة تقطعات', 'انقطعت الإشارة', 'Signal perdu', 'Signal lost'),

  // ── Reveal
  revealWelcome: L('مرحبا بيك ف', 'مرحبًا بك في', 'Bienvenue à', 'Welcome to'),
  revealEnter: L('دخل للمدينة', 'ادخل البلدة', 'Entrer dans la ville', 'Enter the town'),
  revealObjective: L('أول خطوة', 'الخطوة الأولى', 'Premier objectif', 'First objective'),
};
