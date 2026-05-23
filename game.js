/* Стани Брадат — clean production layout
   - Въпросите вървят последователно: лесни -> средни -> много трудни.
   - При грешен отговор играта спира и чака бутона „Нова игра“.
   - Играта приключва при 44/44.
   - Canvas: 1920x1080, скалира се като цяло към браузъра.
*/

const ASSETS = {
  neutral: 'assets/00-Neutral.png',
  positives: Array.from({length:10}, (_,i)=>`assets/${String(i+1).padStart(2,'0')}-Positive.png`),
  negatives: Array.from({length:5}, (_,i)=>`assets/${String(i+1).padStart(2,'0')}-Negative.png`)
};

const QUESTIONS = {
  easy: [
    { q: "Кой е създателят на глаголицата?", a: ["Братята Кирил и Методий", "Климент Охридски", "Константин Преславски", "Княз Борис I"], c: 0 },
    { q: "На кой празник отбелязваме делото на Св. Св. Кирил и Методий?", a: ["24 май", "3 март", "1 ноември", "6 септември"], c: 0 },
    { q: "Коя държава първа официално приема кирилицата като писменост?", a: ["България", "Византия", "Русия", "Сърбия"], c: 0 },
    { q: "Къде са родени братята Кирил и Методи?", a: ["гр. Солун", "гр. Плиска", "гр. Константинопол", "гр. Охрид"], c: 0 },
    { q: "Коя е първата българска столица, в която се използва кирилицата?", a: ["Преслав", "Плиска", "Търново", "София"], c: 0 },
    { q: "С колко букви се състои съвременната българска кирилица?", a: ["30 букви", "28 букви", "32 букви", "33 букви"], c: 0 },
    { q: "Кой славянски народ пръв приема кирилицата след българите?", a: ["Руснаците", "Сърбите", "Хърватите", "Поляците"], c: 0 },
    { q: "Коя международна организация използва кирилицата като една от официалните си азбуки?", a: ["Европейският съюз", "Организацията на обединените нации", "ЮНЕСКО", "НАТО"], c: 0 },
    { q: "Кой български книжовник разпространява делото на Кирил и Методий в Охрид?", a: ["Св. Климент Охридски", "Св. Наум", "Константин Преславски", "Йоан Екзарх"], c: 0 },
    { q: "Коя е единствената буква в кирилицата, която няма аналог в латиницата?", a: ["Ъ", "Ж", "Щ", "Ц"], c: 0 },
    { q: "Колко деца е имало семейството на братята Кирил и Методий?", a: ["Пет деца", "Шест деца", "Седем деца", "Осем деца"], c: 2 },
    { q: "Истинското име на Кирил е:", a: ["Кирил", "Константин", "Методий", "Климент"], c: 1 },
    { q: "Какво НЕ са правили Кирил и Методий?", a: ["Превеждали книги", "Обучавали ученици", "Разпространявали християнството", "Водили военни походи"], c: 3 },
    { q: "В колко държави кирилицата е официална азбука?", a: ["В 5 държави", "В 8 държави", "В 12 държави", "В над 20 държави"], c: 2 },
  ],
  medium: [
    { q: "През коя година е създадена глаголицата?", a: ["В периода 855 – 862 г.", "През 681 г.", "Около 900 г.", "През 1018 г."], c: 0 },
    { q: "През коя година започва историята на българската азбука?", a: ["862 г.", "681 г.", "893 г.", "1014 г."], c: 0 },
    { q: "От кого е създадена Преславската книжовна школа?", a: ["От княз Борис I", "От цар Симеон I", "От цар Петър I", "От Климент Охридски"], c: 0 },
    { q: "Къде е създадена кирилицата?", a: ["В Преславската книжовна школа през 971 г.", "В Охридската книжовна школа", "В Константинопол", "В Рим"], c: 0 },
    { q: "В кой град през 1651 г. е издадена първата печатна книга на новобългарски език?", a: ["Рим", "Венеция", "Виена", "Букурещ"], c: 0 },
    { q: "В коя държава е отпечатана първата книга на кирилица, наречена „Осмогласник“ (Октоих)?", a: ["Полша", "България", "Русия", "Италия"], c: 0 },
    { q: "През 1835 г. се поставя основата на книгопечатането в България. От кого?", a: ["Никола Карастоянов", "Петър Берон", "Софроний Врачански", "Христо Г. Данов"], c: 0 },
    { q: "Кой български учен създава първата българска граматика?", a: ["Неофит Рилски", "Йоаким Груев", "Васил Априлов", "Любен Каравелов"], c: 0 },
    { q: "Как се нарича произведението, което защитава славянската писменост и език?", a: ["„За буквите“ (Черноризец Храбър)", "„История славянобългарска“", "„Азбучна молитва“", "„Шестоднев“"], c: 0 },
    { q: "В коя школа отива да учи Методий, когато става на 15 години?", a: ["Охридската книжовна школа", "Преславската книжовна школа", "Магнаурската школа", "Солунската богословска школа"], c: 2 },
    { q: "Защо Солунските братя Кирил и Методий са канонизирани за светци?", a: ["Защото са били византийски държавници", "Защото са водили военни походи", "Заради превода на Библията на старобългарски език", "Защото са били монаси в Солун"], c: 2 },
    { q: "Какви са фамилиите на Кирил и Методий?", a: ["Солунски", "Философови", "Кирилов и Методиев", "Нямат фамилии в съвременния смисъл"], c: 3 },
    { q: "Какво означава „Солунски“ в името на Кирил и Методий?", a: ["Фамилно име", "Манастирски орден", "Прякор", "Градът, от който произхождат"], c: 3 },
  ],
  hard: [
    { q: "В кой документ за първи път присъства кирилицата?", a: ["Във Ватопедската грамота на цар Иван Асен II", "В Златната булла", "В Търновската конституция", "В Синодика на цар Борил"], c: 0 },
    { q: "Колко букви е съдържала първоначалната версия на кирилицата, създадена от Климент Охридски?", a: ["30 букви", "40 букви", "46 букви", "52 букви"], c: 2 },
    { q: "Кой е най-ранният открит надпис на кирилица на българска територия?", a: ["от 1015 г.", "от 950 г.", "от 921 г.", "от 800 г."], c: 2 },
    { q: "Кога наименованието „кирилица“ се появява за първи път исторически?", a: ["1200 г.", "1415 г.", "1563 г.", "1700 г."], c: 2 },
    { q: "В колко държави кирилицата е официална към днешни дни?", a: ["около 10", "около 20", "около 15", "над 30"], c: 2 },
    { q: "През коя година кирилицата става официална азбука на Европейския съюз?", a: ["1999 г.", "2004 г.", "2007 г.", "2014 г."], c: 2 },
    { q: "В коя литературна школа е формализирана ранната кирилица през IX век?", a: ["Солунската школа", "Константинополската школа", "Преславската книжовна школа", "Охридската школа"], c: 2 },
    { q: "Коя азбука предхожда кирилицата и е била създадена първоначално от св. Кирил?", a: ["Гръцката", "Латинската", "Глаголицата", "Руните"], c: 2 },
    { q: "Коя голяма държава прави реформа на кирилицата през XVIII век, известна като граждански шрифт?", a: ["Украйна", "България", "Русия", "Сърбия"], c: 2 },
    { q: "Къде са намерени най-ранните оцелели кирилски надписи, според историците?", a: ["София", "Велико Търново", "Преслав и близкия манастир", "Битоля"], c: 2 },
    { q: "От коя по-стара азбука се влияе формата на кирилицата?", a: ["Египетски йероглифи", "Гръцка уставна (uncial) азбука", "Латински курсив", "Арабска писменост"], c: 1 },
    { q: "Имат ли разлики българската и руската кирилица?", a: ["Не, те са напълно еднакви", "Да, различават се само по произношение", "Да, различават се по формата на буквите и броя им", "Да, но само в ръкописното писане"], c: 2 },
    { q: "Когато инсталираме компютъра си, на каква кирилица се показват буквите по подразбиране?", a: ["На българска кирилица", "На сръбска кирилица", "На руска кирилица", "На старобългарска кирилица"], c: 2 },
    { q: "Коя е основната разлика при изписването на българската и руската кирилица?", a: ["Произношението на буквите", "Броят на буквите", "Формата на печатните букви", "Подредбата на азбуката"], c: 2 },
    { q: "Защо българската кирилица по-рядко се използва в компютърните шрифтове?", a: ["Защото не е официална азбука", "Защото няма стандарт в Unicode", "Защото повечето шрифтове са разработени по руски типографски модел", "Защото е по-стара от латиницата"], c: 2 },
    { q: "Кое българско типографско студио е най-разпознаваемо в световен мащаб?", a: ["Cyrillic Design Lab", "Balkan Type", "Fontfabric", "Sofia Fonts"], c: 2 },
    { q: "Какво означава, че един шрифт има „българска кирилица“?", a: ["Че е създаден в България", "Че съдържа кирилски букви", "Че формите на буквите са по българския типографски модел", "Че е безплатен"], c: 2 },
  ]
};

const ORDERED_QUESTIONS = [...QUESTIONS.easy, ...QUESTIONS.medium, ...QUESTIONS.hard];

let positivePool = [];
let negativePool = [];
let state = null;

const UI = {};

function shuffle(arr){
  const a = arr.slice();
  for(let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function refillPools(){
  if(positivePool.length === 0) positivePool = shuffle(ASSETS.positives);
  if(negativePool.length === 0) negativePool = shuffle(ASSETS.negatives);
}
function nextPositive(){ refillPools(); return positivePool.pop(); }
function nextNegative(){ refillPools(); return negativePool.pop(); }

function scaleGame(){
  const root = UI.root || document.getElementById('gameRoot');
  if(!root) return;

  const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
  root.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

function gradeFromKnown(known){
  if(known >= 30) return '6';
  if(known >= 20) return '5';
  if(known >= 10) return '4';
  return '—';
}

function updateStats(){
  UI.knownValue.textContent = String(state.known);
  UI.gradeValue.textContent = gradeFromKnown(state.known);
}

function setNextEnabled(enabled){
  UI.btnNext.classList.toggle('is-disabled', !enabled);
}

function clearAnswerStates(){
  UI.answers.forEach(btn => {
    btn.classList.remove('correct', 'wrong', 'locked');
    btn.disabled = false;
  });
}

function lockAnswers(){
  UI.answers.forEach(btn => {
    btn.classList.add('locked');
    btn.disabled = true;
  });
}

function currentQuestion(){
  return ORDERED_QUESTIONS[state.index];
}

function renderQuestion(){
  const q = currentQuestion();

  UI.question.textContent = q.q;

  const options = shuffle(q.a.map((text, originalIndex) => ({ text, originalIndex })));
  state.options = options;

  clearAnswerStates();
  UI.answers.forEach((btn, i) => {
    btn.querySelector('span').textContent = options[i].text;
  });

  UI.stageImg.src = ASSETS.neutral;
  setNextEnabled(false);
  updateStats();
}

function startNewGame(){
  positivePool = [];
  negativePool = [];

  state = {
    index: 0,
    known: 0,
    options: [],
    answered: false,
    failed: false,
    finished: false
  };

  renderQuestion();
}

function finishGame(){
  state.finished = true;
  UI.question.textContent = 'БРАВО! Позна всички въпроси!';
  UI.stageImg.src = nextPositive();
  lockAnswers();
  setNextEnabled(false);
  updateStats();
}

function onAnswerClick(position){
  if(!state || state.answered || state.failed || state.finished) return;

  const q = currentQuestion();
  const selected = state.options[position];
  const isCorrect = selected.originalIndex === q.c;

  state.answered = true;
  lockAnswers();

  UI.answers.forEach((btn, i) => {
    const option = state.options[i];
    if(option.originalIndex === q.c) btn.classList.add('correct');
    if(i === position && !isCorrect) btn.classList.add('wrong');
  });

  if(isCorrect){
    state.known++;
    UI.stageImg.src = nextPositive();
    updateStats();

    if(state.index >= ORDERED_QUESTIONS.length - 1){
      setTimeout(finishGame, 300);
    } else {
      setNextEnabled(true);
    }
  } else {
    state.failed = true;
    UI.stageImg.src = nextNegative();
    UI.question.textContent = 'Грешен отговор! Натисни „Нова игра“, за да започнеш отначало.';
    setNextEnabled(false);
  }
}

function onNextClick(){
  if(!state || state.failed || state.finished || !state.answered) return;
  if(UI.btnNext.classList.contains('is-disabled')) return;

  state.index++;
  state.answered = false;
  renderQuestion();
}

function init(){
  UI.root = document.getElementById('gameRoot');
  UI.stageImg = document.getElementById('stageImg');
  UI.btnNewGame = document.getElementById('btnNewGame');
  UI.btnNext = document.getElementById('btnNext');
  UI.knownValue = document.getElementById('knownValue');
  UI.gradeValue = document.getElementById('gradeValue');
  UI.question = document.getElementById('question');
  UI.answers = Array.from(document.querySelectorAll('.answer'));

  UI.btnNewGame.addEventListener('click', startNewGame);
  UI.btnNext.addEventListener('click', onNextClick);
  UI.answers.forEach((btn, i) => btn.addEventListener('click', () => onAnswerClick(i)));

  window.addEventListener('resize', scaleGame);
  window.addEventListener('orientationchange', scaleGame);

  scaleGame();
  startNewGame();
}

window.addEventListener('DOMContentLoaded', init);
window.addEventListener('load', scaleGame);
