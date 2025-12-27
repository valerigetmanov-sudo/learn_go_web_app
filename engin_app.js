/**
 * Learn & Go - Engine (V4.0)
 * Архитектура: Lead Architect Edition
 */

const TG_CONFIG = {
    token: 'YOUR_BOT_TOKEN', // Замените на ваш токен
    chatId: 'YOUR_CHAT_ID'   // Замените на ваш ID чата
};

let currentLang = localStorage.getItem('userLang') || 'ru';
let autoMode = localStorage.getItem('autoMode') !== 'false';
let currentLessonData = [];
let currentStep = 0;
let lives = 5;

window.onload = function() {
    initTheme();
    if (typeof translations === 'undefined') return;

    const t = translations[currentLang];
    const menuBox = document.getElementById('menu-buttons');
    if (!menuBox) return;

    // Глобальная локализация
    document.getElementById('next-btn').innerText = t.ui_go;
    document.getElementById('ui-modal-close').innerText = t.ui_modal_ok;
    document.getElementById('ui-back-btn').innerText = t.ui_back;
    document.getElementById('ui-feed-title').innerText = t.ui_feed_t;
    document.getElementById('ui-feed-send').innerText = t.ui_feed_s;
    document.querySelectorAll('.ui-auto-label').forEach(el => el.innerText = t.ui_auto);
    document.querySelectorAll('.auto-mode-check').forEach(el => el.checked = autoMode);

    // Теория
    const theoryBtn = document.createElement('button');
    theoryBtn.className = 'btn btn-theory btn-lg mb-4 py-3 w-100 shadow-sm';
    theoryBtn.innerHTML = `📖 ${t.ui_theory}`;
    theoryBtn.onclick = showHelp;
    menuBox.appendChild(theoryBtn);

    const createHeader = (text) => {
        const h = document.createElement('div');
        h.className = 'category-header'; h.innerText = text; menuBox.appendChild(h);
    };

    // Генерация меню
    upr.forEach((item, index) => {
        const num = index + 1;
        const title = item[0].exver;
        
        if (num === 1) createHeader(t.ui_base);
        if (num === 7) createHeader(t.ui_pref);
        if (num > 11) return; 

        const btn = document.createElement('button');
        const isChallenge = checkIsChallenge(title);

        btn.className = isChallenge ? 'btn btn-exam-custom btn-lg mt-2 mb-3 py-3 w-100 shadow-sm' 
                                    : 'btn btn-primary btn-lg mb-2 w-100 d-flex align-items-center shadow-sm text-white border-0';
        
        btn.innerHTML = isChallenge ? `🏆 ${title}` : `<span class="lesson-num me-2">${num}.</span> <span class="lesson-title text-start">${title}</span>`;
        btn.onclick = () => getupr(num);
        menuBox.appendChild(btn);
    });

    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.innerHTML = '';
        for (let code in translations) {
            const opt = document.createElement('option'); opt.value = code; opt.innerText = translations[code].name;
            opt.selected = (code === currentLang); langSelect.appendChild(opt);
        }
    }
};

function checkIsChallenge(title) {
    return /экзамен|тренировка|exam/i.test(title);
}

async function sendToTelegram(message) {
    if (!TG_CONFIG.token || TG_CONFIG.token === 'YOUR_BOT_TOKEN') return;
    const url = `https://api.telegram.org/bot${TG_CONFIG.token}/sendMessage`;
    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: TG_CONFIG.chatId, text: message, parse_mode: 'Markdown' })
        });
    } catch (e) { console.error('TG Error:', e); }
}

function createSegments(total) {
    const container = document.getElementById('segments-container');
    if (!container) return;
    container.innerHTML = '';
    const cols = total > 20 ? 15 : total;
    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
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
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
}

function toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
}

function updateThemeIcon(theme) {
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => btn.innerText = theme === 'dark' ? '☀️' : '🌙');
}

function toggleAutoMode(val) {
    autoMode = val; 
    localStorage.setItem('autoMode', val);
    document.querySelectorAll('.auto-mode-check').forEach(el => el.checked = val);
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) nextBtn.style.display = val ? 'none' : 'block';
}

function getupr(num) {
    const lesson = upr[num - 1];
    const title = lesson[0].exver;
    let data;
    if (num === 6) data = generateExam([0,1,2,3,4], title);
    else if (num === 11) data = generateExam([6,7,8,9], title);
    else data = JSON.parse(JSON.stringify(lesson));
    startExercise(data);
}

function startExercise(data) {
    const header = data.shift();
    const isChallenge = checkIsChallenge(header.exver);
    if (!isChallenge) data.sort(() => Math.random() - 0.5);
    
    currentLessonData = data; currentStep = 0; lives = 5;

    document.getElementById('main-menu').classList.add('d-none');
    document.getElementById('exercise-area').classList.remove('d-none');
    document.getElementById('upr-title').innerText = header.exver;
    document.getElementById('footer-main').classList.add('d-none');
    const exFooter = document.getElementById('footer-exercise');
    exFooter.classList.remove('d-none'); exFooter.classList.add('d-flex');
    
    document.getElementById('next-btn').style.display = autoMode ? 'none' : 'block';

    createSegments(data.length);
    const livesCounter = document.getElementById('lives-counter');
    if (isChallenge) {
        livesCounter.classList.remove('d-none');
        updateLivesUI();
    } else {
        livesCounter.classList.add('d-none');
    }
    showStep();
}

function showStep() {
    if (currentStep >= currentLessonData.length) { showResult(true); return; }
    
    const item = currentLessonData[currentStep];
    const correct = item.ans[0];
    const nextBtn = document.getElementById('next-btn'); 
    nextBtn.disabled = true;
    
    updateSegment(currentStep, 'active');
    document.getElementById('upr-text').innerHTML = item.ex.replace(/_+/g, `<span class=\"gap-line\" id=\"current-gap\">${correct}</span>`);
    document.getElementById('question-counter').innerText = `${translations[currentLang].ui_q} ${currentStep + 1}/${currentLessonData.length}`;
    
    const btnBox = document.getElementById('upr-buttons'); btnBox.innerHTML = '';
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
                if (!document.getElementById('lives-counter').classList.contains('d-none')) {
                    lives--; updateLivesUI(); 
                    if (lives <= 0) setTimeout(() => showResult(false), 600);
                }
            }
        };
        btnBox.appendChild(b);
    });
}

function updateLivesUI() {
    const container = document.getElementById('lives-counter');
    if (!container || container.classList.contains('d-none')) return;
    container.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const span = document.createElement('span');
        span.className = 'life-heart';
        span.innerText = i < lives ? '❤️' : '💔';
        if (i >= lives) span.classList.add('lost');
        container.appendChild(span);
    }
}

function nextQuestion() { currentStep++; showStep(); }
function changeLang(l) { localStorage.setItem('userLang', l); location.reload(); }

function generateExam(ids, title) {
    let pool = []; 
    ids.forEach(i => { if (upr[i]) pool = pool.concat(upr[i].slice(1)); });
    pool.sort(() => Math.random() - 0.5); 
    const limit = Math.min(pool.length, 30);
    return [{ exver: title }, ...pool.slice(0, limit)];
}

function showHelp() {
    const m = new bootstrap.Modal(document.getElementById('resultModal'));
    const theory = theoryContent[currentLang] || theoryContent['ru'];
    document.getElementById('modal-icon').innerHTML = '📖';
    document.getElementById('modal-title').innerText = theory.general.title;
    document.getElementById('modal-text').innerHTML = theory.general.text;
    document.getElementById('ui-modal-close').innerText = translations[currentLang].ui_modal_ok;
    m.show();
}

function openFeedbackModal() {
    const m = new bootstrap.Modal(document.getElementById('feedbackModal'));
    const cur = currentLessonData[currentStep] || { ex: "N/A" };
    window.lastErrorMeta = { 
        id: cur.id || "no-id", 
        lesson: document.getElementById('upr-title').innerText, 
        q: cur.ex, ans: cur.ans ? cur.ans[0] : "N/A" 
    };
    m.show();
}

function sendFeedback() {
    const text = document.getElementById('feedbackText').value;
    const msg = `⚠️ *Report Error*\n\n*ID:* \`${window.lastErrorMeta.id}\`\n*Lesson:* ${window.lastErrorMeta.lesson}\n*Q:* ${window.lastErrorMeta.q}\n*Expected:* ${window.lastErrorMeta.ans}\n*Comment:* ${text}`;
    sendToTelegram(msg);
    bootstrap.Modal.getInstance(document.getElementById('feedbackModal')).hide();
    document.getElementById('feedbackText').value = '';
}

function showResult(isWin) {
    const m = new bootstrap.Modal(document.getElementById('resultModal'));
    const t = translations[currentLang];
    const title = document.getElementById('upr-title').innerText;
    const isChallenge = !document.getElementById('lives-counter').classList.contains('d-none');
    
    const statsMsg = `🏁 *Finished*\n\n*Lesson:* ${title}\n*Result:* ${isWin ? '✅ Success' : '❌ Failed'}\n*Score:* ${currentStep}/${currentLessonData.length}\n*Lives:* ${isChallenge ? lives + '/5' : 'N/A'}\n*Lang:* ${currentLang.toUpperCase()}`;
    sendToTelegram(statsMsg);

    document.getElementById('modal-icon').innerHTML = isWin ? '🎉' : '😟';
    document.getElementById('modal-title').innerText = isWin ? t.ui_win : t.ui_fail;
    document.getElementById('modal-text').innerText = isWin ? t.ui_win_desc : t.ui_fail_desc;
    document.getElementById('ui-modal-close').innerText = t.ui_modal_ok;
    m.show();
    document.getElementById('resultModal').addEventListener('hidden.bs.modal', () => location.reload(), { once: true });
}

function showAbout() {
    const m = new bootstrap.Modal(document.getElementById('resultModal'));
    const t = translations[currentLang];
    document.getElementById('modal-icon').innerHTML = '🚀';
    document.getElementById('modal-title').innerText = 'Learn & Go';
    document.getElementById('modal-text').innerHTML = t.ui_about_text;
    document.getElementById('ui-modal-close').innerText = t.ui_modal_ok;
    m.show();
}