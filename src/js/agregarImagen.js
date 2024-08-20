import {Dropzone} from "dropzone";

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

Dropzone.options.imagenPropiedad = {
    dictDefaultMessage: 'Sube tus imagenes aquí',
    acceptedFiles: '.png,.jpg,.jpeg',
    maxFilesize: 5,
    maxFiles: 1,
    parallelUploads: 1,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: 'Eliminar Imagen',
    dictMaxFilesExceeded: 'Máximo 5 imagenes',
    headers: {
        'CSRF-Token': token
    },
    paramName: 'imagen',
    init: function(){ //Funciones que se ejecutan al inicio
        const dropzone = this;
        const btnPublicar = document.querySelector('#publicar');

        btnPublicar.addEventListener('click', function(){
            dropzone.processQueue();
        })

        dropzone.on('queuecomplete', function (file, mensaje){
            if(dropzone.getActiveFiles().length == 0){
                window.location.href = '/my-properties'
            }
        })
    }
}