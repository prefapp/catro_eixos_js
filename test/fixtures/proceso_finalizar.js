"use strict";

const CatroEixos = require("../../index.js");

class ProcesoPaso extends CatroEixos.Proceso {

    DEPURAR(){
        return true;
    }

    __r(){

        return [

            "__pasoUno",
            "__pasoDos",
            "__pasoTres",
        ]
    }

    __pasoUno(){

        this.resultado("uno", true);

    }

    __pasoDos(){

        if(this.arg("en_uno"))
            return this.finalizar();

        this.resultado("dos", true);

    }

    __pasoTres(){

        this.resultado("tres", true);

    }

}

module.exports = ProcesoPaso;
