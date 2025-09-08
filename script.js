// script.js
class VocabularyApp {
    constructor() {
        // Проверяем что словарь загружен
        if (typeof vocabularyDictionary === 'undefined') {
            console.error('Словарь не загружен!');
            this.showError();
            return;
        }

        this.words = vocabularyDictionary;
        this.remainingWords = [...this.words];
        this.currentCard = null;
        this.tts = new GoogleTranslateTTS();
        this.isSwiping = false;
        this.init();
    }

    showError() {
        document.body.innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <h2>Ошибка загрузки словаря</h2>
                <p>Файл dictionary.js не загружен или содержит ошибки</p>
                <button onclick="location.reload()">Перезагрузить</button>
            </div>
        `;
    }

    // ... остальной код без изменений ...
}

// Ждем полной загрузки страницы и словаря
document.addEventListener('DOMContentLoaded', () => {
    // Даем время на загрузку dictionary.js
    setTimeout(() => {
        if (typeof vocabularyDictionary !== 'undefined') {
            new VocabularyApp();
        } else {
            console.error('Словарь не загружен после ожидания');
            document.body.innerHTML += '<p style="color: red;">Ошибка: словарь не загружен</p>';
        }
    }, 100);
});