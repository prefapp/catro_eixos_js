"use strict";

/*
 * Un procesador es un conjunto de procesos ordenados
 */

const LimitesProceso = require("./procesador/limites.js");

const initEstado = require("../estado/init.js");

class Procesador{

    constructor(procesos = {}, opciones = {}){

        this.procesos = procesos;
        this.limites = this.__setLimites(opciones.limites);

        this.manejadorEstado = initEstado();
        this.agenteLogs = false;
      
        this._procesosEnEjecucion = {};
    }

    getProcesoEnEjecucion(id){

      return this._procesosEnEjecucion[id];
    }

    setAgenteLogs(agente){

        this.agenteLogs = agente;

        this.agenteLogs.instalar(
            this.manejadorEstado.refStore
        );

    }

    ejecutar(tarea, opciones = {}){

        return new Promise((cumplida, falla) => {
        
            let proceso = tarea.args.proceso;

            tarea.sys["__manejador_estado__"] = this.manejadorEstado;
            tarea.sys["__agente_logs__"] = this.agenteLogs;

            if(!tarea.sys["__subproceso__"])
                this.manejadorEstado.enviarAccion("INICIO_TAREA", {tarea});

            if(!proceso) return falla(this.__error(tarea, "TAREA_SIN_PROCESO_ASOCIADO"));

            let objetoProceso;

            try{
                objetoProceso = this.__instanciarProceso(proceso, tarea);

                objetoProceso = this.__agregarEventos(objetoProceso, opciones.eventos);

            }
            catch(err){
                return falla(this.__error(tarea, "INSTANCIACION_DE_PROCESO:" + err));
            }

            if(!objetoProceso) return falla(this.__error(tarea, "PROCESO_DESCONOCIDO: " + proceso));

            return this.__ejecutarProceso(

                proceso,

                objetoProceso, 
    
                cumplida, 

                falla,

                tarea.sys["__subproceso__"]

            );
        }); 

    }

    __agregarEventos(objetoProceso, eventos = false){

        if(!objetoProceso || !eventos) return objetoProceso;

        Object.keys(eventos).forEach(e => {
            objetoProceso.__agregarEvento(e, eventos[e]);
        })

        return objetoProceso;
    }    

    __ejecutarProceso(proceso,objetoProceso, cumplida, falla, esSubProceso = false){

        this._procesosEnEjecucion[objetoProceso.tarea.id] = objetoProceso;

        this.limites.ejecutarProceso(

            proceso,

            (enTerminar = function(){}) => {

                objetoProceso.ejecutar()

                    .then((tarea) => { 

                        enTerminar();

                        if(!esSubProceso)
                            this.manejadorEstado.enviarAccion("FIN_TAREA", {tarea});

                        delete this._procesosEnEjecucion[tarea.id];

                        delete tarea.sys;

                        cumplida(tarea);

                    })

                    .catch((tarea) => { 

                        this.manejadorEstado.enviarAccion("FIN_TAREA", {tarea});

                        delete tarea.sys;

                        falla(tarea)

                    })

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

        delete tarea.sys;

        this.manejadorEstado.enviarAccion("FIN_TAREA", {tarea});

        return tarea;
    }

    __setLimites(limites = {}){

        return new LimitesProceso(limites);
    }
}

module.exports = Procesador;

