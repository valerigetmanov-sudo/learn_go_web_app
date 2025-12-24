/* ==========================================================================
   LEARN & GO - ENGINE (V3.0 FINAL CORE)
   ========================================================================== */
let currentLang = localStorage.getItem('userLang') || 'ru';
let autoMode = localStorage.getItem('autoMode') !== 'false';
let currentLessonData = [];
let currentStep = 0;
let lives = 5;
let currentLessonId = null;

window.onload = function() {
    initTheme();
    
    // Проверка наличия объекта переводов
    if (typeof translations === 'undefined') {
        console.error("translations.js не загружен!");
        return;
    }

    const t = translations[currentLang];
    const menuBox = document.getElementById('menu-buttons');
    if (!menuBox) return;

    // Локализация интерфейса
    document.getElementById('next-btn').innerText = t.ui_go;
    document.getElementById('ui-modal-close').innerText = t.ui_modal_ok;
    document.getElementById('ui-back-btn').innerText = t.ui_back;
    document.querySelectorAll('.ui-auto-label').forEach(el => el.innerText = t.ui_auto);
    document.querySelectorAll('.auto-mode-check').forEach(el => el.checked = autoMode);

    // Отрисовка меню
    renderMenu();
};

/**
 * Отрисовка кнопок в главном меню
 */
function renderMenu() {
    const t = translations[currentLang];
    const menuBox = document.getElementById('menu-buttons');
    menuBox.innerHTML = '';

    // Кнопка Теория (Общая база)
    const theoryBtn = document.createElement('button');
    theoryBtn.className = 'btn btn-theory btn-lg mb-4 py-3 w-100 shadow-sm';
    theoryBtn.innerHTML = `📖 ${t.ui_theory}`;
    theoryBtn.onclick = () => showHelp(false); // false = общая теория
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
        const isExam = title.toLowerCase().includes('экзамен');

        btn.className = isExam ? 'btn btn-exam-custom btn-lg mt-2 mb-3 py-3 w-100 shadow-sm' 
                               : 'btn btn-primary btn-lg mb-2 w-100 d-flex align-items-center shadow-sm text-white border-0';
        btn.innerHTML = isExam ? `🏆 ${title}` : `<span class="lesson-num me-2">${num}.</span> <span class="lesson-title text-start">${title}</span>`;
        btn.onclick = () => getupr(num);
        menuBox.appendChild(btn);
    });

    // Настройка селектора языка
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
 * Сохранение прогресса в localStorage (Бесшовный возврат)
 */
function saveState() {
    if (!currentLessonId) return;
    const state = {
        id: currentLessonId,
        step: currentStep,
        lives: lives,
        data: currentLessonData,
        title: document.getElementById('upr-title').innerText
    };
    localStorage.setItem('activeLesson', JSON.stringify(state));
}

/**
 * Запуск или продолжение урока
 */
function getupr(num) {
    const t = translations[currentLang];
    const saved = JSON.parse(localStorage.getItem('activeLesson'));

    // Если этот урок уже был начат - восстанавливаем состояние
    if (saved && saved.id === num) {
        currentLessonId = saved.id;
        currentLessonData = saved.data;
        currentStep = saved.step;
        lives = saved.lives;
        
        setupExerciseUI(saved.title);
        createSegments(currentLessonData.length);
        for(let i = 0; i < currentStep; i++) updateSegment(i, 'correct');
        showStep();
        return;
    }

    // Иначе начинаем новый урок
    currentLessonId = num;
    let data;

    // Проверка индексов экзаменов (согласно структуре upr)
    if (num === 6) {
        data = generateExam([0,1,2,3,4], t.ui_exam);
    } else if (num === 11) {
        data = generateExam([6,7,8,9], t.ui_exam);
    } else {
        data = JSON.parse(JSON.stringify(upr[num-1]));
    }
    
    startExercise(data);
}

function startExercise(data) {
    const header = data.shift();
    const isExam = header.exver.toLowerCase().includes('экзамен');
    
    // Перемешиваем вопросы, если это не экзамен (экзамен уже перемешан)
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
 * Отображение текущего вопроса
 */
function showStep() {
    if (currentStep >= currentLessonData.length) { 
        showResult(true); 
        return; 
    }
    
    saveState(); // Сохраняем прогресс

    const item = currentLessonData[currentStep];
    const correct = item.ans[0];
    const nextBtn = document.getElementById('next-btn'); 
    nextBtn.disabled = true;
    
    updateSegment(currentStep, 'active');
    
    // Формируем текст с пропуском
    const gapHtml = `<span class="gap-line" id="current-gap">${correct}</span>`;
    document.getElementById('upr-text').innerHTML = item.ex.replace(/_+/g, gapHtml);
    document.getElementById('question-counter').innerText = `${translations[currentLang].ui_q} ${currentStep + 1}/${currentLessonData.length}`;
    
    const btnBox = document.getElementById('upr-buttons'); 
    btnBox.innerHTML = '';
    
    // Создаем кнопки ответов
    [...item.ans].sort(() => Math.random() - 0.5).forEach(opt => {
        const b = document.createElement('button'); 
        b.className = 'btn btn-outline-primary btn-lg py-3 fw-bold';
        b.innerText = opt;
        b.onclick = () => {
            document.querySelectorAll('#upr-buttons button').forEach(el => el.disabled = true);
            document.getElementById('current-gap').classList.add('revealed');
            
            if (opt === correct) {
                updateSegment(currentStep, 'correct');
                b.className = 'btn btn-success btn-lg py-3 text-white shadow';
                if (autoMode) setTimeout(nextQuestion, 1200); else nextBtn.disabled = false;
            } else {
                updateSegment(currentStep, 'wrong');
                b.className = 'btn btn-danger btn-lg py-3 text-white shadow';
                document.querySelectorAll('#upr-buttons button').forEach(el => {
                    if (el.innerText === correct) el.className = 'btn btn-success btn-lg py-3 text-white opacity-75';
                });
                
                if (autoMode) setTimeout(nextQuestion, 2000); else nextBtn.disabled = false;
                
                // Логика жизней для экзамена
                if (!document.getElementById('lives-counter').classList.contains('d-none')) {
                    lives--; 
                    updateLivesUI(); 
                    if (lives <= 0) setTimeout(() => showResult(false), 600);
                }
            }
        };
        btnBox.appendChild(b);
    });
}

/**
 * Контекстная или общая теория
 */
function showHelp(isContext = false) {
    const m = new bootstrap.Modal(document.getElementById('resultModal'));
    const theory = theoryContent[currentLang] || theoryContent['ru'];
    
    let content = theory.general;

    // Если вызвано из урока, ищем специфическую теорию по ID
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

/**
 * Финал урока
 */
function showResult(isWin) {
    const m = new bootstrap.Modal(document.getElementById('resultModal'));
    const t = translations[currentLang];
    document.getElementById('modal-icon').innerHTML = isWin ? '🎉' : '❌';
    document.getElementById('modal-title').innerText = isWin ? t.ui_win : t.ui_fail;
    document.getElementById('modal-text').innerText = isWin ? "Вы справились!" : "Нужно еще немного практики.";
    document.getElementById('ui-modal-close').innerText = t.ui_modal_ok;
    
    localStorage.removeItem('activeLesson'); // Очищаем сохраненный прогресс
    m.show();
    document.getElementById('resultModal').addEventListener('hidden.bs.modal', () => location.reload(), { once: true });
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
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => btn.innerText = savedTheme === 'dark' ? '☀️' : '🌙');
}

function toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => btn.innerText = next === 'dark' ? '☀️' : '🌙');
}

function toggleAutoMode(val) {
    autoMode = val;
    localStorage.setItem('autoMode', val);
}

function updateLivesUI() {
    const container = document.getElementById('lives-counter');
    container.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const img = document.createElement('img');
        img.src = 'images/logo_hum.png';
        img.className = i < lives ? 'life-icon' : 'life-icon life-lost';
        img.style.width = '20px';
        img.style.marginLeft = '2px';
        if (i >= lives) img.style.opacity = '0.3';
        container.appendChild(img);
    }
}

function nextQuestion() {
    currentStep++;
    showStep();
}

function exitToMenu() {
    // Состояние уже сохранено через saveState() на текущем шаге
    location.reload();
}

function changeLang(l) {
    localStorage.setItem('userLang', l);
    location.reload();
}

/**
 * Генерация экзамена (лимит 30 вопросов для сетки)
 */
function generateExam(ids, title) {
    let pool = []; 
    ids.forEach(i => {
        if (upr[i]) pool = pool.concat(upr[i].slice(1));
    });
    pool.sort(() => Math.random() - 0.5); 
    return [{ exver: title }, ...pool.slice(0, 30)];
}