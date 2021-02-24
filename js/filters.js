/* Модуль фильтрации пинов */
// 
//Фильтрация осуществляется по фильтрам-свойствам. а также по NEAREST_ADS_LIMIT ближайшим объектам.
// Необходим подключать после файла pins.js из-за обращения 
// window.pins.updatePins(adsFiltered);

window.filters = (function () {
    var adsFiltered = [];
    var adsFullStaff = [];
    var NEAREST_ADS_LIMIT = 5;
    var filtersContainer = document.querySelector('.map__filters');
    var filterTypeDOMElement = filtersContainer.querySelector('#housing-type');
    var filterPriceDOMElement = filtersContainer.querySelector('#housing-price');
    var filterRoomsDOMElement = filtersContainer.querySelector('#housing-rooms');
    var filterGuestsDOMElement = filtersContainer.querySelector('#housing-guests');
    var filterFeaturesDOMElements = filtersContainer.querySelectorAll('.map__filter-set input');
    var filtersValues = {
        filterType: 'any',
        filterPrice: 'any',
        filterRooms: 'any',
        filterGuests: 'any',
        filterFeatures: {
            wifi: false,
            dishwasher: false,
            parking: false,
            washer: false,
            elevator: false,
            conditioner: false,
            numberOfFeatures: 0
        }
    };


    var filterType = function () {
        if (filtersValues.filterType != 'any') {
            adsFiltered = adsFiltered.filter(function (item) {
                if (item.offer.type == filtersValues.filterType) {
                    return true;
                } else {
                    return false;
                }
            });
        }
    };

    var filterPrice = function () {
        if (filtersValues.filterPrice != 'any') {
            switch (filtersValues.filterPrice) {
                case 'middle': {
                    adsFiltered = adsFiltered.filter(function (item) {
                        if (10000 <= item.offer.price && item.offer.price <= 50000) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                } break;
                case 'low': {
                    adsFiltered = adsFiltered.filter(function (item) {
                        if (item.offer.price < 10000) {
                            return true;
                        } else {
                            return false;
                        }
                    });

                } break;
                case 'high': {
                    adsFiltered = adsFiltered.filter(function (item) {
                        if (50000 < item.offer.price) {
                            return true;
                        } else {
                            return false;
                        }
                    });

                } break;
                default: {
                }
            }
        }
    };

    var filterRooms = function () {
        if (filtersValues.filterRooms != 'any') {
            adsFiltered = adsFiltered.filter(function (item) {
                if (item.offer.rooms == filtersValues.filterRooms) {
                    return true;
                } else {
                    return false;
                }
            });
        }
    };

    var filterGuests = function () {
        if (filtersValues.filterGuests != 'any') {
            adsFiltered = adsFiltered.filter(function (item) {
                if (item.offer.guests == filtersValues.filterGuests) {
                    return true;
                } else {
                    return false;
                }
            });
        }
    };

    // Функция передачи состояний checked группы чекбоксов в объект featuresFlags
    var checkFeaturesFlags = function () {
        var featuresFlags = {
            wifi: false,
            dishwasher: false,
            parking: false,
            washer: false,
            elevator: false,
            conditioner: false,
            numberOfFeatures: 0
        };
        filterFeaturesDOMElements.
            forEach(function (item) {
                if (item.checked == true) {
                    featuresFlags[item.value] = true;
                    featuresFlags.numberOfFeatures++;

                } else {
                    featuresFlags[item.value] = false;
                }
            });
        return featuresFlags;
    };

    var filterFeatures = function () {
        adsFiltered = adsFiltered.filter(function (item) {
            var count = 0;
            item.offer.features.forEach(function (feature) {
                if (filtersValues.filterFeatures[feature]) {
                    count++;
                }
            });
            return count === filtersValues.filterFeatures.numberOfFeatures;
        });
    };

    /* Функция определения расстояния между  MainPin и сравниваемым пином*/
    var getDistance = function (item) {
        var x1 = window.pins.mainPin.offsetLeft;
        var y1 = window.pins.mainPin.offsetTop;
        var x2 = item.location.x;
        var y2 = item.location.y;
        var a = Math.abs(x1 - x2);
        var b = Math.abs(y1 - y2);
        return Math.hypot(a * a + b * b);
    };


    /* Фильльтр по расстоянию от расположения MainPin. Оставляет только ближайшие объявления в количестве NEAREST_ADS_LIMIT */
    var filterDistance = function () {
        adsFiltered = adsFiltered.sort(function (left, right) {
            return getDistance(left) - getDistance(right);
        })
            .slice(0, NEAREST_ADS_LIMIT);

    };


    /* Функция передачи значений фильтров в пользовательском интерфейсе в объект filtersValues  */
    var checkFiltersValues = function () {
        filtersValues.filterType = filterTypeDOMElement.value;
        filtersValues.filterPrice = filterPriceDOMElement.value;
        filtersValues.filterRooms = filterRoomsDOMElement.value;
        filtersValues.filterGuests = filterGuestsDOMElement.value;
        filtersValues.filterFeatures = checkFeaturesFlags();
    };

    /* Функция применения всех фильтров с последующей отрисовкой пинов */
    var applyAllFilters = function () {
        adsFiltered = adsFullStaff.slice();
        checkFiltersValues();

        filterType();
        filterPrice();
        filterRooms();
        filterGuests();
        filterFeatures();
        // Дополнительно. Фильтрация дистанции последння как дополнительный фильтр, чтобы не более NEAREST_ADS_LIMIT показать
        filterDistance();

        window.pins.updatePins(adsFiltered);
        window.filters.adsFiltered = adsFiltered; 
    };

    var startFilters = function (data) {
        var lastTimeout;
        adsFullStaff = data.slice();
        adsFiltered = data.slice();
        filtersContainer.addEventListener('input', function () {
            // Устраняем дребезги от частой смены значений фильтров
            if (lastTimeout) {
                window.clearTimeout(lastTimeout);
            }
            lastTimeout = window.setTimeout(function(){
                window.infoBlock.closeCurrentAdInfoBlock();
                applyAllFilters();
            }, 500);
        });
    };
    return {
        startFilters: startFilters,
        applyAllFilters: applyAllFilters,
    };
})();