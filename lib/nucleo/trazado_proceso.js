"use strict";

class TrazadoProceso {

    constructor(){

        this.metodos = [];

    }

    ejecutarMetodo(metodo){
        this.metodos.push(metodo);        
    }

}


module.exports = TrazadoProceso;
