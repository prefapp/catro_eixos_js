"use strict";

const CatroEixos = require("../../../index.js");

class Mayusculas extends CatroEixos.Proceso {

    __r(){

        return [

            "__aMayusculas",
        ]
    }

    __aMayusculas(){

        this.__log("Pasando cadena a mayúsculas");

        this.resultado("cadena", this.arg("cadena").toUpperCase());
    }

    LOG__aMayusculas(){
        return `Cadena resultante ${this.tarea.resultados.cadena}`
    }
}

module.exports = Mayusculas;
