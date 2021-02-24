window.backend = (function() {

    var load =  function(onLoad, onError){
        var URL = 'https://javascript.pages.academy/keksobooking/data';
        var xhr = new XMLHttpRequest();

        xhr.responseType = 'json';
        
        xhr.addEventListener('load', function() {
            if (xhr.status === 200) {
                onLoad (xhr.response);
            } else {
                onError (`Ошибка загрузки данных с сервера. Статус ответа: ${xhr.status}` +
                        "\nБудут использованы виртуальные данные.");
            }
        });

        xhr.addEventListener('error', function () {
            onError('Ошибка соединения');
        });
        
        xhr.addEventListener('timeout', function () {
            onError('Таймаут соединения');
        });
        

        xhr.open('GET', URL);
        xhr.send();
    };
    var save =  function(data, onLoad, onError){
        var URL = 'https://javascript.pages.academy/keksobooking';
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'json';

        xhr.addEventListener('load', function(){
            onLoad('Данные отправлены успешно');
        });

        xhr.addEventListener('error', function(){
            onError('Ошибка загрузки');
        });
        xhr.addEventListener('timeout', function(){
            onLoad('Таймаут загрузки');
        });

        xhr.open('POST', URL);
        xhr.send(data);
        console.dir(xhr);
    };

    return {
        load: load,
        save: save,
        
    };
})();