"use strict";

/*
 * Un procesador es un conjunto de procesos ordenados
 */

class Procesador{

    constructor(procesos = {}){

        this.procesos = procesos;
    }

    ejecutar(tarea){

        return new Promise((cumplida, falla) => {
        
            let proceso = tarea.args.proceso;

            if(!proceso) return falla("TAREA_SIN_PROCESO_ASOCIADO");
            
            let objetoProceso = this.__instanciarProceso(proceso, tarea);

            if(!objetoProceso) return falla(this.__error(tarea, "PROCESO_DESCONOCIDO: " + proceso));

            objetoProceso.ejecutar()

                .then((tarea) => {
                    cumplida(tarea);
                })
                .catch((tarea) => {

                    falla(tarea);
                })
        }); 

    }

    __instanciarProceso(proceso, tarea){

        if(!this.procesos[proceso]){
             return false;
        }
        else{

            let objetoProceso =  new this.procesos[proceso](tarea);
            objetoProceso.refProcesador = this;
        
            return objetoProceso;
        }

    }

    __error(tarea, error){

        tarea.resultados.estado = "KO";
        tarea.resultados.error = error;

        return tarea;
    }
}

module.exports = Procesador;

