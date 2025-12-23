/* ==========================================================================
   ПОЛНЫЙ ДВИЖОК LEARN & GO (СИНХРОНИЗИРОВАННЫЙ)
   ========================================================================== */

let currentLang = localStorage.getItem('userLang') || 'ru';
let autoMode = localStorage.getItem('autoMode') !== 'false';
let currentLessonData = [];
let currentStep = 0;
let lives = 5;

window.onload = function() {
    initTheme();
    const t = translations[currentLang];
    const menuBox = document.getElementById('menu-buttons');
    if (!menuBox) return;

    // 1. Локализация интерфейса (Восстановлено)
    document.getElementById('next-btn').innerText = t.ui_go;
    document.getElementById('ui-modal-close').innerText = t.ui_modal_ok;
    document.getElementById('ui-back-btn').innerText = t.ui_back;
    document.getElementById('ui-feed-title').innerText = t.ui_feed_t;
    document.getElementById('ui-feed-send').innerText = t.ui_feed_s;

    // Синхронизация лейблов "Авто"
    document.querySelectorAll('.ui-auto-label').forEach(el => el.innerText = t.ui_auto);
    document.querySelectorAll('.auto-mode-check').forEach(el => el.checked = autoMode);

    // 2. Кнопка Теория
    const theoryBtn = document.createElement('button');
    theoryBtn.className = 'btn btn-theory btn-lg mb-4 py-3 w-100 shadow-sm';
    theoryBtn.innerHTML = `📖 ${t.ui_theory}`;
    theoryBtn.onclick = showHelp;
    menuBox.appendChild(theoryBtn);

    // 3. Список уроков
    const createHeader = (text) => {
        const h = document.createElement('div');
        h.className = 'category-header'; h.innerText = text;
        menuBox.appendChild(h);
    };

    upr.forEach((item, index) => {
        const num = index + 1;
        if (num === 1) createHeader(t.ui_base);
        if (num === 7) createHeader(t.ui_pref);

        const btn = document.createElement('button');
        const title = item[0].exver;
        const isExam = title.toLowerCase().includes('экзамен');

        if (isExam) {
            btn.className = 'btn btn-outline-dark btn-lg mt-2 mb-3 py-3 fw-bold w-100 shadow-sm btn-exam-custom';
            btn.innerHTML = `🏆 ${title}`;
        } else {
            btn.className = 'btn btn-primary btn-lg mb-2 w-100 d-flex align-items-center shadow-sm text-white border-0';
            btn.innerHTML = `<span class="lesson-num me-2">${num}.</span> <span class="lesson-title text-start">${title}</span>`;
        }
        btn.onclick = () => getupr(num);
        menuBox.appendChild(btn);
    });

    // 4. Селектор языков
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        for (let code in translations) {
            const opt = document.createElement('option');
            opt.value = code; opt.innerText = translations[code].name;
            opt.selected = (code === currentLang);
            langSelect.appendChild(opt);
        }
    }
};

// --- СИНХРОНИЗАЦИЯ ТЕМЫ И АВТО-РЕЖИМА ---
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
        btn.innerText = theme === 'dark' ? '☀️' : '🌙';
    });
}

function toggleAutoMode(val) {
    autoMode = val;
    localStorage.setItem('autoMode', val);
    // Синхронизируем все чекбоксы на странице
    document.querySelectorAll('.auto-mode-check').forEach(el => el.checked = val);
}

// --- ЛОГИКА УПРАЖНЕНИЙ ---
function getupr(num) {
    const t = translations[currentLang];
    let data = (num === 6) ? generateExam([0,1,2,3,4], t.ui_exam) : 
               (num === 11) ? generateExam([6,7,8,9], t.ui_exam) : 
               JSON.parse(JSON.stringify(upr[num-1]));
    startExercise(data);
}

function generateExam(ids, title) {
    let pool = []; ids.forEach(i => { if (upr[i]) pool = pool.concat(upr[i].slice(1)); });
    pool.sort(() => Math.random() - 0.5);
    return [{ exver: title }, ...pool.slice(0, 25)];
}

function startExercise(data) {
    const header = data.shift();
    if (!header.exver.toLowerCase().includes('экзамен')) data.sort(() => Math.random() - 0.5);
    currentLessonData = data; currentStep = 0; lives = 5;
    
    document.getElementById('main-menu').classList.add('d-none');
    document.getElementById('exercise-area').classList.remove('d-none');
    document.getElementById('upr-title').innerText = header.exver;
    
    document.getElementById('footer-main').classList.add('d-none');
    const footEx = document.getElementById('footer-exercise');
    footEx.classList.remove('d-none');
    footEx.classList.add('d-flex');

    if (header.exver.toLowerCase().includes('экзамен')) {
        document.getElementById('lives-counter').classList.remove('d-none');
        updateLivesUI();
    } else { document.getElementById('lives-counter').classList.add('d-none'); }
    showStep();
}

function showStep() {
    if (currentStep >= currentLessonData.length) { showResult(true); return; }
    const item = currentLessonData[currentStep];
    const correct = item.ans[0];
    const nextBtn = document.getElementById('next-btn'); nextBtn.disabled = true;

    const gapHtml = `<span class="gap-line" id="current-gap">${correct}</span>`;
    document.getElementById('upr-text').innerHTML = item.ex.includes('________') 
        ? item.ex.replace(/________/g, gapHtml) : `${item.ex}<br>${gapHtml}`;

    document.getElementById('upr-progress').style.width = ((currentStep / currentLessonData.length) * 100) + '%';
    document.getElementById('question-counter').innerText = `${translations[currentLang].ui_q} ${currentStep + 1}/${currentLessonData.length}`;

    const btnBox = document.getElementById('upr-buttons'); btnBox.innerHTML = '';
    [...item.ans].sort(() => Math.random() - 0.5).forEach(opt => {
        const b = document.createElement('button'); b.className = 'btn btn-outline-primary btn-lg py-3 fw-bold';
        b.innerText = opt;
        b.onclick = () => {
            document.querySelectorAll('#upr-buttons button').forEach(el => el.disabled = true);
            document.getElementById('current-gap').classList.add('revealed');
            if (opt === correct) {
                b.className = 'btn btn-success btn-lg py-3 text-white shadow';
                if (autoMode) setTimeout(nextQuestion, 1200); else nextBtn.disabled = false;
            } else {
                b.className = 'btn btn-danger btn-lg py-3 text-white shadow';
                document.querySelectorAll('#upr-buttons button').forEach(el => {
                    if (el.innerText === correct) el.className = 'btn btn-success btn-lg py-3 text-white opacity-75';
                });
                if (lives > 0 && !document.getElementById('lives-counter').classList.contains('d-none')) {
                    lives--; updateLivesUI(); if (lives <= 0) setTimeout(() => showResult(false), 600);
                }
                nextBtn.disabled = false;
            }
        };
        btnBox.appendChild(b);
    });
}

function updateLivesUI() {
    const container = document.getElementById('lives-counter');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const img = document.createElement('img');
        img.src = 'images/logo_hum.png';
        img.className = i < lives ? 'life-icon' : 'life-icon life-lost';
        container.appendChild(img);
    }
}

// --- СИСТЕМНЫЕ ОКНА ---
function nextQuestion() { currentStep++; showStep(); }
function changeLang(l) { localStorage.setItem('userLang', l); location.reload(); }

function showHelp() {
    const m = new bootstrap.Modal(document.getElementById('resultModal'));
    const theory = theoryContent[currentLang] || theoryContent['ru'];
    document.getElementById('modal-icon').innerHTML = '📖';
    document.getElementById('modal-title').innerText = theory.title;
    document.getElementById('modal-text').innerHTML = theory.text;
    document.getElementById('ui-modal-close').innerText = translations[currentLang].ui_modal_ok;
    m.show();
}

function openFeedbackModal() {
    const m = new bootstrap.Modal(document.getElementById('feedbackModal'));
    const cur = currentLessonData[currentStep] || { ex: "Menu" };
    window.lastErrorMeta = { lesson: document.getElementById('upr-title').innerText, q: cur.ex, ans: cur.ans?.[0] };
    m.show();
}

function sendFeedback() {
    const userMsg = document.getElementById('feedbackText').value;
    const body = `Error: ${userMsg}\nContext: ${JSON.stringify(window.lastErrorMeta)}`;
    window.location.href = `mailto:admin@rki.today?subject=Report&body=${encodeURIComponent(body)}`;
}

function showResult(isWin) {
    const m = new bootstrap.Modal(document.getElementById('resultModal'));
    const t = translations[currentLang];
    document.getElementById('modal-icon').innerHTML = isWin ? '🎉' : '❌';
    document.getElementById('modal-title').innerText = isWin ? t.ui_win : t.ui_fail;
    document.getElementById('modal-text').innerText = isWin ? "Вы справились!" : "Нужно еще немного практики.";
    document.getElementById('ui-modal-close').innerText = t.ui_modal_ok;
    m.show();
    document.getElementById('resultModal').addEventListener('hidden.bs.modal', () => location.reload(), { once: true });
}

function showAbout() {
    const m = new bootstrap.Modal(document.getElementById('resultModal'));
    document.getElementById('modal-icon').innerHTML = '🚀';
    document.getElementById('modal-title').innerText = 'Learn & Go';
    document.getElementById('modal-text').innerHTML = 'Тренажёр по глаголам движения.<br>Академия <b>RKI.Today</b> © 2025';
    document.getElementById('ui-modal-close').innerText = translations[currentLang].ui_modal_ok;
    m.show();
}