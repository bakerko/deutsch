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
    // ... (без изменений) ...
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
        this.init();

        // Логируем какой словарь используем
        console.log('Используется словарь:',
            typeof vocabularyDictionary !== 'undefined' ? 'внешний' : 'резервный');
    }

    // ... остальные методы без изменений ...
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    new VocabularyApp();
});