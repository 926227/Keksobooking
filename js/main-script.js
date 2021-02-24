"use strict";


/* Функция перевода страницы в активный режим */
window.activatePage = function () {
        document.querySelector('.map').classList.remove('map--faded');
        document.querySelector('.notice__form').classList.remove('notice__form--disabled');
        document.querySelectorAll('.notice__form fieldset')
            .forEach(function (item) {
                item.disabled = false;
            });
        mainPageActivated = true;
};

/* Функция перевода страницы в НЕактивный режим */
window.deactivatePage = function () {
    // очистки карты от пинов и сообщений
    clearMap();
    // reset формы фильтров
    document.querySelector('.map__filters').reset();
    // Затененеие карты
    document.querySelector('.map').classList.add('map--faded');
    // Затенение формы ввода объявления
    document.querySelector('.notice__form').classList.add('notice__form--disabled');
    // Disable все поля ввода в форме объявления
    document.querySelectorAll('.notice__form fieldset')
        .forEach(function (item) {
            item.disabled = true;
        });
    // reset формы объявления
    document.querySelector('.notice__form').reset();
    // устанавливаем значение адреса 
    document.querySelector('#address').value = mainPin.offsetLeft + ', ' + mainPin.offsetTop;
    // Переводим флаг активности страницы в false
    mainPageActivated = false;
};

/* Функция очистки карты от пинов и сообщений */
var clearMap = function () {
    if (currentAdInfoBlock) {
        mapTokio.removeChild(currentAdInfoBlock);
        currentAdInfoBlock = false;
    }
    window.pins.resetMainPin();
};

// Функция коллбэк для обработки успешного результата загрузки данных объявлений с сервера и наполнения переменной ads
var onLoadAds = function (data) {
    ads = data;
    window.filters.startFilters(ads);
};

// Функция использования моковых данных, в случае провала загрузки данных с сервера
var onErrorLoadAds = function(message){
    window.utils.showInfoWindow(message);
    ads = window.dataMock.ads;
    window.filters.startFilters(ads);
};

var mapTokio = document.querySelector('.map');
var mainPin = document.querySelector('.map__pin--main');
var ads = window.dataMock.ads;
var currentAdInfoBlock = false;
var mainPageActivated = false;


/* Begin MAIN */

// Загружаем данные объявлений с сервера
window.backend.load(onLoadAds, onErrorLoadAds);

// На всякий случай ставим страницу в исходное, деактивированное, состояние
window.deactivatePage();








// Одометр положеия курсора
// document.addEventListener ('mousemove', function (evt) {
//     document.querySelector('.coord').innerHTML = `${evt.clientX}:${evt.clientY}`;
// } );



