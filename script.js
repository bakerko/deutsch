// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Ждем немного чтобы dictionary.js успел загрузиться
    setTimeout(() => {
        if (typeof vocabularyDictionary !== 'undefined' && Array.isArray(vocabularyDictionary)) {
            new VocabularyApp();
        } else {
            console.error('Словарь не загружен или не является массивом');
            // Показываем сообщение об ошибке
            const container = document.querySelector('.container');
            if (container) {
                container.innerHTML = `
                    <div style="color: red; text-align: center; padding: 50px;">
                        <h2>Ошибка загрузки словаря</h2>
                        <p>Проверьте файл dictionary.js</p>
                        <button onclick="location.reload()">Перезагрузить</button>
                    </div>
                `;
            }
        }
    }, 50);
});