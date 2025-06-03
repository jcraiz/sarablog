import _ from 'lodash';

const quizQuestions = [
    {
        question: "What time does Sarah arrive at the inn?",
        options: ["12 PM", "1 PM", "2 PM", "Morning"],
        answer: "1 PM"
    },
    {
        question: "How long is the flight?",
        options: ["One hour", "Two hours", "Three hours", "Less than an hour"],
        answer: "Two hours"
    },
    {
        question: "How much does the flight cost?",
        options: ["Fifty dollars", "Sixty dollars", "Free", "Unknown"],
        answer: "Fifty dollars"
    },
    {
        question: "Where does Sarah go sightseeing after the meal?",
        options: ["The mountains", "The city center", "The forest", "The shore"],
        answer: "The shore"
    },
    {
        question: "How does Sarah pay for her meal?",
        options: ["Credit card", "Check", "Cash", "Mobile pay"],
        answer: "Cash"
    },
    {
        question: "How does Sarah travel to the railway station the next day?",
        options: ["Train", "Taxi", "Coach", "Walks"],
        answer: "Coach"
    },
    {
        question: "Does Sarah like the hill town?",
        options: ["Yes", "No"],
        answer: "Yes"
    },
     {
        question: "Is her bedroom big?",
        options: ["Yes", "No"],
        answer: "No"
    },
     {
        question: "Does the shower water work well and is it hot?",
        options: ["Yes", "No"],
        answer: "Yes"
    },
     {
        question: "Who shows her the way to the washroom?",
        options: ["A woman", "A man"],
        answer: "A man"
    }
];

const quizContainer = document.getElementById('quiz-container');
const submitButton = document.getElementById('submit-quiz');
const resultsDiv = document.getElementById('quiz-results');
const scoreSpan = document.getElementById('score');
const totalQuestionsSpan = document.getElementById('total-questions');
const scoreMessage = document.getElementById('score-message');
// const progressBar = document.getElementById('reading-progress-bar'); // This is no longer used
const readingProgressCircle = document.querySelector('#reading-progress-svg .progress-circle');
const progressTick = document.getElementById('progress-tick'); // Get the tick element
const audioIcon = document.getElementById('audio-icon');
const audioPlayerContainer = document.getElementById('audio-player-container');
const retryButton = document.getElementById('retry-quiz');


let audioContext;
let correctSoundBuffer;
let incorrectSoundBuffer;

async function loadSound(url) {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await audioContext.decodeAudioData(arrayBuffer);
}

function playSound(buffer) {
    console.log('Sound playback skipped.');
}

async function loadSounds() {
    try {
        console.log('Sound loading skipped: correct_sound.mp3 and incorrect_sound.mp3');
    } catch (error) {
        console.error('Error loading sounds:', error);
    }
}

function renderQuiz() {
    quizContainer.innerHTML = '';
    totalQuestionsSpan.textContent = quizQuestions.length;
    resultsDiv.style.display = 'none';
    submitButton.disabled = false;

    quizQuestions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        questionDiv.dataset.index = index;

        const questionText = document.createElement('p');
        questionText.textContent = `${index + 1}. ${q.question}`;
        questionDiv.appendChild(questionText);

        const optionsDiv = document.createElement('div');
        optionsDiv.classList.add('options');

        q.options.forEach(option => {
            const optionLabel = document.createElement('label');
            const optionInput = document.createElement('input');
            optionInput.type = 'radio';
            optionInput.name = `question${index}`;
            optionInput.value = option;

            const optionTextSpan = document.createElement('span');
            optionTextSpan.textContent = option;

            optionLabel.appendChild(optionInput);
            optionLabel.appendChild(optionTextSpan);
            optionsDiv.appendChild(optionLabel);
        });

        questionDiv.appendChild(optionsDiv);
        quizContainer.appendChild(questionDiv);
    });
}

function checkQuiz() {
    let score = 0;
    const questions = quizContainer.querySelectorAll('.question');

    questions.forEach(questionDiv => {
        const index = parseInt(questionDiv.dataset.index);
        const question = quizQuestions[index];
        const selectedOptionInput = questionDiv.querySelector(`input[name="question${index}"]:checked`);
        const optionLabels = questionDiv.querySelectorAll('.options label');

        optionLabels.forEach(label => {
            const input = label.querySelector('input');
            input.disabled = true;
            label.classList.remove('correct', 'incorrect');

            if (input.value === question.answer) {
                label.classList.add('correct');
            }

            if (selectedOptionInput && input === selectedOptionInput && selectedOptionInput.value !== question.answer) {
                 label.classList.add('incorrect');
            }
        });


        if (selectedOptionInput && selectedOptionInput.value === question.answer) {
            score++;
        } else if (selectedOptionInput && selectedOptionInput.value !== question.answer) {
        } else {
        }
    });

    scoreSpan.textContent = score;
    resultsDiv.style.display = 'block';

    let message = `You got ${score} out of ${quizQuestions.length} questions correct. `;
    if (score === quizQuestions.length) {
        message += _.capitalize("perfect score! Well done!");
    } else if (score > quizQuestions.length / 2) {
        message += _.capitalize("good effort!");
    } else {
        message += _.capitalize("keep reading the story and try again!");
    }
    scoreMessage.textContent = message;

    submitButton.disabled = true;
}

function updateReadingProgress() {
    // Use scrollHeight and clientHeight for the total scrollable height
    const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = window.scrollY || document.documentElement.scrollTop;

    // Calculate progress percentage (ensure it doesn't exceed 100%)
    const progress = totalHeight > 0 ? Math.min(100, (scrolled / totalHeight) * 100) : 100;

    // Update the circular progress bar
    if (readingProgressCircle) {
        const radius = readingProgressCircle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;

        // Set the initial stroke-dasharray to the circumference (once)
        if (readingProgressCircle.style.strokeDasharray === '') {
             readingProgressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        }

        // Calculate the offset based on progress
        // Offset starts at circumference (0% progress) and goes to 0 (100% progress)
        const offset = circumference * (100 - progress) / 100;
        readingProgressCircle.style.strokeDashoffset = offset;
    }

    // Show/hide the tick based on progress
    if (progressTick) {
         // Check if progress is very close to 100% due to potential floating point inaccuracies
        if (progress >= 99.5) { // Use 99.5 as a threshold for "completely filled"
            progressTick.style.display = 'block';
        } else {
            progressTick.style.display = 'none';
        }
    }
}

loadSounds();

renderQuiz();

submitButton.addEventListener('click', checkQuiz);

retryButton.addEventListener('click', renderQuiz);

window.addEventListener('scroll', updateReadingProgress);

audioIcon.addEventListener('click', () => {
    const isHidden = audioPlayerContainer.style.display === 'none';
    audioPlayerContainer.style.display = isHidden ? 'block' : 'none';
});

// Initial update to set the correct state on page load
updateReadingProgress();