"use strict";

class TrazadoProceso {

    constructor(){

        this.metodos = [];

        this.fEnEjecucionDeMetodo = [];
    }

    agregarObserver(funcion){

        this.fEnEjecucionDeMetodo.push(funcion);
    }

    ejecutarMetodo(metodo){

        this.metodos.push(metodo);      

        this.fEnEjecucionDeMetodo.forEach((f) => {

            f(metodo);
        }) 
    }

}


module.exports = TrazadoProceso;
