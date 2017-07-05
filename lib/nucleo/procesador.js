"use strict";

/*
 * Un procesador es un conjunto de procesos ordenados
 */

const LimitesProceso = require("./procesador/limites.js");

class Procesador{

    constructor(procesos = {}, opciones = {}){

        this.procesos = procesos;
        this.limites = this.__setLimites(opciones.limites);
    }

    ejecutar(tarea){

        return new Promise((cumplida, falla) => {
        
            let proceso = tarea.args.proceso;

            if(!proceso) return falla(this.__error(tarea, "TAREA_SIN_PROCESO_ASOCIADO"));

            let objetoProceso;

            try{
                objetoProceso = this.__instanciarProceso(proceso, tarea);
            }
            catch(err){
                return falla(this.__error(tarea, "INSTANCIACION_DE_PROCESO:" + err.message));
            }

            if(!objetoProceso) return falla(this.__error(tarea, "PROCESO_DESCONOCIDO: " + proceso));

            return this.__ejecutarProceso(

                proceso,

                objetoProceso, 
    
                cumplida, 

                falla

            );
        }); 

    }
    
    __ejecutarProceso(proceso,objetoProceso, cumplida, falla){

        this.limites.ejecutarProceso(

            proceso,

            function(enTerminar = function(){}){

                objetoProceso.ejecutar()

                    .then((tarea) => { 

                        enTerminar();

                        cumplida(tarea);

                    })

                    .catch((tarea) => { falla(tarea)})

            }
        )
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

    __setLimites(limites = {}){

        return new LimitesProceso(limites);
    }
}

module.exports = Procesador;

