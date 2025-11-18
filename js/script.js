 function showTab(tabName) {
    // Находим кнопку таба по ID
    const tabButton = document.getElementById(tabName + '-tab');
    if (tabButton) {
        // Активируем таб через Bootstrap
        const tab = new bootstrap.Tab(tabButton);
        tab.show();
        
        // Прокручиваем к секции с табами с проверкой на мобильные
        const tabContent = document.querySelector('.tab-content');
        if (tabContent) {
            tabContent.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// Код для плейлиста с мобильной адаптацией
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, мобильное ли устройство
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Плейлист - улучшенная версия для мобильных
    const playlistItems = document.querySelectorAll('.list-group-item');
    if (playlistItems.length > 0) {
        playlistItems.forEach(item => {
            // Для мобильных увеличиваем область клика
            if (isMobile) {
                item.style.padding = '15px 10px';
                item.style.minHeight = '50px';
            }
            
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const audioSrc = this.getAttribute('data-src');
                const audioPlayer = document.getElementById('audio-player');
                
                if (!audioPlayer) {
                    console.error('Аудиоплеер не найден');
                    return;
                }
                
                // Убираем активный класс у всех элементов
                playlistItems.forEach(i => {
                    i.classList.remove('active');
                });
                
                // Добавляем активный класс к текущему элементу
                this.classList.add('active');
                
                // Обновляем источник аудио
                if (audioSrc) {
                    audioPlayer.src = audioSrc;
                    audioPlayer.play().catch(e => {
                        // На мобильных может потребоваться взаимодействие пользователя
                        if (isMobile) {
                            alert('Нажмите на кнопку воспроизведения или разрешите автовоспроизведение');
                        } else {
                            alert('Файл не найден: ' + audioSrc);
                        }
                    });
                }
            });
        });
    }

    // Викторина - улучшенная версия для мобильных
    initQuiz();
});

// Вопросы для викторины
const questions = [
    {
        question: 'Кто написал оперу "Волшебная флейта"?',
        options: [
            "Людвиг ван Бетховен",
            "Вольфганг Амадей Моцарт", 
            "Иоганн Себастьян Бах",
            "Джузеппе Верди"
        ],
        correct: 1
    },
    {
        question: 'Какое произведение принадлежит Бетховену?',
        options: [
            "Лунная соната",
            "Времена года",
            "Кармен",
            "Лебединое озеро"
        ],
        correct: 0
    },
    {
        question: 'Какой композитор жил и творил в эпоху романтизма?',
        options: [
            "Моцарт",
            "Чайковский",
            "Бах",
            "Шопен"
        ],
        correct: 3
    },
    {
        question: 'Какая опера принадлежит Чайковскому?',
        options: [
            "Травиата",
            "Евгений Онегин",
            "Севильский цирюльник", 
            "Дон Жуан"
        ],
        correct: 1
    },
    {
        question: 'Кто написал "Токкату и фугу ре минор"?',
        options: [
            "Бах",
            "Моцарт",
            "Бетховен",
            "Шуберт"
        ],
        correct: 0
    },
    {
        question: 'Какой композитор жил и творил в Австрии?',
        options: [
            "Людвиг ван Бетховен",
            "Вольфганг Амадей Моцарт", 
            "Иоганн Себастьян Бах",
            "Джузеппе Верди"
        ],
        correct: 1
    }
];

let currentQuestion = 0;
let userScore = 0;
let answered = false;

// Элементы DOM
const questionElement = document.getElementById('question');
const scoreElement = document.getElementById('score');
const resultElement = document.getElementById('result');
const nextButton = document.getElementById('next-btn');
const optionButtons = document.querySelectorAll('.option-btn');

// Инициализация викторины
function initQuiz() {
    if (!questionElement) {
        console.error('Элементы викторины не найдены');
        return;
    }
    
    showQuestion();
    
    // Добавляем обработчики событий для кнопок ответов
    optionButtons.forEach(button => {
        // Для мобильных увеличиваем область нажатия
        button.style.minHeight = '50px';
        button.style.marginBottom = '10px';
        
        button.addEventListener('click', function() {
            if (!answered) {
                checkAnswer(parseInt(this.dataset.option));
            }
        });
        
        // Добавляем обработчик touch для мобильных
        button.addEventListener('touchend', function(e) {
            e.preventDefault();
            if (!answered) {
                checkAnswer(parseInt(this.dataset.option));
            }
        });
    });

    // Обработчик для кнопки "Следующий вопрос"
    if (nextButton) {
        nextButton.addEventListener('click', nextQuestion);
        
        // Для мобильных делаем кнопку больше
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            nextButton.style.padding = '12px 20px';
            nextButton.style.fontSize = '16px';
        }
    }
}

// Показать текущий вопрос
function showQuestion() {
    const question = questions[currentQuestion];
    questionElement.textContent = question.question;
    scoreElement.textContent = `Вопрос ${currentQuestion + 1} из ${questions.length}`;
    
    // Сбрасываем стили кнопок
    optionButtons.forEach((button, index) => {
        button.textContent = question.options[index];
        button.className = 'option-btn btn btn-outline-secondary w-100 p-3 mb-2';
        button.disabled = false;
    });
    
    resultElement.textContent = '';
    resultElement.className = 'mb-3';
    if (nextButton) {
        nextButton.style.display = 'none';
    }
    answered = false;
}

// Проверить ответ
function checkAnswer(selectedOption) {
    answered = true;
    const question = questions[currentQuestion];
    
    // Отключаем все кнопки
    optionButtons.forEach(button => {
        button.disabled = true;
    });

    // Проверяем ответ
    if (selectedOption === question.correct) {
        optionButtons[selectedOption].classList.remove('btn-outline-secondary');
        optionButtons[selectedOption].classList.add('btn-success', 'correct');
        resultElement.textContent = 'Правильно! 🎉';
        resultElement.className = 'mb-3 text-success fw-bold';
        userScore++;
    } else {
        optionButtons[selectedOption].classList.remove('btn-outline-secondary');
        optionButtons[selectedOption].classList.add('btn-danger', 'wrong');
        optionButtons[question.correct].classList.remove('btn-outline-secondary');
        optionButtons[question.correct].classList.add('btn-success', 'correct');
        resultElement.textContent = 'Неправильно! 😔';
        resultElement.className = 'mb-3 text-danger fw-bold';
    }

    if (nextButton) {
        nextButton.style.display = 'inline-block';
    }
}

// Следующий вопрос
function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        // Завершение викторины
        showResults();
    }
}

// Показать результаты
function showResults() {
    const percentage = Math.round((userScore / questions.length) * 100);
    
    questionElement.textContent = 'Викторина завершена!';
    scoreElement.textContent = `Результат: ${userScore} из ${questions.length}`;
    
    let message = '';
    if (percentage >= 80) {
        message = 'Отлично! Вы настоящий знаток классической музыки! 🎵';
    } else if (percentage >= 60) {
        message = 'Хорошо! Вы хорошо разбираетесь в классической музыке! 👍';
    } else {
        message = 'Попробуйте еще раз! Классическая музыка прекрасна! 💫';
    }
    
    resultElement.innerHTML = `
        <div class="alert alert-info">
            <h5>${message}</h5>
            <p class="mb-0">Правильных ответов: ${userScore} из ${questions.length} (${percentage}%)</p>
        </div>
    `;
    
    // Скрываем кнопки вариантов
    const optionsGrid = document.querySelector('.options-grid');
    if (optionsGrid) {
        optionsGrid.style.display = 'none';
    }
    
    if (nextButton) {
        nextButton.style.display = 'none';
    }
    
    // Добавляем кнопку перезапуска
    const restartButton = document.createElement('button');
    restartButton.className = 'btn btn-success mt-3';
    restartButton.innerHTML = 'Начать заново <i class="bi bi-arrow-repeat ms-2"></i>';
    
    // Для мобильных увеличиваем кнопку
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        restartButton.style.padding = '15px 25px';
        restartButton.style.fontSize = '18px';
    }
    
    restartButton.onclick = function() {
        currentQuestion = 0;
        userScore = 0;
        location.reload();
    };
    resultElement.appendChild(restartButton);
}
     
          
