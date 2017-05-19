"use strict";

class Tarea {

    constructor(id, args = {}, resultados = {}){

        this.id = id;
        this.args = args;
        this.resultados = resultados;
    }
}

module.exports = Tarea;
