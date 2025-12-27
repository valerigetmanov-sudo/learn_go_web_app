/**
 * Learn & Go - Словари локализации (V3.5)
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
            <h4>Learn & Go</h4>
            <p>Тренажёр по <b>Глаголам движения</b>.</p>
            <hr>
            <p class="small text-muted">Разработка: <b>RKI.Today</b> © 2025</p>
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
            <h4>Learn & Go</h4>
            <p>Trainer for <b>Verbs of Motion</b>.</p>
            <hr>
            <p class="small text-muted">Created by: <b>RKI.Today</b> © 2025</p>
        `,

        // Feedback
        ui_feed_t: "Report an Error",
        ui_feed_s: "Send to Telegram",
        ui_feed_ok: "Message sent!"
    }
};