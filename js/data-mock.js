/* Генерация массива объектов - моковых данных window.ads */

"use strict";

window.dataMock = (function () {
/* Исходный материал для генерации данных */

// Количество объявлений
let numberOfAds = 8;

// Заголовкий для объявлений
let titles = [
    "Большая уютная квартира",
    "Маленькая неуютная квартира",
    "Огромный прекрасный дворец",
    "Маленький ужасный дворец",
    "Красивый гостевой домик",
    "Некрасивый негостеприимный домик",
    "Уютное бунгало далеко от моря",
    "Неуютное бунгало по колено в воде"
];

// Типы объектов недвижимости
let types = [
    'palace',
    'flat',
    'house',
    'bungalo'
];

// Возможное время заезда/выезда
let checks = [
    '12:00',
    '13:00',
    '14:00'
];

// Перечень удобств на объекте
let features = [
    "wifi",
    "dishwasher",
    "parking",
    "washer",
    "elevator",
    "conditioner"
];

// Галерея фотографий объекта
let photos = [
    "http://o0.github.io/assets/images/tokyo/hotel1.jpg",
    "http://o0.github.io/assets/images/tokyo/hotel2.jpg",
    "http://o0.github.io/assets/images/tokyo/hotel3.jpg"
];

/* Функция генерации случайного набора дополнительных удобств-свойств на объекте */
let generateFeatures = function (features) {
    let numberOfFeatures = Math.floor(Math.random() * features.length) + 1;
    let set = new Set();
    let n;

    for (let i = 0; i <= numberOfFeatures; i++) {
        n = Math.floor(Math.random() * features.length);
        set.add(features[n]);
    }
    return Array.from(set);
};

/* Функция генерация массива случайных объектов ads на основе исходных данных*/
let generateAdObject = function () {
    let parentContainer = document.querySelector('.map__pins');
    let ads = [];
    let n;

    for (let i = 0; i < numberOfAds; i++) {
        let ad = {};
        let author = {};
        let offer = {};
        let location = {};

        author.avatar = `img/avatars/user0${i + 1}.png`;

        location.x = Math.floor(Math.random() * parentContainer.clientWidth) + 10;
        location.y = Math.floor(Math.random() * 501) + 130;

        offer.title = titles[i];
        offer.address = location.x + ', ' + location.y;
        offer.price = Math.floor(Math.random() * 1000000) + 1000;
        n = Math.floor(Math.random() * types.length);
        offer.type = types[n];
        n = Math.floor(Math.random() * 5) + 1;
        offer.rooms = n;
        n = Math.floor(Math.random() * 10) + 1;
        offer.guests = n;
        n = Math.floor(Math.random() * checks.length);
        offer.checkin = checks[n];
        n = Math.floor(Math.random() * checks.length);
        offer.checkout = checks[n];
        offer.features = generateFeatures(features);
        offer.photos = photos.sort(() => Math.random() - 0.5).slice();
        offer.description = '';

        ad.author = author;
        ad.offer = offer;
        ad.location = location;

        ads.push(ad);
    }
    return ads;
};

return {
    ads:generateAdObject()
};

})();


