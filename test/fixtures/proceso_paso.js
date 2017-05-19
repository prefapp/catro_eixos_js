"use strict";

const CatroEixos = require("../../index.js");

class ProcesoPaso extends CatroEixos.Proceso {

    __r(){

        return [

            "__sumaDos",
            "__restaUno",
            "__sumaTres",
            "__terminado"
        ]
    }

    __sumaDos(){

        return this.arg("cifra") + 2;
    }

    __restaUno(cifra){

        return cifra - 1;
    }

    __sumaTres(cifra){

        return new Promise((cumplida, falla) => { 

            cumplida(cifra + 3);
    
        })
    }

    __terminado(cifra){

        this.resultado("cifra_final", cifra);
    }

}

module.exports = ProcesoPaso;
