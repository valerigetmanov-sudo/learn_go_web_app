// --- 1. ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ (Память приложения) ---
// Эти переменные хранят состояние, пока пользователь проходит урок
let currentLesson = null; // Здесь лежат данные выбранного урока
let currentStep = 1;      // Номер текущего вопроса (начинаем с 1, так как 0 - это заголовок)

/**
 * ФУНКЦИЯ ЗАПУСКА УРОКА
 * Срабатывает один раз, когда нажимаем на кнопку в главном меню.
 */
function getupr(num) {
    // Находим данные урока в массиве 'upr' (из data.js)
    currentLesson = upr[num - 1]; 
    currentStep = 1; // Всегда начинаем с первого вопроса
    
    // ПЕРЕКЛЮЧЕНИЕ ЭКРАНОВ:
    // Скрываем карточку меню (добавляем класс d-none)
    document.getElementById('main-menu').classList.add('d-none');
    
    // Показываем карточку упражнения (удаляем класс d-none)
    const exerciseArea = document.getElementById('exercise-area');
    exerciseArea.classList.remove('d-none');
    
    // Запускаем отрисовку первого вопроса
    showStep(); 
}

/**
 * ФУНКЦИЯ ОТРИСОВКИ ШАГА
 * Срабатывает каждый раз при переходе к новому вопросу.
 */
function showStep() {
    // Считаем общее количество вопросов в этом уроке
    const totalSteps = currentLesson.length - 1; 
    
    // Берем данные конкретного вопроса по текущему номеру шага
    const questionData = currentLesson[currentStep]; 

    // 1. ОБНОВЛЕНИЕ ПРОГРЕСС-БАРА
    // Считаем процент: (текущий / всего) * 100
    const progressPercent = (currentStep / totalSteps) * 100;
    document.getElementById('upr-progress').style.width = progressPercent + "%";

    // 2. ОБНОВЛЕНИЕ ТЕКСТОВ
    // Заголовок урока (например, "идти VS ехать")
    document.getElementById('upr-title').innerText = currentLesson[0].exver;
    
    // Текст вопроса (например, "Сегодня я ________ в кино")
    document.getElementById('upr-text').innerText = questionData.ex;

    // 3. СОЗДАНИЕ КНОПОК ОТВЕТОВ
    const btnBox = document.getElementById('upr-buttons');
    btnBox.innerHTML = ''; // Очищаем контейнер от старых кнопок

    // Создаем кнопки для каждого варианта ответа в массиве 'ans'
    questionData.ans.forEach(answer => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-outline-primary btn-lg py-3'; // Стили Bootstrap
        btn.innerText = answer;
        
        // Логика проверки при клике на ответ
        btn.onclick = function() {
            // В твоей базе данных (data.js) правильный ответ всегда ПЕРВЫЙ
            const correctAnswer = questionData.ans[0];

            if (answer === correctAnswer) {
                // ЕСЛИ ОТВЕТ ВЕРНЫЙ:
                if (currentStep < totalSteps) {
                    currentStep++; // Увеличиваем номер шага
                    showStep();    // Перерисовываем экран с новым вопросом
                } else {
                    // Если это был последний вопрос
                    alert("Отлично! Урок полностью пройден! 🎉");
                    location.reload(); // Перезагружаем страницу, чтобы вернуться в меню
                }
            } else {
                // ЕСЛИ ОТВЕТ НЕВЕРНЫЙ:
                alert("Не совсем так. Попробуй еще раз! 😊");
            }
        };
        
        // Добавляем готовую кнопку в блок
        btnBox.appendChild(btn);
    });
}