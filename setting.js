document.addEventListener('DOMContentLoaded', function() {
    
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
        
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    

    const themeSelect = document.getElementById('theme-select');
    const customColor = document.getElementById('custom-color');
    const body = document.body;
    
    themeSelect.addEventListener('change', updateTheme);
    customColor.addEventListener('input', updateTheme);
    
    function updateTheme() {
        const theme = themeSelect.value;
        
        if (theme === 'custom') {
            
            document.documentElement.style.setProperty('--primary-color', customColor.value);
        } else {
            
            document.documentElement.style.removeProperty('--primary-color');
            
            if (theme === 'dark') {
                body.setAttribute('data-theme', 'dark');
            } else {
                body.removeAttribute('data-theme');
            }
        }
    }
    
    
    const volumeSlider = document.getElementById('sound-volume');
    const volumeValue = document.getElementById('volume-value');
    
    volumeSlider.addEventListener('input', function() {
        volumeValue.textContent = `${this.value}%`;
    });
    
    
    const testSoundBtn = document.getElementById('test-sound');
    
    testSoundBtn.addEventListener('click', function() {

        console.log('Son de test joué');
    });
    
    
    const closeBtn = document.querySelector('.close-btn');
    
    closeBtn.addEventListener('click', function() {

        console.log('Fermer les paramètres');
    
    });
    

    const saveBtn = document.getElementById('save-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    saveBtn.addEventListener('click', function() {

        const settings = {
            language: document.getElementById('language').value,
            timeMode: document.getElementById('time-mode').value,
            wordCount: document.getElementById('word-count').value,
            difficulty: document.getElementById('difficulty').value,
            theme: themeSelect.value,
            customColor: customColor.value,
            keyboardLayout: document.getElementById('keyboard-layout').value,
            showKeyboard: document.getElementById('show-keyboard').checked,
            soundOn: document.getElementById('sound-on').checked,
            soundVolume: volumeSlider.value,
            soundType: document.getElementById('sound-type').value
        };
        
        localStorage.setItem('typingGameSettings', JSON.stringify(settings));
        alert('Paramètres enregistrés avec succès!');
    });
    
    resetBtn.addEventListener('click', function() {
        if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres?')) {

            document.getElementById('language').value = 'french';
            document.getElementById('time-mode').value = '30';
            document.getElementById('word-count').value = '25';
            document.getElementById('difficulty').value = 'medium';
            themeSelect.value = 'light';
            customColor.value = '#ff5e5e';
            document.getElementById('keyboard-layout').value = 'azerty';
            document.getElementById('show-keyboard').checked = false;
            document.getElementById('sound-on').checked = true;
            volumeSlider.value = '50';
            volumeValue.textContent = '50%';
            document.getElementById('sound-type').value = 'click';
            
            updateTheme();
        }
    });
    
    function loadSettings() {
        const savedSettings = localStorage.getItem('typingGameSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            
            document.getElementById('language').value = settings.language || 'french';
            document.getElementById('time-mode').value = settings.timeMode || '30';
            document.getElementById('word-count').value = settings.wordCount || '25';
            document.getElementById('difficulty').value = settings.difficulty || 'medium';
            themeSelect.value = settings.theme || 'light';
            customColor.value = settings.customColor || '#ff5e5e';
            document.getElementById('keyboard-layout').value = settings.keyboardLayout || 'azerty';
            document.getElementById('show-keyboard').checked = settings.showKeyboard || false;
            document.getElementById('sound-on').checked = settings.soundOn !== false;
            volumeSlider.value = settings.soundVolume || '50';
            volumeValue.textContent = `${settings.soundVolume || '50'}%`;
            document.getElementById('sound-type').value = settings.soundType || 'click';
            
            updateTheme();
        }
    }
    
    loadSettings();
});