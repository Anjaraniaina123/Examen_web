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

const modeSelect = document.getElementById("mode");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");

document.addEventListener('DOMContentLoaded', function() {
    const config = {
        words: {
            easy: ["apple", "banana", "grape", "orange", "cherry"],
            medium: ["keyboard", "monitor", "printer", "charger", "battery"],
            hard: ["synchronize", "complicated", "development", "extravagant", "misconception"]
        },
        defaultTime: 60,
        defaultWordCount: 20
    };

    const elements = {
        modeSelect: document.getElementById('mode'),
        wordDisplay: document.getElementById('word-display'),
        inputField: document.getElementById('input-field'),
        restartBtn: document.getElementById('restart-btn'),
        timer: document.getElementById('timer'),
        wpm: document.getElementById('wpm'),
        accuracy: document.getElementById('accuracy'),
        progress: document.getElementById('progress')
    };

    const state = {
        wordsToType: [],
        currentWordIndex: 0,
        startTime: null,
        timerInterval: null,
        timeLeft: config.defaultTime,
        wordCount: config.defaultWordCount,
        correctChars: 0,
        totalChars: 0
    };

    function initTest() {
        loadSettings();
        resetState();
        generateWords();
        displayWords();
        setupEventListeners();
    }

    function loadSettings() {
        const settings = JSON.parse(localStorage.getItem('typingTestSettings')) || {};
        state.timeLeft = parseInt(settings.timeMode) || config.defaultTime;
        state.wordCount = parseInt(settings.wordCount) || config.defaultWordCount;
        updateTimerDisplay();
    }

    function resetState() {
        clearInterval(state.timerInterval);
        state.wordsToType = [];
        state.currentWordIndex = 0;
        state.startTime = null;
        state.correctChars = 0;
        state.totalChars = 0;
        elements.inputField.value = '';
        elements.inputField.disabled = false;
        elements.inputField.focus();
        updateResults(0, 0);
    }

    function generateWords() {
        const mode = elements.modeSelect.value;
        const wordList = config.words[mode];
        
        for (let i = 0; i < state.wordCount; i++) {
            const randomIndex = Math.floor(Math.random() * wordList.length);
            state.wordsToType.push(wordList[randomIndex]);
        }
    }

    function displayWords() {
        elements.wordDisplay.innerHTML = '';
        
        state.wordsToType.forEach((word, index) => {
            const span = document.createElement('span');
            span.textContent = word + (index < state.wordsToType.length - 1 ? ' ' : '');
            
            if (index === state.currentWordIndex) {
                span.classList.add('current');
            } else if (index < state.currentWordIndex) {
                span.classList.add('correct');
            }
            
            elements.wordDisplay.appendChild(span);
        });
    }

    function startTimer() {
        if (!state.startTime) {
            state.startTime = Date.now();
            state.timerInterval = setInterval(updateTimer, 1000);
        }
    }

    function updateTimer() {
        state.timeLeft--;
        updateTimerDisplay();
        
        if (state.timeLeft <= 0) {
            endTest();
        }
    }

    function updateTimerDisplay() {
        elements.timer.textContent = `${state.timeLeft}s`;
        if (state.timeLeft <= 10) {
            elements.timer.style.color = '#ff4444';
        }
    }

    function calculateMetrics() {
        if (!state.startTime) return { wpm: 0, accuracy: 0 };
        
        const elapsedMinutes = (Date.now() - state.startTime) / 60000;
        const wpm = Math.round((state.correctChars / 5) / elapsedMinutes);
        const accuracy = state.totalChars > 0 
            ? Math.round((state.correctChars / state.totalChars) * 100) 
            : 0;
            
        return { wpm, accuracy };
    }

    function updateResults(wpm, accuracy) {
        elements.wpm.textContent = wpm;
        elements.accuracy.textContent = accuracy;
        elements.progress.style.width = `${(state.currentWordIndex / state.wordCount) * 100}%`;
    }

    function endTest() {
        clearInterval(state.timerInterval);
        elements.inputField.disabled = true;
        
        const { wpm, accuracy } = calculateMetrics();
        updateResults(wpm, accuracy);
        
        saveHighScore(wpm, accuracy);
    }

    function saveHighScore(wpm, accuracy) {
        const highScores = JSON.parse(localStorage.getItem('typingHighScores')) || [];
        highScores.push({
            wpm,
            accuracy,
            date: new Date().toISOString(),
            difficulty: elements.modeSelect.value
        });
        localStorage.setItem('typingHighScores', JSON.stringify(highScores));
    }

    function handleInput() {
        const currentWord = state.wordsToType[state.currentWordIndex];
        const inputText = elements.inputField.value;
        
        if (!state.startTime) startTimer();
        
        if (inputText === currentWord) {
            state.correctChars += currentWord.length;
            state.totalChars += currentWord.length;
            state.currentWordIndex++;
            
            if (state.currentWordIndex >= state.wordsToType.length) {
                endTest();
                return;
            }
            
            displayWords();
            elements.inputField.value = '';
        } else {
            state.totalChars = inputText.length;
            state.correctChars = 0;
            
            for (let i = 0; i < Math.min(inputText.length, currentWord.length); i++) {
                if (inputText[i] === currentWord[i]) state.correctChars++;
            }
        }
        
        const { wpm, accuracy } = calculateMetrics();
        updateResults(wpm, accuracy);
    }

    function setupEventListeners() {
        elements.inputField.addEventListener('input', handleInput);
        elements.restartBtn.addEventListener('click', initTest);
        elements.modeSelect.addEventListener('change', initTest);
    }

    initTest();
});