class FreeHighQualityTTS {
    constructor() {
        this.voices = [];
        this.init();
    }

    async init() {
        await this.loadVoices();
    }

    loadVoices() {
        return new Promise((resolve) => {
            if (speechSynthesis.getVoices().length > 0) {
                this.voices = speechSynthesis.getVoices();
                resolve();
            } else {
                speechSynthesis.addEventListener('voiceschanged', () => {
                    this.voices = speechSynthesis.getVoices();
                    resolve();
                });
            }
        });
    }

    speak(text, language = 'de-DE') {
        return new Promise((resolve) => {
            speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);

            // Оптимальные настройки для немецкого
            utterance.rate = 0.85;
            utterance.pitch = 1.1;
            utterance.volume = 1.0;
            utterance.lang = language;

            this.selectBestVoice(utterance, language);

            utterance.onend = resolve;
            utterance.onerror = resolve;

            speechSynthesis.speak(utterance);
        });
    }

    selectBestVoice(utterance, language) {
        const germanVoices = this.voices.filter(voice =>
            voice.lang.includes('de') && voice.localService === false
        );

        if (germanVoices.length > 0) {
            const neuralVoice = germanVoices.find(voice =>
                voice.name.includes('Neural') || voice.name.includes('Wave')
            );

            const premiumVoice = germanVoices.find(voice =>
                voice.name.includes('Premium') || voice.name.includes('Enhanced')
            );

            utterance.voice = neuralVoice || premiumVoice || germanVoices[0];
        }
    }

    getAvailableVoices() {
        return this.voices.filter(voice => voice.lang.includes('de'));
    }
}

// Предзагрузка голосов при запуске
function preloadTTSVoice() {
    const utterance = new SpeechSynthesisUtterance(' ');
    speechSynthesis.speak(utterance);
    speechSynthesis.cancel();
}

// Основной класс приложения
class VocabularyApp {
    constructor() {
        this.words = [
            {
                german: "Haus",
                synonyms: ["Gebäude", "Wohnhaus", "Heim"],
                synonymsTranslation: ["здание", "жилой дом", "дом"],
                translation: "дом"
            },
            {
                german: "Auto",
                synonyms: ["Wagen", "Fahrzeug", "PKW"],
                synonymsTranslation: ["автомобиль", "транспортное средство", "легковой автомобиль"],
                translation: "автомобиль"
            },
            {
                german: "Buch",
                synonyms: ["Werk", "Literatur", "Schrift"],
                synonymsTranslation: ["произведение", "литература", "писание"],
                translation: "книга"
            },
            {
                german: "Freund",
                synonyms: ["Kumpel", "Kamerad", "Vertrauter"],
                synonymsTranslation: ["приятель", "товарищ", "доверенное лицо"],
                translation: "друг"
            },
            {
                german: "Arbeit",
                synonyms: ["Job", "Beruf", "Tätigkeit"],
                synonymsTranslation: ["работа", "профессия", "деятельность"],
                translation: "работа"
            },
            {
                german: "schön",
                synonyms: ["hübsch", "attraktiv", "ansehnlich"],
                synonymsTranslation: ["милый", "привлекательный", "видный"],
                translation: "красивый"
            },
            {
                german: "essen",
                synonyms: ["speisen", "nahrung aufnehmen", "verpflegen"],
                synonymsTranslation: ["питаться", "принимать пищу", "кормить"],
                translation: "есть"
            }
        ];

        this.remainingWords = [...this.words];
        this.currentCard = null;
        this.tts = new FreeHighQualityTTS();
        this.init();
    }

    init() {
        this.cardContainer = document.getElementById('cardContainer');
        this.btnLeft = document.getElementById('btnLeft');
        this.btnRight = document.getElementById('btnRight');
        this.btnSound = document.getElementById('btnSound');
        this.btnFlip = document.getElementById('btnFlip');
        this.progressBar = document.getElementById('progressBar');
        this.remainingCount = document.getElementById('remainingCount');

        this.setupEventListeners();
        this.updateStats();
        this.showNextCard();

        // Предзагрузка голосов
        preloadTTSVoice();
    }

    setupEventListeners() {
        this.btnLeft.addEventListener('click', () => this.swipeLeft());
        this.btnRight.addEventListener('click', () => this.swipeRight());
        this.btnSound.addEventListener('click', () => this.speakWord());
        this.btnFlip.addEventListener('click', () => this.flipCard());

        // Обработка свайпов
        let startX = 0;
        let currentX = 0;

        this.cardContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        this.cardContainer.addEventListener('touchmove', (e) => {
            currentX = e.touches[0].clientX;
        });

        this.cardContainer.addEventListener('touchend', () => {
            const diff = currentX - startX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.swipeRight();
                } else {
                    this.swipeLeft();
                }
            }
        });

        // Клик по карточке для переворота
        this.cardContainer.addEventListener('click', (e) => {
            if (e.target.closest('.card') && !e.target.closest('.btn')) {
                this.flipCard();
            }
        });
    }

    createCard(word) {
        const card = document.createElement('div');
        card.className = 'card';

        let synonymsHtml = '';
        for (let i = 0; i < word.synonyms.length; i++) {
            synonymsHtml += `
                <div class="synonym-item">
                    <span class="synonym-german">${word.synonyms[i]}</span>
                    <span class="synonym-translation">${word.synonymsTranslation[i]}</span>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="card-front">
                <div class="german-word">${word.german}</div>
                <div class="translation">${word.translation}</div>
            </div>
            <div class="card-back">
                <div class="synonyms-title">Synonyme mit Übersetzung:</div>
                <div class="synonyms-list">${synonymsHtml}</div>
            </div>
        `;
        return card;
    }

    showNextCard() {
        this.cardContainer.innerHTML = '';

        if (this.remainingWords.length === 0) {
            this.showCompletionMessage();
            return;
        }

        const randomIndex = Math.floor(Math.random() * this.remainingWords.length);
        this.currentCard = this.remainingWords[randomIndex];

        const card = this.createCard(this.currentCard);
        this.cardContainer.appendChild(card);
    }

    swipeRight() {
        const card = this.cardContainer.querySelector('.card');
        if (!card) return;

        card.classList.add('swipe-right');

        const index = this.remainingWords.indexOf(this.currentCard);
        if (index > -1) {
            this.remainingWords.splice(index, 1);
        }

        setTimeout(() => {
            this.updateStats();
            this.showNextCard();
        }, 500);
    }

    swipeLeft() {
        const card = this.cardContainer.querySelector('.card');
        if (!card) return;

        card.classList.add('swipe-left');

        setTimeout(() => {
            this.updateStats();
            this.showNextCard();
        }, 500);
    }

    flipCard() {
        const card = this.cardContainer.querySelector('.card');
        if (card) {
            card.classList.toggle('flipped');
        }
    }

    async speakWord() {
        if (!this.currentCard) return;

        try {
            // Добавляем индикатор загрузки
            this.btnSound.classList.add('tts-loading');
            await this.tts.speak(this.currentCard.german, 'de-DE');
        } catch (error) {
            console.error('TTS error:', error);
            // Fallback на стандартный TTS
            const utterance = new SpeechSynthesisUtterance(this.currentCard.german);
            utterance.lang = 'de-DE';
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
        } finally {
            this.btnSound.classList.remove('tts-loading');
        }
    }

    updateStats() {
        const total = this.words.length;
        const remaining = this.remainingWords.length;
        const progress = ((total - remaining) / total) * 100;

        this.progressBar.style.width = `${progress}%`;
        this.remainingCount.textContent = remaining;
    }

    showCompletionMessage() {
        this.cardContainer.innerHTML = `
            <div class="card">
                <div style="text-align: center;">
                    <h2>Herzlichen Glückwunsch! 🎉</h2>
                    <p>Du hast alle Wörter durchgesehen!</p>
                    <button onclick="location.reload()" class="btn btn-right" style="margin-top: 20px;">
                        Nochmal beginnen
                    </button>
                </div>
            </div>
        `;

        this.btnLeft.style.display = 'none';
        this.btnRight.style.display = 'none';
        this.btnSound.style.display = 'none';
        this.btnFlip.style.display = 'none';
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    new VocabularyApp();
});