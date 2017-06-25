"use strict";

const {Proceso} = require("../../index.js");

// este proceso no puede cargar, tiene un fallo sintáctico
class ProcesoFallo extends Proceso{

    __r(){
        return ["__a"]
    }

    __a: {

    }

}

module.exports = ProcesoFallo;
