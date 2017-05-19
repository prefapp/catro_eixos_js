"use strict";

const CatroEixos = require("../../../index.js");

class Mayusculas extends CatroEixos.Proceso {

    __r(){

        return [

            "__aMayusculas",
        ]
    }

    __aMayusculas(){

        this.resultado("cadena", this.arg("cadena").toUpperCase());
    }
}

module.exports = Mayusculas;
