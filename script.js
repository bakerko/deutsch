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

// Основной класс приложения
class VocabularyApp {
    constructor() {
        this.words = [
            {
                german: "die Bewegungsfähigkeit",
                translation: "двигательная способность",
                synonyms: ["die Motorik"],
                synonymsTranslation: ["моторика"]
            },
            {
                german: "die Demenz",
                translation: "деменция",
                synonyms: ["geistige Behinderung"],
                synonymsTranslation: ["умственная отсталость"]
            },
            {
                german: "der Fahrtendienst",
                translation: "транспортная служба",
                synonyms: ["der Abholdienst"],
                synonymsTranslation: ["служба доставки"]
            },
            {
                german: "die Körperhygiene",
                translation: "гигиена тела",
                synonyms: ["die Körperpflege"],
                synonymsTranslation: ["уход за телом"]
            },
            {
                german: "die Kräftigung",
                translation: "укрепление",
                synonyms: ["die Stärkung"],
                synonymsTranslation: ["усиление"]
            },
            {
                german: "die Mobilisation",
                translation: "мобилизация",
                synonyms: ["das Bewegen", "das Gehen"],
                synonymsTranslation: ["движение", "ходьба"]
            },
            {
                german: "der Rollator",
                translation: "роллатор",
                synonyms: ["die Gehhilfe"],
                synonymsTranslation: ["ходунки"]
            },
            {
                german: "belasten",
                translation: "нагружать",
                synonyms: ["zur Last fallen"],
                synonymsTranslation: ["обременять"]
            },
            {
                german: "bewusst",
                translation: "сознательный",
                synonyms: ["geistig wach"],
                synonymsTranslation: ["умственно бодрый"]
            },
            {
                german: "dement",
                translation: "дементный",
                synonyms: ["geistig verwirrt"],
                synonymsTranslation: ["умственно запутанный"]
            },
            {
                german: "verwirrt",
                translation: "запутанный",
                synonyms: ["durcheinander"],
                synonymsTranslation: ["беспорядочный"]
            },
            {
                german: "stundenweise",
                translation: "посчасово",
                synonyms: ["pro Stunde"],
                synonymsTranslation: ["в час"]
            },
            {
                german: "der Aufwand",
                translation: "затраты",
                synonyms: ["die Bemühungen", "die Ausbrenungen"],
                synonymsTranslation: ["усилия", "выгорания"]
            },
            {
                german: "das Ausmaß",
                translation: "масштаб",
                synonyms: ["die Größe", "der Umfang", "die Anzahl"],
                synonymsTranslation: ["размер", "объем", "количество"]
            },
            {
                german: "die Finanzierung",
                translation: "финансирование",
                synonyms: ["die Bezahlung"],
                synonymsTranslation: ["оплата"]
            },
            {
                german: "der Genuss",
                translation: "наслаждение",
                synonyms: ["der Geschmack"],
                synonymsTranslation: ["вкус"]
            },{
                german: "abhängig von",
                translation: "зависимый от",
                synonyms: ["süchtig von"],
                synonymsTranslation: ["одержимый от"]
            },
            {
                german: "anerkannt",
                translation: "признанный",
                synonyms: ["akzeptiert", "nostrifiziert"],
                synonymsTranslation: ["принятый", "легализованный"]
            },
            {
                german: "angewiesen",
                translation: "нуждающийся",
                synonyms: ["Hilfe benötigen"],
                synonymsTranslation: ["требующий помощи"]
            },
            {
                german: "akustisch",
                translation: "акустический",
                synonyms: ["klangmäßig", "laut dem Gehör"],
                synonymsTranslation: ["звуковой", "по слуху"]
            },
            {
                german: "athletisch",
                translation: "атлетический",
                synonyms: ["muskulös", "kräftig"],
                synonymsTranslation: ["мускулистый", "сильный"]
            },
        ];

        this.remainingWords = [...this.words];
        this.currentCard = null;
        this.tts = new GoogleTranslateTTS();
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
            this.btnSound.classList.add('tts-loading');
            await this.tts.speak(this.currentCard.german, 'de');
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