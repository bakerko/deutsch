// loader.js

// 1. Функция для получения параметра из URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// 2. Определяем, какой язык нам нужен
// Смотрим на параметр 'lang' в URL (например: ?lang=ar)
const langParam = getQueryParam('lang');
// Разрешенные языки (соответствуют именам наших файлов)
const allowedLangs = ['ru', 'ar']; // Можно добавить другие
// Проверяем, если параметр корректен, используем его. Если нет - используем русский по умолчанию.
const targetLang = allowedLangs.includes(langParam) ? langParam : 'ru';

// 3. Динамически создаем тег <script> и загружаем нужный словарь
const script = document.createElement('script');
script.src = `dictionary_${targetLang}.js`;
script.onload = function() {
    // Эта функция выполнится, когда словарь загрузится.
    console.log(`Словарь для языка "${targetLang}" загружен!`);
    // Теперь можно запускать ваш основной скрипт, который использует vocabularyDictionary
    initApp_loader();
};
script.onerror = function() {
    // Если файл не загрузился (например, его нет), грузим русский по умолчанию
    console.error(`Не удалось загрузить словарь для "${targetLang}". Загружаю русский.`);
    const fallbackScript = document.createElement('script');
    fallbackScript.src = 'dictionary-ru.js';
    fallbackScript.onload = initApp;
    document.head.appendChild(fallbackScript);
};

// 4. Добавляем скрипт в <head> документа
document.head.appendChild(script);

// 5. Функция, которая запускает основное приложение после загрузки словаря.
function initApp_loader() {
    // Проверяем, что глобальная переменная словаря создалась
    if (typeof vocabularyDictionary !== 'undefined') {
        console.log('Словарь готов к использованию:', vocabularyDictionary);
        // ЗДЕСЬ ВЫЗЫВАЙТЕ ВАШУ ОСНОВНУЮ ФУНКЦИЮ, которая работает со словарем.
        // Например: startQuiz(), renderVocabularyList(), и т.д.
        yourMainFunction(vocabularyDictionary);

    } else {
        console.error('Ошибка: словарь не загрузился.');
    }
}