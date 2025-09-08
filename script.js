class VocabularyApp {
    constructor() {
        this.words = [
            {
                german: "Haus",
                synonyms: ["Gebäude", "Wohnhaus", "Heim"],
                translation: "дом"
            },
            {
                german: "Auto",
                synonyms: ["Wagen", "Fahrzeug", "PKW"],
                translation: "автомобиль"
            },
            {
                german: "Buch",
                synonyms: ["Werk", "Literatur", "Schrift"],
                translation: "книга"
            },
            {
                german: "Freund",
                synonyms: ["Kumpel", "Kamerad", "Vertrauter"],
                translation: "друг"
            },
            {
                german: "Arbeit",
                synonyms: ["Job", "Beruf", "Tätigkeit"],
                translation: "работа"
            }
        ];

        this.remainingWords = [...this.words];
        this.currentCard = null;
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

        // Обработка свайпов на мобильных устройствах
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
            if (Math.abs(diff) > 50) { // Минимальное расстояние свайпа
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
        card.innerHTML = `
            <div class="card-front">
                <div class="german-word">${word.german}</div>
                <div class="translation">${word.translation}</div>
            </div>
            <div class="card-back">
                <div class="synonyms-title">Synonyme:</div>
                <div class="synonyms-list">${word.synonyms.join(', ')}</div>
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
        
        // Удаляем слово из оставшихся
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

    speakWord() {
        if (!this.currentCard) return;

        const utterance = new SpeechSynthesisUtterance(this.currentCard.german);
        utterance.lang = 'de-DE';
        utterance.rate = 0.8;
        utterance.pitch = 1.0;
        
        speechSynthesis.speak(utterance);
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

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    new VocabularyApp();
});