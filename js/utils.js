window.utils = (function(){
    var Code = {
        ESC_KEYCODE:27,
    };

    /* Функция показа информационного окна */
    var showInfoWindow = function (message) {
        var infoWindow = document.querySelector('.popup-info');
        var infoWindowButtonOK = document.querySelector('.popup-info button');
        var messageContainer = document.querySelector('.popup-info h2');
        
        /* Функция закрытия окна*/
        var closeInfoWindow = function () {
            infoWindow.hidden = true;
            infoWindowButtonOK.disabled = true;
            infoWindowButtonOK.removeEventListener('click',  closeInfoButtonClickHandler);
            document.removeEventListener('keydown', pressEscHandler);
        };
        
        /* Слушатель кнопки закрытия информационного окна */
        var closeInfoButtonClickHandler = function () {
            closeInfoWindow ();
            window.deactivatePage ();
        };

        var pressEscHandler = function(evt) {
            if (evt.keyCode === Code.ESC_KEYCODE) {
                closeInfoWindow ();
                window.deactivatePage ();
            }
        };
        
        infoWindow.hidden = false;
        infoWindowButtonOK.disabled = false;
        messageContainer.textContent = message;
        infoWindowButtonOK.focus();
        infoWindowButtonOK.addEventListener('click',  closeInfoButtonClickHandler);
        document.addEventListener('keydown', pressEscHandler);

    };        


    return {
        showInfoWindow:showInfoWindow,
        Code:Code
    };


})();