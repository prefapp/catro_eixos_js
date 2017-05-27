"use strict";

/*
 * Un depurador es un proxy que loguea determinadas
 * estructuras de forma adecuada
 */

const Proceso = require("../nucleo/proceso.js");

class Depurador{

    constructor(proceso){

        this.proceso = proceso;
    }

    obtenerProxy(){

        this.proceso.ejecutor.trazado.agregarObserver( (m) => {

            this.__logEjecucionMetodo(m);

        });

        return new Proxy(this.proceso, {

        });

    }

    __logEjecucionMetodo(metodo){

        console.log("Ejecutando", metodo);
    }

}

module.exports = Depurador;
