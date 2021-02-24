/* Создание карточки объявления CurrentAdInfoBlock */

"use strict";

window.infoBlock = (function() {
    const adTypes = {
        'palace': 'Дворец',
        'flat': 'Квартира',
        'house': 'Дом',
        'bungalo': 'Бунгало'
    };
    const adFeaturesTypes = {
        'wifi': '<li class="feature feature--wifi"></li>',
        'dishwasher': '<li class="feature feature--dishwasher"></li>',
        'parking': '<li class="feature feature--parking"></li>',
        'washer':  '<li class="feature feature--washer"></li>',
        'elevator': '<li class="feature feature--elevator"></li>',
        'conditioner': '<li class="feature feature--conditioner"></li>'
    };
    var adTemplate = document.querySelector('#pinTemplate').content.querySelector('.map__card');
    var closeButton;


    /* Слушатель нажатия на крестик для закрытия информационного блока сurrentAdInfoBlock*/
    var currentAdInfoBlockCloseHandler = function () {
        closeCurrentAdInfoBlock();
    };

    var currentAdInfoBlockPressEscHandler = function (evt) {
        if (evt.keyCode === window.utils.Code.ESC_KEYCODE) {
            closeCurrentAdInfoBlock();
        }
    };

    /* Функция закрытия информационного блока currentAdInfoBlock*/
    var closeCurrentAdInfoBlock = function () {
        if (window.currentAdInfoBlock) {
            closeButton.removeEventListener('click', currentAdInfoBlockCloseHandler);
            document.removeEventListener('keydown', currentAdInfoBlockPressEscHandler);
            window.pins.removeActiveClassFromPins();
            var CHILD = window.currentAdInfoBlock;
            CHILD.parentNode.removeChild(CHILD);
            window.currentAdInfoBlock = false;
        }
    };

    /* Функция формирования (рендеринга) информационного блока currentAdInfoBlock для отображения информации при клике на пине */
    var renderСurrentAdInfoBlock = function (ad) {
        var adElement = adTemplate.cloneNode(true);

        adElement.querySelector('.popup__avatar').src = ad.author.avatar;
        adElement.querySelector('.title').textContent = ad.offer.title;
        adElement.querySelector('.popup__text--address').textContent = ad.offer.address;
        adElement.querySelector('.popup__text--price').textContent =
            ad.offer.price + ' ₽/ночь';
        adElement.querySelector('.popup__text--capacity').textContent =
            ad.offer.rooms +
            ' комнаты для ' +
            ad.offer.guests +
            ' гостей';
        adElement.querySelector('.popup__text--time').textContent =
            'Заезд после ' +
            ad.offer.checkin +
            ', выезд до ' +
            ad.offer.checkout;

        adElement.querySelector('.popup__type').textContent = adTypes[ad.offer.type] || "Недвижимость";

        var featuresContainer = adElement.querySelector('.popup__features');
        featuresContainer.innerHTML = '';
        ad.offer.features.forEach( function (featureName){
            featuresContainer.innerHTML += adFeaturesTypes[featureName];
        });
        if (featuresContainer.innerHTML === '') {
            featuresContainer.innerHTML = 'Без удобств';
        }

        adElement.querySelector('.popup__description').textContent = ad.offer.description;

        var picturesContainer = adElement.querySelector('.popup__pictures');
        picturesContainer.innerHTML = '';
        for (var i = 0; i < ad.offer.photos.length; i++) {
            picturesContainer.innerHTML += '<li><img width="30%" src=""></li>';
        }
        var pictures = picturesContainer.querySelectorAll('img');
        for (var i = 0; i < ad.offer.photos.length; i++) {
            pictures[i].src = ad.offer.photos[i];
        }
        // Сначала удаляему слушатель предыдущего информационного блока
        if (closeButton) {
            closeButton.removeEventListener('click', currentAdInfoBlockCloseHandler);
        }
        // Затем вешаем слушатель на новый блок
        closeButton = adElement.querySelector('.popup__close');
        closeButton.addEventListener('click', currentAdInfoBlockCloseHandler);
        document.addEventListener('keydown', currentAdInfoBlockPressEscHandler);
        return adElement;
    };

    /* Функция отображения по клику на пин сформированного информационного блока currentAdInfoBlock */
    var showCurrentAdInfoBlock = function (target) {
        target.parentElement.querySelectorAll('.map__pin').forEach(function (item, i) {
            // Ищем пин на котором был клик, сравнивая каждый клик с событием
            if (item == target) {
                // Удаляем предыдущий инфоблок
                closeCurrentAdInfoBlock();
                // Пины были сформированы по порядку из массива ads. Они добавлены к уже стоящему там mainPin. Нужно определить порядковый номер пина по которому был совершен клик. Поскольку первый пин в блоке - это mainPin и он добавляет +1 к общему числу пинов, то для рендеринга мы берем информацию из ads с i на 1 меньше, чтобы порядковый номер пина из верстки совпадал с порядковым номером в ads.
                window.currentAdInfoBlock = renderСurrentAdInfoBlock(window.filters.adsFiltered[i - 1]);
                window.mapTokio.insertBefore(window.currentAdInfoBlock, window.mapTokio.querySelector('.map__filters-container'));
            }
        });
    };


    return {
        showCurrentAdInfoBlock:showCurrentAdInfoBlock,
        closeCurrentAdInfoBlock:closeCurrentAdInfoBlock
    };

})();