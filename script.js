// script.js
console.log('Script.js запущен');

// Проверка что словарь загружен
if (typeof vocabularyDictionary === 'undefined') {
    console.error('СЛОВАРЬ НЕ ЗАГРУЖЕН! Проверь dictionary.js');
    alert('Ошибка: словарь не загружен. Проверь консоль для деталей.');
    throw new Error('vocabularyDictionary is not defined');
}

console.log('Словарь доступен, слов:', vocabularyDictionary.length);

// Добавляем статистику к каждому слову
vocabularyDictionary.forEach(word => {
    if (!word.stats) {
        word.stats = {
            known: 0,      // количество нажатий "Знаю"
            unknown: 0,    // количество нажатий "Не знаю"
            lastShown: 0   // временная метка последнего показа
        };
    }
});

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
        this.currentCard = null;
        this.tts = new GoogleTranslateTTS();
        this.isSwiping = false;
        this.totalWords = this.words.length;
        this.learnedWords = 0;

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
        this.btnLeft.addEventListener('click', () => this.markAsUnknown());
        this.btnRight.addEventListener('click', () => this.markAsKnown());
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
                        this.markAsKnown();
                    } else {
                        this.markAsUnknown();
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

    // Алгоритм взвешенного выбора следующего слова
    getNextWord() {
        const now = Date.now();
        const twoMinutes = 120000; // 2 минуты в миллисекундах

        // Фильтруем слова, которые не показывались последние 2 минуты
        const availableWords = this.words.filter(word =>
            now - word.stats.lastShown > twoMinutes
        );

        // Если все слова были показаны недавно, используем все слова
        const wordsPool = availableWords.length > 0 ? availableWords : this.words;

        // Рассчитываем веса для каждого слова
        const weights = wordsPool.map(word => {
            const baseWeight = 100; // базовый вес
            const unknownBonus = word.stats.unknown * 5; // +5% за каждое "Не знаю"
            const knownPenalty = word.stats.known * 5;   // -5% за каждое "Знаю"

            let weight = baseWeight + unknownBonus - knownPenalty;

            // Устанавливаем ограничения на вес (10% - 200%)
            weight = Math.max(10, Math.min(200, weight));

            // Уменьшаем вес для слов, которые уже выучены
            if (word.stats.known >= 3) { // если слово известно 3+ раз
                weight *= 0.3;
            }

            return weight;
        });

        // Выбираем случайное слово с учетом весов
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;

        for (let i = 0; i < wordsPool.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return wordsPool[i];
            }
        }

        // Fallback: возвращаем последнее слово если что-то пошло не так
        return wordsPool[wordsPool.length - 1];
    }

    showNextCard() {
        this.cardContainer.innerHTML = '';

        // Проверяем, все ли слова выучены
        const allLearned = this.words.every(word => word.stats.known >= 3);
        if (allLearned) {
            this.showCompletionMessage();
            return;
        }

        this.currentCard = this.getNextWord();
        this.currentCard.stats.lastShown = Date.now();

        const card = this.createCard(this.currentCard);
        this.cardContainer.appendChild(card);
    }

    markAsKnown() {
        const card = this.cardContainer.querySelector('.card');
        if (!card || !this.currentCard) return;

        card.classList.add('swipe-right');
        this.currentCard.stats.known++;

        setTimeout(() => {
            this.updateStats();
            this.showNextCard();
        }, 500);
    }

    markAsUnknown() {
        const card = this.cardContainer.querySelector('.card');
        if (!card || !this.currentCard) return;

        card.classList.add('swipe-left');
        this.currentCard.stats.unknown++;

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
        // Считаем количество выученных слов (известных 3+ раз)
        this.learnedWords = this.words.filter(word => word.stats.known >= 3).length;
        const progress = (this.learnedWords / this.totalWords) * 100;

        this.progressBar.style.width = `${progress}%`;
        this.remainingCount.textContent = this.totalWords - this.learnedWords;
    }

    showCompletionMessage() {
        this.cardContainer.innerHTML = `
            <div class="card">
                <div style="text-align: center;">
                    <h2>Поздравляем! 🎉</h2>
                    <p>Вы выучили все слова!</p>
                    <p>Всего слов: ${this.totalWords}</p>
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