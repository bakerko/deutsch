// loader.js

// 1. Функция для получения параметра из URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// 2. Функция-загрузчик словаря
function loadDictionary(lang, callback) {
    const script = document.createElement('script');
    script.src = `dictionary2_${lang}.js`;

    script.onload = function() {
        console.log(`Словарь для языка "${lang}" загружен!`);
        if (typeof callback === 'function') {
            callback();
        }
    };

    script.onerror = function() {
        console.error(`Не удалось загрузить словарь для "${lang}". Пробую загрузить резервный (ru)...`);
        //loadDictionary('ru', callback);
    };

    document.head.appendChild(script);
}

// 3. Функция для подключения основного скрипта
function loadMainScript() {
    const script = document.createElement('script');
    script.src = 'script.js';
    document.head.appendChild(script);
}

// 4. Определяем язык и запускаем процесс
const langParam = getQueryParam('lang');
const allowedLangs = ['ru', 'ar'];
const targetLang = allowedLangs.includes(langParam) ? langParam : 'ru';

// 5. Сначала грузим словарь, потом основной скрипт
loadDictionary(targetLang, loadMainScript);