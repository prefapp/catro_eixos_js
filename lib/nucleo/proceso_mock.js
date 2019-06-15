//un proceso mock mimetiza la interfaz de un proceso

const {Proceso} = require("../../index.js");

class ProcesoMock extends Proceso{

    constructor(tarea, mock){

        super(tarea);

        this.mock = mock;
    }

    __r(){

        return [
        
            "__ejecutarMock"

        ]

    }

    __ejecutarMock(){

       const r = this.mock(this.tarea.args, this);

       if(!this.__esObjeto(r)){

           throw `Se esperaba un objeto de vuelta de la funcion mock`
       }

       return r;
    }

    OK__ejecutarMock(r){

        Object.keys(r).forEach(k => this.resultado(k, r[k]))

    }

    KO__ejecutarMock(err){

        `[MOCK][${this.tarea.args.proceso}]: error ${err}`          

    }

    __esPromesa(obj) {
        return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
    }

    __esObjeto(obj){

        return Object.prototype.toString.call(obj).indexOf('Object') !== -1;

    }

}

module.exports = ProcesoMock;

