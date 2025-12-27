/**
 * Learn & Go - Словари локализации (V3.6)
 * Файл: translations.js
 */

const translations = {
    ru: {
        name: "Русский",
        
        // Главное меню
        ui_theory: "Теория",
        ui_base: "Базовые глаголы",
        ui_pref: "Глаголы с приставками",
        ui_exam: "Экзамен",
        
        // Интерфейс урока
        ui_go: "Далее",
        ui_back: "← Меню",
        ui_auto: "Авто",
        ui_q: "Вопрос",
        
        // Модальное окно: Результаты
        ui_win: "Победа!",
        ui_win_desc: "Отличная работа! Все упражнения выполнены.",
        ui_fail: "Попробуйте ещё раз",
        ui_fail_desc: "Жизни закончились, но практика делает мастера!",
        ui_modal_ok: "Понятно",
        
        // Блок "О приложении"
        ui_about_btn: "О приложении",
        ui_about_text: `
            <div class="text-start">
                <p><b>Learn & Go</b> — это интерактивный тренажёр по глаголам движения для студентов РКИ.</p>
                <p>Наша цель: помочь вам довести использование сложных грамматических конструкций до автоматизма.</p>
                <ul class="small">
                    <li>300+ уникальных заданий</li>
                    <li>Система контроля ошибок (жизни)</li>
                    <li>Поддержка тёмной темы</li>
                </ul>
                <hr>
                <p class="small text-muted">Версия: 3.6<br>Разработка: <b>RKI.Today</b> © 2025</p>
            </div>
        `,

        // Обратная связь
        ui_feed_t: "Отправить сообщение",
        ui_feed_s: "Отправить",
        ui_feed_ok: "Сообщение отправлено!"
    },
    
    en: {
        name: "English",
        
        // Main Menu
        ui_theory: "Theory",
        ui_base: "Basic Verbs",
        ui_pref: "Verbs with Prefixes",
        ui_exam: "Exam",
        
        // Exercise Interface
        ui_go: "Next",
        ui_back: "← Menu",
        ui_auto: "Auto",
        ui_q: "Question",
        
        // Modal: Results
        ui_win: "Success!",
        ui_win_desc: "Well done! Exercises completed.",
        ui_fail: "Try again",
        ui_fail_desc: "Out of lives, but don't give up!",
        ui_modal_ok: "Got it",
        
        // About Section
        ui_about_btn: "About App",
        ui_about_text: `
            <div class="text-start">
                <p><b>Learn & Go</b> is an interactive trainer for Russian motion verbs.</p>
                <p>Our goal is to help you automate the use of complex grammatical structures.</p>
                <ul class="small">
                    <li>300+ unique tasks</li>
                    <li>Error control system (lives)</li>
                    <li>Dark/Light theme support</li>
                </ul>
                <hr>
                <p class="small text-muted">Version: 3.6<br>Created by: <b>RKI.Today</b> © 2025</p>
            </div>
        `,

        // Feedback
        ui_feed_t: "Report an Error",
        ui_feed_s: "Send to Telegram",
        ui_feed_ok: "Message sent!"
    }
};