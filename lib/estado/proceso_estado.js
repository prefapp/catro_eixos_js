const { proceso } = require("./reducer.js");

const { combineReducers, createStore } = require("redux");

const reducerProceso = combineReducers({proceso});

const AC = require("./acciones.js");

class ProcesoEstado {

    constructor(){

        this.estado = createStore(reducerProceso);

    }

    accion(a){

        this.estado.dispatch(a);
    }

    ejecucionSubproceso(subproceso){

        this.estado.dispatch(AC.EJECUTANDO_SUBPROCESO(subproceso));
    }

    ejecutadoSubproceso(subproceso_estado){

        this.estado.dispatch(AC.SUBPROCESO_EJECUTADO(subproceso_estado));
    }

    getTrazadoProceso(){

        return this.estado.getState().proceso;

    }

    agregarObserver(f){

        this.estado.subscribe(() => {

            f(this.getTrazadoProceso());
    
        });
    }

}

module.exports = ProcesoEstado;
