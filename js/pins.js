/* Создание пина - метки на карте */

"use strict";

window.pins = (function() {
    var pinTemplate = document.querySelector('#pinTemplate').content.querySelector('button.map__pin');
    var pinsTokio = document.querySelector('.map__pins');
    var mainPin = document.querySelector('.map__pin--main');

    /* Функция формирования массива пинов pinElements на основе массива объектов ads*/
    var renderPins = function (pinTemplate, ads) {
        var pinElements = [];
        var adsLength = ads.length;

        for (var i = 0; i < adsLength; i++) {
            var pinElement = pinTemplate.cloneNode(true);
            var pinImage = pinElement.querySelector('img');

            pinElement.style.left = ads[i].location.x + 'px';
            pinElement.style.top = ads[i].location.y + 'px';
            pinImage.src = ads[i].author.avatar;
            pinImage.alt = ads[i].offer.title;
            pinImage.title = ads[i].offer.title;
            pinElements.push(pinElement);
        }
        return pinElements;
    };

    /* Функция добавления пинов в разметку*/
    var pinListing = function (ads) {
        var pinElements = renderPins(pinTemplate, ads);
        var fragment = document.createDocumentFragment();

        for (var i = 0; i < pinElements.length; i++) {
            fragment.appendChild(pinElements[i]);
        }
        pinsTokio.appendChild(fragment);
    };

    /* Функция удаляет все пины, оставля на месте только mianPin */
    var clearPins = function(){
        pinsTokio.innerHTML = '';
        pinsTokio.appendChild(mainPin);
    };

    /* Актуализация отображения пинов */
    var updatePins = function(ads){
        clearPins();
        pinListing(ads);
    };

    /* Функция перевода mainPin в стартовое состояние и удаление всех остальных пинов */
    var resetMainPin = function() {
        pinsTokio.innerHTML = '<div class="map__pinsoverlay"><h2>И снова Токио!</h2></div>';
        pinsTokio.appendChild(mainPin);
        mainPin.style.top = '60%';
        mainPin.style.left = '50%';
        mainPin.focus();
    };


    /* Обработчик клика на главную метку mianPin и ее перетаскивания */
    var mainPinMouseDownHandler = function (downEvt) {
        var address = document.querySelector('#address');
        downEvt.preventDefault();
        var startCoords = {
            x:downEvt.clientX,
            y:downEvt.clientY
        };
        
        var mainPinMouseMoveHandler = function (moveEvt) {
            /* Возможность перетаскивания метки ограничена следующими координатами?
            по y от 130 до 630
            по x шириной блока минус с обеих сторон 30px  для улучшения визуализации*/
            moveEvt.preventDefault();
            document.querySelector('.map').classList.remove('map--faded');
            var shift = {};
            var pinBorder = {
                xLeft:window.mainPin.parentElement.offsetLeft + 30,
                xRight:window.mainPin.parentElement.offsetLeft + window.mainPin.parentElement.offsetWidth - 30,
                yTop:130,
                yBottom:630
            };

            // Изменяем координаты пина по y, если в пределах границы разрешенного
            if (pinBorder.yTop <= window.mainPin.offsetTop && window.mainPin.offsetTop <= pinBorder.yBottom) {
                shift.y = startCoords.y - moveEvt.clientY;
                startCoords.y = moveEvt.clientY;
                window.mainPin.style.top = (window.mainPin.offsetTop - shift.y) + 'px';
            } 
            if (window.mainPin.offsetTop < pinBorder.yTop) {
                window.mainPin.style.top = pinBorder.yTop + 'px';
            } 
            if (window.mainPin.offsetTop > pinBorder.yBottom) {
                window.mainPin.style.top = pinBorder.yBottom + 'px';
            }

            if (pinBorder.xLeft <= window.mainPin.offsetLeft && window.mainPin.offsetLeft <= pinBorder.xRight) {
                shift.x = startCoords.x - moveEvt.clientX;
                startCoords.x = moveEvt.clientX;
                window.mainPin.style.left = (window.mainPin.offsetLeft - shift.x) + 'px';
            } 
            if (window.mainPin.offsetLeft < pinBorder.xLeft) {
                window.mainPin.style.left = pinBorder.xLeft + 'px'; 
            } 
            if  (window.mainPin.offsetLeft > pinBorder.xRight) {
                window.mainPin.style.left = pinBorder.xRight + 'px';
            }
            // Устанавливаем значение адреса нашего объявления по результатам перемещения главного пина
            address.value = mainPin.offsetLeft + ', ' + mainPin.offsetTop;
        };
        var mainPinMouseUpHandler = function (upEvt) {
            upEvt.preventDefault();

            // Если страница неактивна, активируем ее
            if (!window.mainPageActivated) {
                window.activatePage ();
            }

            // Закрываем ифноблок, если есть
            window.infoBlock.closeCurrentAdInfoBlock();
            // применяем все фильтры и отрисовываем пины
            window.filters.applyAllFilters();
            
            document.removeEventListener('mousemove', mainPinMouseMoveHandler);
            document.removeEventListener('mouseup', mainPinMouseUpHandler);
        };
    document.addEventListener('mousemove', mainPinMouseMoveHandler);
    document.addEventListener('mouseup', mainPinMouseUpHandler);

    };

    /* Удаляем класс активности у всех пинов */
    var removeActiveClassFromPins = function(){
        pinsTokio.querySelectorAll('.map__pin').forEach(function(item) {
            item.classList.remove('map__pin--active');
            
        });
    };

    var addActiveClassToPin = function(target) {
        removeActiveClassFromPins();
        target.classList.add('map__pin--active');
    };
    
    /* Добавляем слушатель на пины - при клике на пин выводим информационный блок, содержащий информацию об объекте недвижимости, на который указывает этот пин. */
    pinsTokio.addEventListener('click', function (evt) {
        var target = evt.target.closest('button');
        // Информационный блок показываем только для рядовых пинов. Для главного пина информационный блок не показываем.
        if (target && target!=window.mainPin) {
            window.infoBlock.showCurrentAdInfoBlock(target);
            addActiveClassToPin(target);
        }
    });    

    // Добавляем слушатель на главный пин mainPin. 
    // Активация страницы и работа с картой начинаются после перетаскивания главного пина mainPin
    mainPin.addEventListener('mousedown', mainPinMouseDownHandler);

    return {
        pinListing:pinListing,
        updatePins:updatePins,
        resetMainPin:resetMainPin,
        mainPin:mainPin,
        removeActiveClassFromPins:removeActiveClassFromPins

    };
    
})();