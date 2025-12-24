/* ==========================================================================
   LEARN & GO - ENGINE (V3.2 FINAL CORE)
   ========================================================================== */
let currentLang = localStorage.getItem('userLang') || 'ru';
let autoMode = localStorage.getItem('autoMode') !== 'false';
let currentLessonData = [];
let currentStep = 0;
let lives = 5;
let currentLessonId = null;
let stepHistory = []; // Хранит результаты ('correct'/'wrong') для каждого шага

window.onload = function() {
    initTheme();
    
    if (typeof translations === 'undefined') {
        console.error("translations.js не найден!");
        return;
    }

    const t = translations[currentLang];
    
    // 1. Полная локализация статического интерфейса
    document.getElementById('next-btn').innerText = t.ui_go;
    document.getElementById('ui-modal-close').innerText = t.ui_modal_ok;
    document.getElementById('ui-back-btn').innerText = t.ui_back;
    
    // Локализация фидбека (если блок есть в HTML)
    const feedTitle = document.getElementById('ui-feed-title');
    if (feedTitle) feedTitle.innerText = t.ui_feed_t;
    const feedSend = document.getElementById('ui-feed-send');
    if (feedSend) feedSend.innerText = t.ui_feed_s;

    document.querySelectorAll('.ui-auto-label').forEach(el => el.innerText = t.ui_auto);
    document.querySelectorAll('.auto-mode-check').forEach(el => el.checked = autoMode);

    // 2. Отрисовка динамического меню
    renderMenu();
};

/**
 * Генерация кнопок уроков и категорий
 */
function renderMenu() {
    const t = translations[currentLang];
    const menuBox = document.getElementById('menu-buttons');
    if (!menuBox) return;
    menuBox.innerHTML = '';

    // Кнопка общей теории
    const theoryBtn = document.createElement('button');
    theoryBtn.className = 'btn btn-theory btn-lg mb-4 py-3 w-100 shadow-sm';
    theoryBtn.innerHTML = `📖 ${t.ui_theory}`;
    theoryBtn.onclick = () => showHelp(false);
    menuBox.appendChild(theoryBtn);

    const createHeader = (text) => {
        const h = document.createElement('div');
        h.className = 'category-header'; h.innerText = text; menuBox.appendChild(h);
    };

    upr.forEach((item, index) => {
        const num = index + 1;
        if (num === 1) createHeader(t.ui_base);
        if (num === 7) createHeader(t.ui_pref);
        
        const btn = document.createElement('button');
        const title = item[0].exver;
        const isExam = title.toLowerCase().includes('экзамен') || title.toLowerCase().includes('exam');

        btn.className = isExam ? 'btn btn-exam-custom btn-lg mt-2 mb-3 py-3 w-100 shadow-sm' 
                               : 'btn btn-primary btn-lg mb-2 w-100 d-flex align-items-center shadow-sm text-white border-0';
        
        // Если это экзамен, берем перевод слова "Экзамен" из словаря
        const displayTitle = isExam ? `🏆 ${t.ui_exam}` : `<span class="lesson-num me-2">${num}.</span> <span class="lesson-title text-start">${title}</span>`;
        
        btn.innerHTML = displayTitle;
        btn.onclick = () => getupr(num);
        menuBox.appendChild(btn);
    });

    // Настройка селектора языков
    const ls = document.getElementById('langSelect');
    if (ls) {
        ls.innerHTML = '';
        for (let code in translations) {
            const opt = document.createElement('option'); opt.value = code; opt.innerText = translations[code].name;
            opt.selected = (code === currentLang); ls.appendChild(opt);
        }
    }
}

/**
 * Сохранение состояния (Seamless Resume)
 */
function saveState() {
    if (!currentLessonId) return;
    localStorage.setItem('activeLesson', JSON.stringify({
        id: currentLessonId,
        step: currentStep,
        lives: lives,
        data: currentLessonData,
        history: stepHistory,
        title: document.getElementById('upr-title').innerText
    }));
}

/**
 * Инициализация или восстановление урока
 */
function getupr(num) {
    const t = translations[currentLang];
    const saved = JSON.parse(localStorage.getItem('activeLesson'));

    // ВОССТАНОВЛЕНИЕ: если ID совпадает
    if (saved && saved.id === num) {
        currentLessonId = saved.id;
        currentLessonData = saved.data;
        currentStep = saved.step;
        lives = saved.lives;
        stepHistory = saved.history || [];
        
        setupExerciseUI(saved.title);
        createSegments(currentLessonData.length);
        
        // Красим сегменты согласно истории
        stepHistory.forEach((status, i) => updateSegment(i, status));
        showStep();
        return;
    }

    // НОВЫЙ СТАРТ
    currentLessonId = num;
    stepHistory = [];
    let data;
    if (num === 6) data = generateExam([0,1,2,3,4], t.ui_exam);
    else if (num === 11) data = generateExam([6,7,8,9], t.ui_exam);
    else data = JSON.parse(JSON.stringify(upr[num-1]));
    
    startExercise(data);
}

function startExercise(data) {
    const header = data.shift();
    const isExam = header.exver.toLowerCase().includes('экзамен') || header.exver.toLowerCase().includes('exam');
    if (!isExam) data.sort(() => Math.random() - 0.5);
    
    currentLessonData = data; 
    currentStep = 0; 
    lives = 5;

    setupExerciseUI(header.exver);
    createSegments(data.length);
    
    if (isExam) {
        document.getElementById('lives-counter').classList.remove('d-none'); 
        updateLivesUI();
    } else { 
        document.getElementById('lives-counter').classList.add('d-none'); 
    }
    showStep();
}

function setupExerciseUI(title) {
    document.getElementById('main-menu').classList.add('d-none');
    document.getElementById('exercise-area').classList.remove('d-none');
    document.getElementById('upr-title').innerText = title;
    document.getElementById('footer-main').classList.add('d-none');
    const footEx = document.getElementById('footer-exercise');
    footEx.classList.remove('d-none'); footEx.classList.add('d-flex');
}

/**
 * Логика шага и обработки ответа
 */
function showStep() {
    if (currentStep >= currentLessonData.length) { 
        showResult(true); 
        return; 
    }
    
    saveState();
    const item = currentLessonData[currentStep];
    const correct = item.ans[0];
    const nextBtn = document.getElementById('next-btn'); 
    nextBtn.disabled = true;
    
    updateSegment(currentStep, 'active');
    
    // Отрисовка пропуска
    const gapHtml = `<span class="gap-line" id="current-gap">${correct}</span>`;
    document.getElementById('upr-text').innerHTML = item.ex.replace(/_+/g, gapHtml);
    document.getElementById('question-counter').innerText = `${translations[currentLang].ui_q} ${currentStep + 1}/${currentLessonData.length}`;
    
    const btnBox = document.getElementById('upr-buttons'); 
    btnBox.innerHTML = '';
    
    [...item.ans].sort(() => Math.random() - 0.5).forEach(opt => {
        const b = document.createElement('button'); 
        b.className = 'btn btn-outline-primary btn-lg py-3 fw-bold';
        b.innerText = opt;
        b.onclick = () => {
            document.querySelectorAll('#upr-buttons button').forEach(el => el.disabled = true);
            document.getElementById('current-gap').classList.add('revealed');
            
            if (opt === correct) {
                stepHistory[currentStep] = 'correct';
                updateSegment(currentStep, 'correct');
                b.className = 'btn btn-success btn-lg py-3 text-white shadow';
                if (autoMode) setTimeout(nextQuestion, 1200); else nextBtn.disabled = false;
            } else {
                stepHistory[currentStep] = 'wrong';
                updateSegment(currentStep, 'wrong');
                b.className = 'btn btn-danger btn-lg py-3 text-white shadow';
                document.querySelectorAll('#upr-buttons button').forEach(el => {
                    if (el.innerText === correct) el.className = 'btn btn-success btn-lg py-3 text-white opacity-75';
                });
                
                if (autoMode) setTimeout(nextQuestion, 2000); else nextBtn.disabled = false;
                
                if (!document.getElementById('lives-counter').classList.contains('d-none')) {
                    lives--; updateLivesUI(); 
                    if (lives <= 0) setTimeout(() => showResult(false), 600);
                }
            }
        };
        btnBox.appendChild(b);
    });
}

/**
 * Окно результатов
 */
function showResult(isWin) {
    const m = new bootstrap.Modal(document.getElementById('resultModal'));
    const t = translations[currentLang];
    const uprTitle = document.getElementById('upr-title').innerText;
    
    // Проверка: экзамен это или обычный урок
    const isExam = uprTitle.toLowerCase().includes('экзамен') || uprTitle.toLowerCase().includes('exam');

    document.getElementById('modal-icon').innerHTML = isWin ? (isExam ? '🏆' : '🎉') : '😟';
    document.getElementById('modal-title').innerText = isWin ? t.ui_win : t.ui_fail;
    
    // Текст описания из словаря
    let desc = isWin ? t.ui_win_desc : t.ui_fail_desc;
    if (isWin && isExam) desc = t.ui_exam_win_desc;
    
    document.getElementById('modal-text').innerText = desc;
    document.getElementById('ui-modal-close').innerText = t.ui_modal_ok;

    localStorage.removeItem('activeLesson');
    m.show();

    document.getElementById('resultModal').addEventListener('hidden.bs.modal', () => {
        location.reload();
    }, { once: true });
}

/**
 * Умная подсказка (Контекстная теория)
 */
function showHelp(isContext = false) {
    const m = new bootstrap.Modal(document.getElementById('resultModal'));
    const theory = theoryContent[currentLang] || theoryContent['ru'];
    let content = theory.general;

    if (isContext && currentLessonId) {
        const key = `lesson_${currentLessonId}`;
        if (theory[key]) content = theory[key];
    }

    document.getElementById('modal-icon').innerHTML = '📖';
    document.getElementById('modal-title').innerText = content.title;
    document.getElementById('modal-text').innerHTML = content.text;
    document.getElementById('ui-modal-close').innerText = translations[currentLang].ui_modal_ok;
    m.show();
}

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---

function createSegments(total) {
    const container = document.getElementById('segments-container');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < total; i++) {
        const seg = document.createElement('div');
        seg.className = 'segment'; seg.id = `seg-${i}`;
        container.appendChild(seg);
    }
}

function updateSegment(index, status) {
    const seg = document.getElementById(`seg-${index}`);
    if (seg) { 
        seg.classList.remove('active', 'correct', 'wrong'); 
        if (status) seg.classList.add(status); 
    }
}

function initTheme() {
    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => btn.innerText = saved === 'dark' ? '☀️' : '🌙');
}

function toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => btn.innerText = next === 'dark' ? '☀️' : '🌙');
}

function toggleAutoMode(val) { autoMode = val; localStorage.setItem('autoMode', val); }

function updateLivesUI() {
    const container = document.getElementById('lives-counter');
    container.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const img = document.createElement('img');
        img.src = 'images/logo_hum.png';
        img.className = i < lives ? 'life-icon' : 'life-icon life-lost';
        if (i >= lives) img.style.opacity = '0.2';
        container.appendChild(img);
    }
}

function nextQuestion() { currentStep++; showStep(); }
function exitToMenu() { location.reload(); }
function changeLang(l) { localStorage.setItem('userLang', l); location.reload(); }

function generateExam(ids, title) {
    let pool = []; 
    ids.forEach(i => { if (upr[i]) pool = pool.concat(upr[i].slice(1)); });
    pool.sort(() => Math.random() - 0.5); 
    return [{ exver: title }, ...pool.slice(0, 30)];
}

function openFeedbackModal() {
    const m = new bootstrap.Modal(document.getElementById('feedbackModal'));
    const cur = currentLessonData[currentStep] || { ex: "Menu" };
    window.lastErrorMeta = { id: cur.id || "N/A", lesson: document.getElementById('upr-title').innerText, q: cur.ex };
    m.show();
}

function sendFeedback() {
    const body = `Error report: ${document.getElementById('feedbackText').value}\nContext: ${JSON.stringify(window.lastErrorMeta)}`;
    window.location.href = `mailto:admin@rki.today?subject=Report&body=${encodeURIComponent(body)}`;
}