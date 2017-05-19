"use strict";

const CatroEixos = require("../../../index.js");

class Minusculas extends CatroEixos.Proceso {

    __r(){

        return [

            "__aMinusculas",
        ]
    }

    __aMinusculas(){

        this.resultado("cadena", this.arg("cadena").toLowerCase());
    }
}

module.exports = Minusculas;
