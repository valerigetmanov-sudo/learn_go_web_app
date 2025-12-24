/**
 * Learn & Go - Словари локализации (V3.3)
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
        ui_win_desc: "Отличная работа! Все упражнения выполнены. Вы стали на шаг ближе к совершенству.",
        ui_exam_win_desc: "Поздравляем! Вы успешно сдали экзамен и подтвердили свои знания глаголов движения.",
        ui_fail: "Попробуйте ещё раз",
        ui_fail_desc: "Жизни закончились, но не расстраивайтесь. Практика делает мастера!",
        ui_modal_ok: "Понятно",
        
        // Блок "О приложении"
        ui_about_btn: "О приложении",
        ui_about_text: `
            <h4>Learn & Go</h4>
            <p>Интерактивный тренажёр по самой сложной теме русского языка — <b>Глаголам движения</b>.</p>
            <p>Приложение разработано специально для студентов РКИ (Русский как иностранный), чтобы довести навык выбора нужного глагола до автоматизма.</p>
            <hr>
            <p class="small text-muted">Версия: 3.3 (Stable)<br>
            Разработка: <b>Академия RKI.Today</b> © 2025<br>
            Все права защищены.</p>
        `,

        // Обратная связь
        ui_feed_t: "Сообщить об ошибке",
        ui_feed_s: "Отправить"
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
        ui_win_desc: "Well done! You've completed all the exercises. You're one step closer to fluency.",
        ui_exam_win_desc: "Congratulations! You've passed the exam and mastered the motion verbs.",
        ui_fail: "Try again",
        ui_fail_desc: "Out of lives, but don't give up! Practice makes perfect.",
        ui_modal_ok: "Got it",
        
        // About Section
        ui_about_btn: "About App",
        ui_about_text: `
            <h4>Learn & Go</h4>
            <p>An interactive trainer for the most challenging topic in Russian — <b>Verbs of Motion</b>.</p>
            <p>Designed specifically for RFL (Russian as a Foreign Language) students to automate the choice of the correct verb.</p>
            <hr>
            <p class="small text-muted">Version: 3.3 (Stable)<br>
            Created by: <b>RKI.Today Academy</b> © 2025<br>
            All rights reserved.</p>
        `,

        // Feedback
        ui_feed_t: "Report an Error",
        ui_feed_s: "Send"
    }
};