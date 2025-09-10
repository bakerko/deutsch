// script.js
console.log('Script.js запущен');

// Проверка что словарь загружен
if (typeof vocabularyDictionary === 'undefined') {
    console.error('СЛОВАРЬ хуярь НЕ ЗАГРУЖЕН! Проверь dictionary.js');
    alert('Ошибка: словарь не загружен. Проверь консоль для деталей.');
    throw new Error('vocabularyDictionary is not defined');
}

console.log('Словарь доступен, слов:', vocabularyDictionary.length);

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
        this.words = vocabularyDictionary;
        this.remainingWords = [...this.words];
        this.currentCard = null;
        this.tts = new GoogleTranslateTTS();
        this.isSwiping = false;

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
                <div class="translation">${word.partOfSpeech || ''}</div>
            </div>
            <div class="card-back">
                <div class="german-word">${word.translation}</div>
                ${word.synonyms && word.synonyms.length > 0 ? `
                    <div class="synonyms-title">Синонимы:</div>
                    <div class="synonyms-list">${synonymsHtml}</div>
                ` : ''}
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

            const card = this.cardContainer.querySelector('.card');
            const isFlipped = card && card.classList.contains('flipped');

            if (isFlipped) {
                for (const synonym of this.currentCard.synonyms) {
                    await this.tts.speak(synonym, 'de');
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            } else {
                await this.tts.speak(this.currentCard.german, 'de');
            }

        } catch (error) {
            console.error('TTS error:', error);
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
                    <h2>Поздравляем! 🎉</h2>
                    <p>Вы просмотрели все слова!</p>
                    <button onclick="location.reload()" class="btn btn-right" style="margin-top: 20px;">
                        Начать заново
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