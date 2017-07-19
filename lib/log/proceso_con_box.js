const mixin = require("../utiles/mixin");

const Box = require("./box.js");

module.exports = mixin({

    iniciarBox: function(refDriver, id){

        id = id || this.tarea.id;

        this["__box__"] = new Box(

            id,

            refDriver

        );

        this["__box__"].iniciar();

        this.__agregarEvento(
    
            "FIN_PROCESADO",

            () => {
                this["__box__"].cerrar();
            }

        );
    },

    boxOK: function(mensaje){
        this["__box__"].ok(mensaje);
    },

    boxKO: function(mensaje){
        this["__box__"].ko(mensaje);
    }

})
