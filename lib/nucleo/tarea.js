"use strict";

let nTareaAnonima = 0;

class Tarea {

    constructor(id, args = {}, resultados = {}){

        this.id = id || "SIN_ID_" + nTareaAnonima++;
        this.args = args;
        this.sys = {};
        this.resultados = resultados;
    }
    
}

module.exports = Tarea;
