'use strict';
window.picturePreloader = (function(){
    var FILE_TYPES = ['jpg', 'gif', 'jpeg', 'png', 'img'];
    var avaterChooser = document.querySelector('.notice__photo input[type=file]');
    var avatarPreview = document.querySelector('.notice__preview img');
    var photoChooser = document.querySelector('.form__photo-container input[type=file]');
    var photoPreview = document.querySelector('.form__photo-container img');

    avaterChooser.addEventListener('change', function(){
        var file = avaterChooser.files[0];
        var fileName = file.name.toLowerCase();

        var matches = FILE_TYPES.some(function(it){
            return fileName.endsWith(it);
        });

        if (matches){
            var reader = new FileReader();
            reader.addEventListener('load', function(){
                avatarPreview.src= reader.result;
            });
            reader.readAsDataURL(file);
        }
    });

})();