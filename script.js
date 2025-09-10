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
            front: {
                known: 0,      // количество нажатий "Знаю" для лицевой стороны
                unknown: 0,    // количество нажатий "Не знаю" для лицевой стороны
                learned: false // выучена ли лицевая сторона
            },
            back: {
                known: 0,      // количество нажатий "Знаю" для оборотной стороны
                unknown: 0,    // количество нажатий "Не знаю" для оборотной стороны
                learned: false // выучена ли оборотная сторона
            },
            lastShown: 0,      // временная метка последнего показа
            lastSide: 'front'  // какая сторона показывалась последней
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
        this.currentSide = 'front'; // 'front' или 'back'
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

    createCard(word, side) {
        const card = document.createElement('div');
        card.className = 'card';

        if (side === 'back') {
            card.classList.add('flipped');
        }

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

    // Алгоритм взвешенного выбора следующего слова и стороны
    getNextWord() {
        const now = Date.now();
        const twoMinutes = 120000;

        // Фильтруем слова, которые не показывались последние 2 минуты
        const availableWords = this.words.filter(word =>
            now - word.stats.lastShown > twoMinutes
        );

        const wordsPool = availableWords.length > 0 ? availableWords : this.words;

        // Рассчитываем веса для каждого слова
        const weights = wordsPool.map(word => {
            const baseWeight = 100;

            // Определяем, какую сторону показывать
            let sideWeight = 0;
            let showSide = 'front';

            if (!word.stats.front.learned) {
                // Если лицевая сторона не выучена, показываем ее
                showSide = 'front';
                sideWeight = 150; // приоритет невыученной стороне
            } else if (!word.stats.back.learned) {
                // Если оборотная сторона не выучена, показываем ее
                showSide = 'back';
                sideWeight = 150;
            } else {
                // Если обе стороны выучены, выбираем случайную
                showSide = Math.random() > 0.5 ? 'front' : 'back';
                sideWeight = 30; // очень низкий вес для выученных слов
            }

            // Учитываем статистику для выбранной стороны
            const sideStats = word.stats[showSide];
            const unknownBonus = sideStats.unknown * 5;
            const knownPenalty = sideStats.known * 3;

            let weight = baseWeight + unknownBonus - knownPenalty + sideWeight;

            // Устанавливаем ограничения на вес
            weight = Math.max(10, Math.min(300, weight));

            return { word, weight, showSide };
        });

        // Выбираем случайное слово с учетом весов
        const totalWeight = weights.reduce((sum, item) => sum + item.weight, 0);
        let random = Math.random() * totalWeight;

        for (let i = 0; i < weights.length; i++) {
            random -= weights[i].weight;
            if (random <= 0) {
                return {
                    word: weights[i].word,
                    side: weights[i].showSide
                };
            }
        }

        return {
            word: weights[weights.length - 1].word,
            side: weights[weights.length - 1].showSide
        };
    }

    showNextCard() {
        this.cardContainer.innerHTML = '';

        // Проверяем, все ли стороны всех слов выучены
        const allLearned = this.words.every(word =>
            word.stats.front.learned && word.stats.back.learned
        );

        if (allLearned) {
            this.showCompletionMessage();
            return;
        }

        const next = this.getNextWord();
        this.currentCard = next.word;
        this.currentSide = next.side;

        this.currentCard.stats.lastShown = Date.now();
        this.currentCard.stats.lastSide = this.currentSide;

        const card = this.createCard(this.currentCard, this.currentSide);
        this.cardContainer.appendChild(card);
    }

    markAsKnown() {
        const card = this.cardContainer.querySelector('.card');
        if (!card || !this.currentCard) return;

        const sideStats = this.currentCard.stats[this.currentSide];
        sideStats.known++;

        // Помечаем сторону как выученную после 2 правильных ответов
        if (sideStats.known >= 1 && sideStats.unknown === 0) {
            sideStats.learned = true;
        }

        card.classList.add('swipe-right');

        setTimeout(() => {
            this.updateStats();
            this.showNextCard();
        }, 500);
    }

    markAsUnknown() {
        const card = this.cardContainer.querySelector('.card');
        if (!card || !this.currentCard) return;

        const sideStats = this.currentCard.stats[this.currentSide];
        sideStats.unknown++;

        // Сбрасываем флаг выученности при ошибке
        if (sideStats.learned) {
            sideStats.learned = false;
        }

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
            this.currentSide = this.currentSide === 'front' ? 'back' : 'front';
        }
    }

    async speakWord() {
        if (!this.currentCard) return;

        try {
            this.btnSound.classList.add('tts-loading');

            const card = this.cardContainer.querySelector('.card');
            const isFlipped = card && card.classList.contains('flipped');
            const currentSide = isFlipped ? 'back' : 'front';

            if (currentSide === 'back') {
                for (const synonym of this.currentCard.synonyms) {
                    await this.tts.speak(synonym, 'de');
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            } else {
                await this.tts.speak(this.currentCard.german, 'de');
            }

        } catch (error) {
            console.error('TTS error:', error);
            const textToSpeak = this.currentSide === 'front' ?
                this.currentCard.german : this.currentCard.synonyms[0];
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.lang = 'de-DE';
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
        } finally {
            this.btnSound.classList.remove('tts-loading');
        }
    }

    updateStats() {
        // Считаем количество выученных сторон
        const learnedSides = this.words.reduce((total, word) => {
            return total + (word.stats.front.learned ? 1 : 0) + (word.stats.back.learned ? 1 : 0);
        }, 0);

        const totalSides = this.totalWords * 2;
        const progress = (learnedSides / totalSides) * 100;

        this.progressBar.style.width = `${progress}%`;
        this.remainingCount.textContent = totalSides - learnedSides;
    }

    showCompletionMessage() {
        this.cardContainer.innerHTML = `
            <div class="card">
                <div style="text-align: center;">
                    <h2>Поздравляем! 🎉</h2>
                    <p>Вы полностью выучили все слова со всех сторон!</p>
                    <p>Всего слов: ${this.totalWords}</p>
                    <p>Выучено сторон: ${this.totalWords * 2}</p>
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