/**
 * Point culture (en Français car je suis un peu obligé): 
 * Dans ce genre de jeu, un mot equivaut a 5 caractères, y compris les espaces. 
 * La precision, c'est le pourcentage de caractères tapées correctement sur toutes les caractères tapées.
 * 
 * Sur ce... Amusez-vous bien ! 
 */

let startTime = null, previousEndTime = null;
let currentWordIndex = 0;
const wordsToType = [];
let correctChars = 0;
let totalChars = 0;

const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const progressBar = document.getElementById("progress");
const timerDisplay = document.getElementById("timer");

let timerInterval;
const totalTime = 60;
const settings = JSON.parse(localStorage.getItem('typingGameSettings')) || {
    difficulty: 'medium',
    wordCount: 25
};

const words = {
    easy: ["apple", "banana", "grape", "orange", "cherry"],
    medium: ["keyboard", "monitor", "printer", "charger", "battery"],
    hard: ["synchronize", "complicated", "development", "extravagant", "misconception"]
};


const getRandomWord = (mode) => {
    const wordList = words[mode];
    return wordList[Math.floor(Math.random() * wordList.length)];
};


const startTest = () => {
    if (timerInterval) clearInterval(timerInterval);
    timerDisplay.textContent = `${totalTime}s`;
    inputField.disabled = false;
    inputField.focus();

    wordsToType.length = 0; 
    wordDisplay.innerHTML = "";
    currentWordIndex = 0;
    startTime = null;
    previousEndTime = null;
    correctChars = 0;
    totalChars = 0;
    wpmDisplay.textContent = "0";
    accuracyDisplay.textContent = "0";
    progressBar.style.width = "0%";

    for (let i = 0; i < settings.wordCount; i++) {
        wordsToType.push(getRandomWord(settings.difficulty));
    }

    wordsToType.forEach((word, index) => {
        const span = document.createElement("span");
        span.textContent = word + " ";
        if (index === 0) span.classList.add("current");
        wordDisplay.appendChild(span);
    });

    inputField.value = "";
};

const startTimer = () => {
    if (!startTime) {
        startTime = Date.now();
        let timeLeft = totalTime;
        timerInterval = setInterval(() => {
            timeLeft--;
            document.getElementById("timer").textContent = `${timeLeft}s`;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                inputField.disabled = true;
                calculateFinalStats();
            }
        }, 1000);
    }
};

const calculateFinalStats = () => {
    const elapsedMinutes = totalTime / 60;
    const wpm = (correctChars / 5) / elapsedMinutes;
    const accuracy = totalChars > 0 ? (correctChars / totalChars) * 100 : 0;
    
    wpmDisplay.textContent = Math.round(wpm);
    accuracyDisplay.textContent = Math.round(accuracy);
};

const updateCharStats = (typedWord, currentWord) => {
    for (let i = 0; i < typedWord.length; i++) {
        if (i < currentWord.length && typedWord[i] === currentWord[i]) {
            correctChars++;
        }
        totalChars++;
    }
    if (typedWord.length < currentWord.length) {
        totalChars += (currentWord.length - typedWord.length);
    }
};

const updateWord = (event) => {
    if (event.key === " ") {
        const typedWord = inputField.value.trim();
        const currentWord = wordsToType[currentWordIndex];
        const wordSpans = wordDisplay.querySelectorAll("span");
        
        updateCharStats(typedWord, currentWord);
        
        if (typedWord === currentWord) {
            wordSpans[currentWordIndex].classList.add("correct");
        } else {
            wordSpans[currentWordIndex].classList.add("incorrect");
        }
        
        currentWordIndex++;
        inputField.value = "";
        event.preventDefault();
        
        progressBar.style.width = `${(currentWordIndex / wordsToType.length) * 100}%`;
        
        if (currentWordIndex < wordSpans.length) {
            wordSpans.forEach(el => el.classList.remove("current"));
            wordSpans[currentWordIndex].classList.add("current");
        } else {
            clearInterval(timerInterval);
            inputField.disabled = true;
            calculateFinalStats();
        }
    }
};

inputField.addEventListener("keydown", (event) => {
    if (!startTime) startTimer();
    updateWord(event);
});

document.getElementById("restart-btn").addEventListener("click", startTest);

startTest();
