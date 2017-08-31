const {createStore, combineReducers} = require("redux");
const {procesos, tareas, ultimaAccion}= require("./reducers.js");
const acciones = require("./acciones.js");

module.exports = function(){

    const r = combineReducers({procesos, tareas, ultimaAccion});

    const s = createStore(r);

    return new ManejadorEstado(s);
}

class ManejadorEstado{

    constructor(refStore){
        this.refStore = refStore;
    }

    enviarAccion(accion, args){
        try{
            this.refStore.dispatch(
                acciones(accion, args)
            );
        }
        catch(err){
            console.log(err);
            console.log(this.refStore.getState());
            throw new Error(`[ERROR_ESTADO][${err}]`);
        }
    }

    getEstadoProceso(id){

      return this.refStore.getState()["procesos"].getIn(["procesos", id])

    }
}

