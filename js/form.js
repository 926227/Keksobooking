/* Работа с формой */

"use strict";

(function() {
    var noticeForm = document.querySelector('.notice__form');
        
    /* Функция замены плейсхолдера для цены объекта и минимального значения для цены объекта - в зависимости от выбранного типа объекта*/
    let changePlaceholderPrice = function (inputType, inputPrice) {
        switch (inputType.value) {
            case "flat": {
                inputPrice.placeholder = '1000';
                inputPrice.min = '1000';
            }
                break;
            case "bungalo": {
                inputPrice.placeholder = '0';
                inputPrice.min = '0';
            }
                break;
            case "house": {
                inputPrice.placeholder = '5000';
                inputPrice.min = '5000';
            }
                break;
            case "palace": {
                inputPrice.placeholder = '10000';
                inputPrice.min = '10000';
            }
                break;
            default: {
                inputPrice.placeholder = '0';
                inputPrice.min = '0';
            }
        }
    };

    /*Функция привязки значения Количество мест в зависимости от значения Количество комнат  */
    let changeCapacity = function (roomNumber, capacity) {
        switch (roomNumber.value) {
            case "1": 
                capacity.innerHTML = 
                `<option value="1">для 1 гостя</option>`;
                break;
            case "2": 
                capacity.innerHTML = 
                `<option value="2">для 2 гостей</option>
                <option value="1">для 1 гостя</option>`;
                break;
            case "3": 
                capacity.innerHTML = 
                `<option value="3">для 3 гостей</option>
                <option value="2">для 2 гостей</option>
                <option value="1">для 1 гостя</option>`;
                break;
            case "100": capacity.innerHTML = 
                `<option value="0">не для гостей</option>`;
                break;
            default: capacity.innerHTML = 
                '<option value="1">для 1 гостя</option>';
        }
    };


    /* Begin Обработка событий формы и валидации */

        /* Begin привязываем друг к другу значения checkin  и  checkout  в объявления */
        noticeForm.querySelector('#timein').addEventListener('input', function () {
            noticeForm.querySelector('#timeout').value = noticeForm.querySelector('#timein').value;
        });
        noticeForm.querySelector('#timeout').addEventListener('input', function () {
            noticeForm.querySelector('#timein').value = noticeForm.querySelector('#timeout').value;
        });
        /* End */

    // Привязываем значение плейсхолдера цены и ее минимального значения к типу объекта
    noticeForm.querySelector('#type').addEventListener('input', function () {
        changePlaceholderPrice(noticeForm.querySelector('#type'), noticeForm.querySelector('#price'));
    });

    // Привязываем значение Количество мест в зависимость от значения Количество комнат
    noticeForm.querySelector('#room_number').addEventListener('input', function () {
        changeCapacity(noticeForm.querySelector('#room_number'), noticeForm.querySelector('#capacity'));
    });

    // Отправка формы. Обработка клика на кнопке отправки формы.
    noticeForm.addEventListener('submit', function (evt) {
        // Показываем окно успешной отправки формы
        // window.utils.showInfoWindow ('Сообщение успешно отправлено!');
        window.backend.save(new FormData(noticeForm), window.utils.showInfoWindow, window.utils.showInfoWindow);
        evt.preventDefault();
            // На самом деле пока форму никуда не отправляем
            // document.querySelector('.notice__form').submit();

    });

    // Обрабатываем клик на нопке reset формы
    noticeForm.querySelector('.form__reset').addEventListener('click', function (evt) {
        evt.preventDefault();
        noticeForm.reset();
        window.deactivatePage();
    });

    /* End Обработка событий формы и валидации */


})();