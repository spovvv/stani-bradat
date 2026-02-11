/* Стани Брадат - логика (UI2)
   Правила:
   - Въпросите вървят последователно по трудност: Лесни -> Средни -> Много трудни.
   - Играта свършва, когато познаеш всички 44 въпроса (в този ред).
   - При грешен отговор: играта започва отначало (прогресът се нулира).
   - Текуща оценка: 4 при 10 познати, 5 при 20, 6 при 30. Преди това НЕ показваме оценка.
   - Фонове при верен/грешен отговор се сменят без повторение, докато се изчерпат.
*/

const ASSETS = {
  neutral: 'assets/00-Neutral.png',
  positives: Array.from({length: 10}, (_,i)=>`assets/${String(i+1).padStart(2,'0')}-Positive.png`),
  negatives: Array.from({length: 5}, (_,i)=>`assets/${String(i+1).padStart(2,'0')}-Negative.png`),
};

let positivePool = [];
let negativePool = [];

function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){ 
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function refillPools(){
  if(positivePool.length===0) positivePool = shuffle(ASSETS.positives);
  if(negativePool.length===0) negativePool = shuffle(ASSETS.negatives);
}
function nextPositive(){ refillPools(); return positivePool.pop(); }
function nextNegative(){ refillPools(); return negativePool.pop(); }

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

const ORDERED_QUESTIONS = [...QUESTIONS.easy, ...QUESTIONS.medium, ...QUESTIONS.hard]; // 44

const UI = {
  knownEl: document.getElementById('knownValue'),
  gradeEl: document.getElementById('gradeValue'),
  gradeStat: document.getElementById('gradeStat'),
  questionEl: document.getElementById('question'),
  stageImg: document.getElementById('stageImg'),
  answers: Array.from(document.querySelectorAll('.answer')),
  btnNext: document.getElementById('btnNext'),
  btnNewGame: document.getElementById('btnNewGame'),
};

let game = null;

function gradeForKnown(known){
  if(known>=30) return "6";
  if(known>=20) return "5";
  if(known>=10) return "4";
  return "—";
}

function setNextEnabled(enabled){
  if(enabled){
    UI.btnNext.classList.remove('is-disabled');
    UI.btnNext.classList.add('is-active');
  } else {
    UI.btnNext.classList.add('is-disabled');
    UI.btnNext.classList.remove('is-active');
  }
}

function lockAnswers(){ UI.answers.forEach(btn=>btn.classList.add('is-locked')); }
function unlockAnswers(){ UI.answers.forEach(btn=>btn.classList.remove('is-locked')); }

function updateStats(){
  UI.knownEl.textContent = String(game.known);
  UI.gradeEl.textContent = gradeForKnown(game.known);
}

function startNewGame(){
  positivePool = [];
  negativePool = [];

  game = {
    pos: 0,
    known: 0,
    locked: false,
    lastOptions: null,
    finished: false,
    failed: false,
  };

  UI.stageImg.src = ASSETS.neutral;
  setNextEnabled(false);
  unlockAnswers();
  game.locked = false;
  game.finished = false;

  updateStats();
  render();
}

function render(){
  if(game.finished){
    UI.questionEl.textContent = 'БРАВО! Позна всички въпроси!';
    UI.answers.forEach(btn=>{
      btn.classList.add('is-locked');
      btn.querySelector('.answer-text').textContent = '';
    });
    setNextEnabled(false);
    updateStats();
    return;
  }

  const q = ORDERED_QUESTIONS[game.pos];
  UI.questionEl.textContent = q.q;

  const opts = q.a.map((t, idx)=>({t, idx}));
  const shuffled = shuffle(opts);
  game.lastOptions = shuffled;

  UI.answers.forEach((btn, i)=>{
    btn.classList.remove('is-correct','is-wrong');
    btn.querySelector('.answer-text').textContent = shuffled[i].t;
  });

  updateStats();
}

function markButtons(selectedOrigIdx){
  const q = ORDERED_QUESTIONS[game.pos];
  UI.answers.forEach((btn, pos)=>{
    const origIdx = game.lastOptions[pos].idx;
    if(origIdx === q.c) btn.classList.add('is-correct');
    if(origIdx === selectedOrigIdx && selectedOrigIdx !== q.c) btn.classList.add('is-wrong');
  });
}

function onAnswerClick(pos){
  if(!game || game.locked || game.finished || game.failed) return;
  const q = ORDERED_QUESTIONS[game.pos];
  const selectedOrigIdx = game.lastOptions[pos].idx;
  const isCorrect = selectedOrigIdx === q.c;

  game.locked = true;
  lockAnswers();
  markButtons(selectedOrigIdx);

  if(isCorrect){
    game.known += 1;
    UI.stageImg.src = nextPositive();
    updateStats();
    setNextEnabled(true);

    if(game.pos >= ORDERED_QUESTIONS.length - 1){
      game.finished = true;
      setTimeout(()=>render(), 350);
      return;
    }
  } else {
    UI.stageImg.src = nextNegative();
    setNextEnabled(false);

    // stop the game on wrong answer; restart only via "Нова игра"
    game.failed = true;
    UI.questionEl.textContent = 'Грешен отговор! Натисни „Нова игра“, за да започнеш отначало.';
    lockAnswers();
  }
}

function onNext(){
  if(!game || game.finished || game.failed) return;
  if(UI.btnNext.classList.contains('is-disabled')) return;

  UI.stageImg.src = ASSETS.neutral;
  setNextEnabled(false);
  game.locked = false;
  unlockAnswers();

  game.pos += 1;
  render();
}

function bind(){
  UI.btnNewGame.addEventListener('click', ()=> startNewGame());
  UI.btnNext.addEventListener('click', ()=> onNext());
  UI.answers.forEach((btn, i)=>{
    btn.addEventListener('click', ()=> onAnswerClick(i));
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  bind();
  startNewGame();
});


// === Fit the whole UI into the current browser viewport (no cropping) ===
(function(){
  const BASE_W = 1920;
  const BASE_H = 1080;

  function applyScale(){
    const viewport = document.getElementById('viewport');
    if(!viewport) return;
    const scale = Math.min(window.innerWidth / BASE_W, window.innerHeight / BASE_H);
    viewport.style.transform = `scale(${scale})`;
  }

  window.addEventListener('resize', applyScale);
  document.addEventListener('DOMContentLoaded', applyScale);
})();
