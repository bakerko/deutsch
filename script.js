// script.js
// Резервный словарь на случай если внешний не загрузится
const fallbackDictionary = [
    {
        german: "Haus",
        translation: "дом",
        synonyms: ["Gebäude", "Wohnhaus"],
        synonymsTranslation: ["здание", "жилой дом"],
        partOfSpeech: "Substantiv"
    },
    {
        german: "Auto",
        translation: "автомобиль",
        synonyms: ["Wagen", "Fahrzeug"],
        synonymsTranslation: ["машина", "транспортное средство"],
        partOfSpeech: "Substantiv"
    },
    {
        german: "buchen",
        translation: "бронировать",
        synonyms: ["reservieren", "bestehlen"],
        synonymsTranslation: ["резервировать", "заказывать"],
        partOfSpeech: "Verb"
    }
];

class GoogleTranslateTTS {
    constructor() {
        this.baseUrl = 'https://translate.google.com/translate_tts';
        this.isPlaying = false;
    }

    async speak(text, language = 'de') {
        if (this.isPlaying) {
            this.stop();
        }

        try {
            this.isPlaying = true;
            const audio = new Audio();
            const encodedText = encodeURIComponent(text);

            audio.src = `${this.baseUrl}?ie=UTF-8&q=${encodedText}&tl=${language}&client=tw-ob&ttsspeed=0.8`;

            await audio.play();

            await new Promise((resolve) => {
                audio.onended = () => {
                    this.isPlaying = false;
                    resolve();
                };
                audio.onerror = () => {
                    this.isPlaying = false;
                    resolve();
                };
                setTimeout(() => {
                    this.isPlaying = false;
                    resolve();
                }, 5000);
            });

        } catch (error) {
            console.log('Google TTS error, using fallback');
            this.fallbackTTS(text);
        }
    }

    stop() {
        speechSynthesis.cancel();
        this.isPlaying = false;
    }

    fallbackTTS(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'de-DE';
        utterance.rate = 0.8;
        utterance.pitch = 1.0;
        speechSynthesis.speak(utterance);
    }
}

class VocabularyApp {
    constructor() {
        // Всегда есть словарь - либо внешний, либо резервный
        this.words = typeof vocabularyDictionary !== 'undefined' ?
            vocabularyDictionary : fallbackDictionary;

        this.remainingWords = [...this.words];
        this.currentCard = null;
        this.tts = new GoogleTranslateTTS();
        this.isSwiping = false;

        // Логируем какой словарь используем
        console.log('Используется словарь:',
            typeof vocabularyDictionary !== 'undefined' ? 'внешний' : 'резервный');

        // Вызываем инициализацию после создания всех свойств
        this.initializeApp();
    }

    initializeApp() {
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
    }

    setupEventListeners() {
        this.btnLeft.addEventListener('click', () => this.swipeLeft());
        this.btnRight.addEventListener('click', () => this.swipeRight());
        this.btnSound.addEventListener('click', (e) => {
            e.stopPropagation();
            this.speakWord();
        });
        this.btnFlip.addEventListener('click', (e) => {
            e.stopPropagation();
            this.flipCard();
        });

        // Обработка свайпов
        let startX = 0;
        let currentX = 0;

        this.cardContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            this.isSwiping = false;
        });

        this.cardContainer.addEventListener('touchmove', (e) => {
            currentX = e.touches[0].clientX;
            this.isSwiping = true;
        });

        this.cardContainer.addEventListener('touchend', () => {
            if (this.isSwiping) {
                const diff = currentX - startX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        this.swipeRight();
                    } else {
                        this.swipeLeft();
                    }
                }
            }
            this.isSwiping = false;
        });

        // Клик по карточке для переворота
        this.cardContainer.addEventListener('click', (e) => {
            if (!this.isSwiping && e.target.closest('.card') && !e.target.closest('.btn')) {
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
            this.btnSound.classList.add('tts-loading');

            // Проверяем, перевернута ли карточка
            const card = this.cardContainer.querySelector('.card');
            const isFlipped = card && card.classList.contains('flipped');

            if (isFlipped) {
                // Озвучиваем все синонимы по очереди
                for (const synonym of this.currentCard.synonyms) {
                    await this.tts.speak(synonym, 'de');
                    // Пауза между синонимами
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            } else {
                // Озвучиваем основное слово
                await this.tts.speak(this.currentCard.german, 'de');
            }

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