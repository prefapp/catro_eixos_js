"use strict";

const CatroEixos = require("../../index.js");

class ProcesoValidacion extends CatroEixos.Proceso {

    DEPURAR() {return true}

    parametrosNecesarios(){
        return ["a", "b", "c"]
    }

    __validarAEsNumero(){
        return !isNaN(this.arg("a"));
    }
    
    KO__validarAEsNumero(){
        this.error("A_NO_ES_NUMERICO");
    }

    __validarBEsNumero(){

        return new Promise((cumplida, falla) => {
            
            if(!isNaN(this.arg("b")))   cumplida(true);

            else                        cumplida(false);
        })
    }

    KO__validarBEsNumero(){
        this.error("B_NO_ES_NUMERICO");
    }

    __validarC(){
        return this.arg("c") !== "FOO";
    }

    __v(){
        return [
            "__validarAEsNumero",
            "__validarBEsNumero",
            "__validarC"
        ]
    }   

    __r(){

        return [
            "__terminado"
        ]
    }

    __terminado(){
        this.resultado("hito", "terminado");
    }

}

module.exports = ProcesoValidacion;
