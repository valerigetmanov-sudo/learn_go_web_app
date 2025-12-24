/* LEARN & GO - ENGINE */
let currentLang = localStorage.getItem('userLang') || 'ru';
let autoMode = localStorage.getItem('autoMode') !== 'false';
let currentLessonData = [], currentStep = 0, lives = 5;
let userUID = localStorage.getItem('userUID') || 'uid_' + Math.random().toString(36).substr(2, 9);
localStorage.setItem('userUID', userUID);

window.onload = function() {
    initTheme();
    const t = translations[currentLang];
    const menuBox = document.getElementById('menu-buttons');
    if (!menuBox) return;

    // Локализация кнопок
    document.getElementById('next-btn').innerText = t.ui_go;
    document.getElementById('ui-modal-close').innerText = t.ui_modal_ok;
    document.getElementById('ui-back-btn').innerText = t.ui_back;
    document.querySelectorAll('.ui-auto-label').forEach(el => el.innerText = t.ui_auto);

    // Кнопка Теории
    const thBtn = document.createElement('button');
    thBtn.className = 'btn btn-outline-primary btn-lg mb-4 w-100 fw-bold';
    thBtn.innerHTML = `📖 ${t.ui_theory}`;
    thBtn.onclick = () => showHelp(null);
    menuBox.appendChild(thBtn);

    // Отрисовка уроков
    const createH = (txt) => { 
        const d = document.createElement('div'); 
        d.className = 'category-header text-muted small fw-bold mt-3 mb-2'; 
        d.innerText = txt; 
        menuBox.appendChild(d); 
    };

    upr.forEach((it, idx) => {
        const n = idx + 1;
        if (n === 1) createH(t.ui_base);
        if (n === 7) createH(t.ui_pref);
        const b = document.createElement('button');
        const tit = it[0].exver;
        const isEx = tit.toLowerCase().includes('экзамен');
        b.className = isEx ? 'btn btn-dark w-100 mb-2' : 'btn btn-primary text-white w-100 mb-2';
        b.innerHTML = isEx ? `🏆 ${tit}` : `<span class="opacity-50 me-2">${n}.</span> ${tit}`;
        b.onclick = () => getupr(n);
        menuBox.appendChild(b);
    });

    // Языковой селектор
    const lSel = document.getElementById('langSelect');
    if (lSel) for (let c in translations) { 
        const o = document.createElement('option'); 
        o.value = c; o.innerText = translations[c].name; 
        o.selected = (c === currentLang); lSel.appendChild(o); 
    }
};

function getupr(n) {
    const t = translations[currentLang];
    let d = (n === 6) ? generateExam([0,1,2,3,4], t.ui_exam) : (n === 11) ? generateExam([6,7,8,9], t.ui_exam) : JSON.parse(JSON.stringify(upr[n-1]));
    d.lessonNum = n; 
    startExercise(d);
}

function startExercise(d) {
    const h = d.shift();
    const isEx = h.exver.toLowerCase().includes('экзамен');
    if (!isEx) d.sort(() => Math.random() - 0.5);
    currentLessonData = d; currentStep = 0; lives = 5;
    
    document.getElementById('main-menu').classList.add('d-none');
    document.getElementById('exercise-area').classList.remove('d-none');
    document.getElementById('upr-title').innerText = h.exver;
    document.getElementById('footer-main').classList.add('d-none');
    document.getElementById('footer-exercise').classList.replace('d-none', 'd-flex');
    
    document.getElementById('ui-help-btn').onclick = () => showHelp(d.lessonNum);
    createSegments(d.length);
    if (isEx) { 
        document.getElementById('lives-counter').classList.remove('d-none'); 
        updateLivesUI(); 
    }
    showStep();
}

function showStep() {
    if (currentStep >= currentLessonData.length) { showResult(true); return; }
    const it = currentLessonData[currentStep];
    const ok = it.ans[0];
    updateSegment(currentStep, 'active');
    
    document.getElementById('upr-text').innerHTML = it.ex.replace(/_+/g, `<span class="gap-line" id="current-gap">${ok}</span>`);
    document.getElementById('question-counter').innerText = `${translations[currentLang].ui_q} ${currentStep + 1}/${currentLessonData.length}`;
    
    const box = document.getElementById('upr-buttons'); box.innerHTML = '';
    [...it.ans].sort(() => Math.random() - 0.5).forEach(o => {
        const b = document.createElement('button'); b.className = 'btn btn-outline-primary py-3 fw-bold'; b.innerText = o;
        b.onclick = () => {
            document.querySelectorAll('#upr-buttons button').forEach(e => e.disabled = true);
            document.getElementById('current-gap').classList.add('revealed');
            if (o === ok) {
                updateSegment(currentStep, 'correct'); b.className = 'btn btn-success text-white';
                if (autoMode) setTimeout(nextQuestion, 1200); else document.getElementById('next-btn').disabled = false;
            } else {
                updateSegment(currentStep, 'wrong'); b.className = 'btn btn-danger text-white';
                if (!document.getElementById('lives-counter').classList.contains('d-none')) { 
                    lives--; updateLivesUI(); if (lives <= 0) setTimeout(() => showResult(false), 600); 
                }
                if (autoMode) setTimeout(nextQuestion, 2000); else document.getElementById('next-btn').disabled = false;
            }
        };
        box.appendChild(b);
    });
}

// Служебные функции
function initTheme() { document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') || 'light'); }
function toggleTheme() { 
    const n = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; 
    document.documentElement.setAttribute('data-theme', n); localStorage.setItem('theme', n); 
}
function toggleAutoMode(v) { autoMode = v; localStorage.setItem('autoMode', v); }
function createSegments(t) { 
    const c = document.getElementById('segments-container'); c.innerHTML = ''; 
    for (let i = 0; i < t; i++) { 
        const s = document.createElement('div'); s.className = 'segment'; s.id = `seg-${i}`; c.appendChild(s); 
    } 
}
function updateSegment(i, s) { const e = document.getElementById(`seg-${i}`); if (e) e.classList.add(s); }
function updateLivesUI() { 
    const c = document.getElementById('lives-counter'); c.innerHTML = ''; 
    for (let i = 0; i < 5; i++) { 
        const img = document.createElement('img'); img.src = 'images/logo_hum.png'; 
        img.className = i < lives ? 'life-icon' : 'life-icon life-lost'; c.appendChild(img); 
    } 
}
function nextQuestion() { currentStep++; showStep(); }
function changeLang(l) { localStorage.setItem('userLang', l); location.reload(); }
function generateExam(ids, tit) { 
    let p = []; ids.forEach(i => p = p.concat(upr[i].slice(1))); 
    p.sort(() => Math.random() - 0.5); return [{ exver: tit }, ...p.slice(0, 25)]; 
}
function showHelp(n) { 
    const m = new bootstrap.Modal(document.getElementById('resultModal')); 
    const th = theoryContent[currentLang] || theoryContent['ru']; 
    const d = (n && th[`lesson_${n}`]) ? th[`lesson_${n}`] : th.general; 
    document.getElementById('modal-icon').innerHTML = '📖'; 
    document.getElementById('modal-title').innerText = d.title; 
    document.getElementById('modal-text').innerHTML = d.text; m.show(); 
}
function openFeedbackModal() { 
    const m = new bootstrap.Modal(document.getElementById('feedbackModal')); 
    window.lastErrorMeta = { id: currentLessonData[currentStep].id, tags: currentLessonData[currentStep].tags }; 
    m.show(); 
}
function sendFeedback() { 
    const b = `User: ${userUID}\nID: ${window.lastErrorMeta.id}\nTags: ${window.lastErrorMeta.tags}\nMsg: ${document.getElementById('feedbackText').value}`; 
    window.location.href = `mailto:admin@rki.today?subject=Error&body=${encodeURIComponent(b)}`; 
}
function openShareModal() { new bootstrap.Modal(document.getElementById('shareModal')).show(); }
function copyShareLink() { navigator.clipboard.writeText(document.getElementById('shareLinkInput').value); alert("Copied!"); }
function showResult(win) { 
    const m = new bootstrap.Modal(document.getElementById('resultModal')); const t = translations[currentLang]; 
    document.getElementById('modal-icon').innerHTML = win ? '🎉' : '❌'; 
    document.getElementById('modal-title').innerText = win ? t.ui_win : t.ui_fail; 
    document.getElementById('modal-text').innerText = win ? "Победа!" : "Попробуйте еще раз."; 
    m.show(); document.getElementById('resultModal').addEventListener('hidden.bs.modal', () => location.reload(), { once: true }); 
}
function showAbout() { 
    const m = new bootstrap.Modal(document.getElementById('resultModal')); 
    document.getElementById('modal-icon').innerHTML = '🚀'; 
    document.getElementById('modal-title').innerText = 'Learn & Go'; 
    document.getElementById('modal-text').innerHTML = 'RKI Trainer © 2025'; m.show(); 
}