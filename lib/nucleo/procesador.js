"use strict";

/*
 * Un procesador es un conjunto de procesos ordenados
 */

const LimitesProceso = require("./procesador/limites.js");

const initEstado = require("../estado/init.js");

const AlijoGlobal = require("../nucleo/alijo_global.js");

const {Bloqueos} = require("../nucleo/bloqueos.js");

const Proceso = require("./proceso.js");

class Procesador{

    constructor(procesos = {}, opciones = {}){

        this.procesos = procesos;

        this.procesosMock = opciones.procesosMock || {};

        this.limites = this.__setLimites(opciones.limites);

        this.manejadorEstado = initEstado();
        this.agenteLogs = false;

        this.alijoGlobal = new AlijoGlobal();
		this.bloqueosGlobal = new Bloqueos();

		this.invocadorModulos = false;
      
        this.MOCKS = opciones.MOCKS || false;

        this._procesosEnEjecucion = {};
    }

    getRefStore(){
      return this.manejadorEstado.refStore;
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

	setInvocadorModulos(invocador){

		this.invocadorModulos = invocador;

	}

    ejecutar(tarea, opciones = {}){

        return new Promise((cumplida, falla) => {
        
            let proceso = tarea.args.proceso;

            tarea.sys["__manejador_estado__"] = this.manejadorEstado;
            tarea.sys["__agente_logs__"] = this.agenteLogs;
            tarea.sys["__alijo_global__"] = this.alijoGlobal;
			tarea.sys["__bloqueos__"] = this.bloqueosGlobal;
			tarea.sys["__invocador_modulos__"] = this.invocadorModulos;

            if(!tarea.sys["__subproceso__"])
                this.manejadorEstado.enviarAccion("INICIO_TAREA", {tarea});

            if(!proceso) return falla(this.__error(tarea, "TAREA_SIN_PROCESO_ASOCIADO"));

			if(opciones.cs){
				tarea.sys["__controlador_subprocesos__"] = opciones.cs;
			}

            let objetoProceso;

            try{
                objetoProceso = this.__instanciarProceso(proceso, tarea, opciones.parchear);

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

                        enTerminar();

                        delete this._procesosEnEjecucion[tarea.id];

                        delete tarea.sys;

                        falla(tarea)

                    })

            }
        )
    }

    __instanciarProceso(proceso, tarea, parchear = false){

        if(!this.procesos[proceso]){
             return false;
        }
        else{

            let objetoProceso;

            if(this.MOCKS || this.__hayQueBuscarMock(tarea)){

                objetoProceso = this.__instanciarProcesoMock(proceso, tarea);

                if(!objetoProceso){
                    objetoProceso = new this.procesos[proceso](tarea);
                }
            }
            else{
                objetoProceso = new this.procesos[proceso](tarea);
            }

            objetoProceso.refProcesador = this;

            if( ! objetoProceso instanceof Proceso)
                throw `Procesador: ${proceso} el módulo no es una instancia de Proceso: grave!`

			if(parchear){
				parchear(objetoProceso);
			} 
       
            return objetoProceso;
        }

    }

    __hayQueBuscarMock(tarea){

        return tarea.args['__MOCK__'];

    }

    __instanciarProcesoMock(proceso, tarea){

        if(!this.procesosMock[proceso]) return false;

        const ProcesoMock = require("../nucleo/proceso_mock.js");

        return new ProcesoMock(tarea, this.procesosMock[proceso]);
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

