// --- 1. ПЕРЕМЕННЫЕ СОСТОЯНИЯ ---
let currentLesson = null; // Данные текущего урока
let currentStep = 1;      // Номер текущего вопроса

/**
 * ФУНКЦИЯ ВЫЗОВА МОДАЛЬНОГО ОКНА (Центральное окно)
 */
function showModal(icon, title, text, isFinal = false) {
    // Заполняем данными элементы внутри окна в index.html
    document.getElementById('modal-icon').innerText = icon;
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-text').innerText = text;

    // Находим окно и показываем его через Bootstrap
    const modalElement = document.getElementById('resultModal');
    const myModal = new bootstrap.Modal(modalElement);
    myModal.show();

    // Если это конец урока, при закрытии окна перезагружаем страницу
    if (isFinal) {
        modalElement.addEventListener('hidden.bs.modal', function () {
            location.reload();
        }, { once: true });
    }
}

/**
 * ЗАПУСК УРОКА
 */
function getupr(num) {
    currentLesson = upr[num - 1]; 
    currentStep = 1;              
    
    // Проверка на пустой урок (например, для Экзамена)
    if (!currentLesson || !currentLesson[currentStep]) {
        alert("В этом уроке пока нет вопросов. Добавьте их в data.js!");
        return;
    }

    // Переключаем видимость блоков
    document.getElementById('main-menu').classList.add('d-none');
    document.getElementById('exercise-area').classList.remove('d-none');
    
    showStep(); 
}

/**
 * ОТОБРАЖЕНИЕ ВОПРОСА И ПЕРЕМЕШИВАНИЕ ОТВЕТОВ
 */
function showStep() {
    const totalSteps = currentLesson.length - 1; 
    const questionData = currentLesson[currentStep]; 

    // 1. Обновляем прогресс-бар
    const progressPercent = (currentStep / totalSteps) * 100;
    document.getElementById('upr-progress').style.width = progressPercent + "%";

    // 2. Обновляем тексты на экране
    document.getElementById('upr-title').innerText = currentLesson[0].exver;
    document.getElementById('upr-text').innerText = questionData.ex;

    // 3. РАБОТА С КНОПКАМИ
    const btnBox = document.getElementById('upr-buttons');
    btnBox.innerHTML = ''; // Очистка

    // --- ПЕРЕМЕШИВАНИЕ (Чтобы правильный ответ не был всегда первым) ---
    // Создаем копию ответов и перемешиваем их случайным образом
    const shuffledAnswers = [...questionData.ans].sort(() => Math.random() - 0.5);

    shuffledAnswers.forEach(answer => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-outline-primary btn-lg py-3';
        btn.innerText = answer;
        
        btn.onclick = function() {
            const correctAnswer = questionData.ans[0]; // Правильный ответ всегда первый в data.js
            const allButtons = btnBox.querySelectorAll('button');
            
            // Блокируем нажатия, чтобы не кликать по 10 раз
            allButtons.forEach(b => b.style.pointerEvents = 'none');

            if (answer === correctAnswer) {
                // ВЕРНО -> Зеленый цвет
                btn.classList.replace('btn-outline-primary', 'btn-success');
                
                setTimeout(() => {
                    if (currentStep < totalSteps) {
                        currentStep++; 
                        showStep();    
                    } else {
                        // ФИНАЛ -> Вызов красивого центрального окна
                        showModal("🏆", "Блестяще!", "Упражнение выполнено полностью!", true);
                    }
                }, 700); 

            } else {
                // ОШИБКА -> Красный цвет
                btn.classList.replace('btn-outline-primary', 'btn-danger');
                
                setTimeout(() => {
                    // Возвращаем исходный цвет и включаем кнопки обратно
                    btn.classList.replace('btn-danger', 'btn-outline-primary');
                    allButtons.forEach(b => b.style.pointerEvents = 'auto');
                }, 1000);
            }
        };
        btnBox.appendChild(btn);
    });
}