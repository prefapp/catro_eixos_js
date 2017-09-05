"use strict";

const CatroEixos = require("../../../index.js");

module.exports = class extends CatroEixos.Proceso {

//    DEPURAR() {return true}

    parametrosNecesarios(){
        return ["cadena"]
    }

    __r(){

        return [
            "__cadenaAMinusculas",
            "__inicialAMayusculas",
            "__apuntarResultados"
        ]
    }

    __cadenaAMinusculas(){

        if(this.arg("cadena") == "FALLA") throw "FALLO"

        return this.arg("cadena").toLowerCase()
    }

    __inicialAMayusculas(cadena){

        return cadena.substr(0,1).toUpperCase() 
                + cadena.substr(1)

    }

    __apuntarResultados(cadena){
        this.resultado("salida", cadena);
    }

}

