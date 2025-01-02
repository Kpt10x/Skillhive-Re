
//js for mcq-test

let currentQuestion = 1;
let questions = [];
let answers = new Map();
let markedForReview = new Set();
let visitedQuestions = new Set();
let timeLeft = 30; 
let timer;

// Load questions from JSON
fetch('../Service/utils/db.json')
    .then(response => response.json())
    .then(data => {
        questions = data.questions;
        initializeQuiz();
    })
    .catch(error => console.error('Error loading questions:', error));

function initializeQuiz() {
    displayQuestion(currentQuestion);
    initializeQuestionGrid();
    startTimer();
    setupEventListeners();
    updateStats();
    updateSubmitButtonState(); 
}

function displayQuestion(questionNumber) {
    const question = questions[questionNumber - 1];
    if (!question) return;

    currentQuestion = questionNumber;
    document.getElementById('current-question').textContent = questionNumber;
    document.getElementById('question-text').textContent = question.text;

    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        if (answers.get(questionNumber) === index) {
            optionDiv.classList.add('selected');
        }

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = `question${questionNumber}`;
        radio.style.display = 'none';
        radio.checked = answers.get(questionNumber) === index;

        const label = document.createElement('label');
        label.textContent = option;

        optionDiv.appendChild(radio);
        optionDiv.appendChild(label);

        optionDiv.addEventListener('click', () => {
            optionsContainer.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
                opt.querySelector('input').checked = false;
            });

            optionDiv.classList.add('selected');
            radio.checked = true;

            selectOption(questionNumber, index);
        });

        optionsContainer.appendChild(optionDiv);
    });

    markQuestionAsVisited(questionNumber);
    updateQuestionGridStatus();
}

function markQuestionAsVisited(questionNumber) {
    visitedQuestions.add(questionNumber);
    updateStats();
    updateSubmitButtonState(); // Check if all questions are visited
}

function selectOption(questionNumber, optionIndex) {
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
    document.querySelectorAll('.option')[optionIndex].classList.add('selected');
    answers.set(questionNumber, optionIndex);
    updateStats();
    updateQuestionGridStatus();
    updateSubmitButtonState(); // Enable Submit Button if all questions are visited
}

function initializeQuestionGrid() {
    const grid = document.getElementById('question-numbers');
    grid.innerHTML = '';

    for (let i = 1; i <= 25; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.onclick = () => {
            navigateToQuestion(i);
            markQuestionAsVisited(i);
        };
        grid.appendChild(button);
    }
    updateQuestionGridStatus();
}

function updateQuestionGridStatus() {
    const buttons = document.querySelectorAll('.grid button');
    buttons.forEach((button, index) => {
        const questionNumber = index + 1;
        button.className = '';

        if (questionNumber === currentQuestion) {
            button.classList.add('current');
 } else if (answers.has(questionNumber)) {
            button.classList.add('answered');
        } else if (markedForReview.has(questionNumber)) {
            button.classList.add('marked');
        } else if (visitedQuestions.has(questionNumber)) {
            button.classList.add('visited');
        }
    });
}

function updateStats() {
    const totalVisited = visitedQuestions.size;
    const totalAnswered = answers.size;
    const totalMarked = markedForReview.size;
    const notAnswered = totalVisited - totalAnswered;
    const notVisited = 25 - totalVisited;

    document.getElementById('answered-count').textContent = totalAnswered;
    document.getElementById('not-answered-count').textContent = notAnswered;
    document.getElementById('not-visited-count').textContent = notVisited;
    document.getElementById('marked-count').textContent = totalMarked;
}

function navigateToQuestion(questionNumber) {
    if (questionNumber >= 1 && questionNumber <= 25) {
        currentQuestion = questionNumber;
        displayQuestion(questionNumber);
        markQuestionAsVisited(questionNumber); 
    }
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(timer);
            autoSubmitQuiz(); // Auto submit quiz when timer runs out
        }
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    document.getElementById('time').textContent =
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateSubmitButtonState() {
    const submitButton = document.getElementById('submit-quiz');
    
    if (visitedQuestions.size === 25) {
        submitButton.disabled = false; // Enable Submit button
        submitButton.style.cursor = 'pointer'; 
    } else {
        submitButton.disabled = true; // Disable Submit button
        submitButton.style.cursor = 'not-allowed'; 
    }
}

function autoSubmitQuiz() {
    alert('Time has expired. Your answers are being submitted automatically.');
    setTimeout(() => {
        alert('Your test has been submitted successfully!');
        submitQuiz();
    }, 2000);
}

function setupEventListeners() {
    document.getElementById('save-next').addEventListener('click', () => {
        if (currentQuestion < 25) {
            navigateToQuestion(currentQuestion + 1);
        }
    });

    document.getElementById('submit-quiz').addEventListener('click', () => {
        if (confirm('Are you sure you want to submit the test?')) {
            alert('Your test has been submitted successfully!');
            submitQuiz();
        }
    });
}

function submitQuiz() {
    const submitButton = document.getElementById('submit-quiz');
    submitButton.disabled = true;
    submitButton.style.cursor = 'not-allowed'; 

    clearInterval(timer);
    let score = 0;
    let totalMarks = questions.length;
    let correctAnswers = 0;
    let notAttempted = 0;

    answers.forEach((answer, questionNumber) => {
        const question = questions[questionNumber - 1];
        if (question) {
            if (answer === question.correctAnswer) {
                score++;
                correctAnswers++;
            }
        }
    });

    notAttempted = totalMarks - answers.size;

    window.location.href = `../Models/results.html?score=${score}&totalMarks=${totalMarks}&totalQuestions=${totalMarks}&correctAnswers=${correctAnswers}&notAttempted=${notAttempted}`;
}