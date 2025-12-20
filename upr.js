/**
 * Функция запускается при клике на кнопку урока в меню.
 * @param {number} num - Номер выбранного урока (1, 2, 3...)
 */
function getupr(num) {
    // 1. НАСТРОЙКА ДАННЫХ
    const lessonIndex = num - 1;         // Превращаем номер (1,2,3) в индекс массива (0,1,2)
    const lessonData = upr[lessonIndex]; // Выбираем нужный урок из нашего файла data.js
    const firstQuestion = lessonData[1]; // Индекс 0 — это настройки заголовка, индекс 1 — это первый вопрос

    // 2. УПРАВЛЕНИЕ ЭКРАНАМИ (ПЕРЕКЛЮЧЕНИЕ ВИЗУАЛА)
    // Находим блок главного меню и добавляем ему класс 'd-none' (скрыть)
    document.getElementById('main-menu').classList.add('d-none');
    
    // Находим блок упражнения и убираем у него класс 'd-none' (показать)
    const exerciseArea = document.getElementById('exercise-area');
    exerciseArea.classList.remove('d-none');

    // 3. ЗАПОЛНЕНИЕ ТЕКСТА ЗАДАНИЯ
    // Вставляем заголовок урока (например, "идти VS ехать")
    document.getElementById('upr-title').innerText = lessonData[0].exver;
    
    // Вставляем текст самого задания (например, "Я ________ в школу")
    document.getElementById('upr-text').innerText = firstQuestion.ex;

    // 4. СОЗДАНИЕ КНОПОК С ОТВЕТАМИ
    const btnBox = document.getElementById('upr-buttons');
    btnBox.innerHTML = ''; // Очищаем контейнер от старых кнопок (если они были)

    // Перебираем все варианты ответов из массива 'ans'
    firstQuestion.ans.forEach(answer => {
        // Создаем новую кнопку в памяти браузера
        const btn = document.createElement('button');
        
        // Добавляем ей стили Bootstrap (большая, синяя обводка, отступы)
        btn.className = 'btn btn-outline-primary btn-lg py-3';
        
        // Пишем на кнопке текст ответа (например, "иду")
        btn.innerText = answer;
        
        // Описываем, что произойдет при клике на эту кнопку
        btn.onclick = function() {
            // В твоей базе данных (data.js) правильный ответ всегда стоит на ПЕРВОМ месте
            const correctAnswer = firstQuestion.ans[0];

            if (answer === correctAnswer) {
                alert("Правильно! 🎉");
                // ТУТ в будущем мы напишем код для перехода к следующему вопросу
            } else {
                alert("Ошибка! ❌ Попробуй выбрать другой вариант.");
            }
        };
        
        // Добавляем готовую кнопку на страницу в блок 'upr-buttons'
        btnBox.appendChild(btn);
    });
}