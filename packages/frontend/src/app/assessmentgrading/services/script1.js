let currentQuestion = 1;
let questions = [];
let answers = new Map();
let markedForReview = new Set();
let visitedQuestions = new Set();
let timeLeft = 300;
let timer;

// Get test ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const testId = urlParams.get('testId');

if (!testId) {
    alert('Test ID is missing! Redirecting...');
    window.location.href = './datascience.html'; // Redirect to the previous page
}

// Load test name and questions based on the selected test
fetch('../../Service/utils/mock.json')
    .then(response => response.json())
    .then(data => {
        console.log('Loaded data:', data);
        const selectedTest = data.assessments.find(test => test.id == testId);  // Make sure IDs match
        console.log('Selected Test:', selectedTest);
        
        if (selectedTest) {
            // Set the test name dynamically
            const testNameElement = document.querySelector('h1');  // Assuming the <h1> element is where the test name is displayed
            testNameElement.textContent = selectedTest.name; // Update the <h1> with the test name

            questions = selectedTest.questions;
            console.log('Questions:', questions);
            initializeQuiz();
        } else {
            alert('Test not found. Please check the test ID.');
        }
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

    document.getElementById('current-question').textContent = questionNumber;
    document.getElementById('question-text').textContent = question.text;

    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = `question${questionNumber}`;
        radio.style.display = 'none';

        const label = document.createElement('label');
        label.textContent = option;

        optionDiv.appendChild(radio);
        optionDiv.appendChild(label);

        optionDiv.addEventListener('click', () => {
            optionsContainer.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
            optionDiv.classList.add('selected');
            answers.set(questionNumber, index); // Save the selected answer for this question
        });

        optionsContainer.appendChild(optionDiv);
    });

    markQuestionAsVisited(questionNumber);
    updateQuestionGridStatus();
}

function markQuestionAsVisited(questionNumber) {
    visitedQuestions.add(questionNumber);
    updateStats();
    updateSubmitButtonState();
}

function initializeQuestionGrid() {
    const grid = document.getElementById('question-numbers');
    grid.innerHTML = '';

    for (let i = 1; i <= 10; i++) {
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
    const notVisited = 10 - totalVisited;

    document.getElementById('answered-count').textContent = totalAnswered;
    document.getElementById('not-answered-count').textContent = notAnswered;
    document.getElementById('not-visited-count').textContent = notVisited;
    document.getElementById('marked-count').textContent = totalMarked;
}

function navigateToQuestion(questionNumber) {
    if (questionNumber >= 1 && questionNumber <= 10) {
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
            autoSubmitQuiz();
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
    if (visitedQuestions.size === 10) {
        submitButton.disabled = false;
        submitButton.style.cursor = 'pointer'; 
    } else {
        submitButton.disabled = true;
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
        // Move to the next question even if no answer is selected
        if (currentQuestion < 10) {
            navigateToQuestion(currentQuestion + 1);
        }
        markQuestionAsVisited(currentQuestion);
        updateStats(); // Update stats to reflect the current answered count
    });

    document.getElementById('mark-review').addEventListener('click', () => {
        markedForReview.add(currentQuestion);
        if (currentQuestion < 10) {
            navigateToQuestion(currentQuestion + 1);
        }
        updateQuestionGridStatus();
    });

    document.getElementById('clear-response').addEventListener('click', () => {
        answers.delete(currentQuestion);
        displayQuestion(currentQuestion);
    });

    document.getElementById('submit-quiz').addEventListener('click', () => {
        if (confirm('Are you sure you want to submit the test?')) {
            alert('Your test has been submitted successfully!');
            submitQuiz();
        }
    });
}

function submitQuiz() {
    clearInterval(timer);
    let score = 0;
    let totalMarks = questions.length;
    let correctAnswers = 0;
    let notAttempted = totalMarks - answers.size;

    answers.forEach((answer, questionNumber) => {
        const question = questions[questionNumber - 1];
        if (question && answer === question.correctAnswer) {
            score++;
            correctAnswers++;
        }
    });

    window.location.href = `../../../Models/results.html?score=${score}&totalMarks=${totalMarks}&totalQuestions=${totalMarks}&correctAnswers=${correctAnswers}&notAttempted=${notAttempted}`;
}

window.onload = function () {
    const modal = document.getElementById('fullscreen-modal');
    const overlay = document.getElementById('overlay');
    modal.style.display = 'block';
    overlay.style.display = 'block';

    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const submitQuizBtn = document.getElementById('submit-quiz'); // Reference to submit button

    // Function to enter fullscreen mode
    function enterFullscreen() {
        alert("Warning: Exiting fullscreen mode will automatically submit your test!");
        const element = document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen(); // Chrome, Firefox, Edge
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen(); // Safari
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen(); // Internet Explorer/Edge
        }
    }

    // Function to submit the test
    function submitTest() {
        alert("You have exited fullscreen mode. Your test is being submitted.");
        submitQuiz(); // Simulate clicking the submit button
    }

    // Initial fullscreen entry via button click
    fullscreenBtn.addEventListener('click', () => {
        enterFullscreen(); // Enter fullscreen
        modal.style.display = 'none';
        overlay.style.display = 'none';
        
    });

    // Detect fullscreen exit and submit the test
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            submitTest(); // Automatically submit the test if fullscreen is exited
        }
    });

    // Prevent exiting fullscreen using ESC key and submit test
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            e.preventDefault(); // Block ESC key action
            submitTest(); // Submit the test
        }
    });

    // Detect tab switching or minimize and submit the test
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            submitQuiz(); // Submit the test
        }
    });  
};
