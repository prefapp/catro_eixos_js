const Logger = require("./logger.js");

const DepuradorProceso = require("../utiles/depurador_proceso.js");

const CargadorNivelesLog = require("./niveles.js");

module.exports = function(logs = {}){

    //se parte de las fases a loguear
    return new AgenteLogs(logs.nivel || false, logs);

}

class AgenteLogs{

    constructor(nivel, opciones){

        this.fSinLogs = (nivel) ? false : true; 

        if(!this.fSinLogs){

            this.logger = new Logger(nivel, opciones);

            this.__instalarManejadores(nivel, this.logger);
        }
    }

    instalar(store){

        this.store = store;

        if(this.fSinLogs) return;

        this.manejador.instalar(store);
        
    }

    custom(refProceso, mensaje){

        if(this.fSinLogs) return;

        let nivel = "info";

        if(typeof(mensaje) === "string" && mensaje.match(/\@(\w+)/)
        ){
            nivel = mensaje.match(/\@(\w+)/)[1];

            mensaje = mensaje.replace(/\@(\w+)/, "");
        }

        this.logger.log({
    
            motivo: "LOG",
            id: refProceso.tarea.id,
            divisa: refProceso.tarea.args.proceso,
            meta: mensaje

        }, nivel);
    }

    depurar(idProceso){

        new DepuradorProceso(
            idProceso
        ).instalar(this.store);

    }

    __instalarManejadores(nivel, logger){

        this.manejador = new ManejadorLogs(nivel, logger);

    }
}

class ManejadorLogs{

    constructor(nivel, logger, filtros = false){

        this.eventos = this.__instalarEventos(nivel);

        this.logger = logger;

        this.filtros = filtros;

    }

    instalar(store){

        store.subscribe(() => {
            this.__procesarAccion(store.getState());
        })

    }

    __procesarAccion(refStore){

        let accion = refStore["ultimaAccion"].get("accion");

        this.eventos.forEach((e) => {

            this[e](accion.type, accion, refStore)
        })
    }


    __instalarEventos(fases){

        return this.__seleccionarManejadoresEventos(fases)

            .map((m) => "e__" + m)

    }

    e__INICIO_TAREA(tipo, accion, refStore){

        if(tipo !== "INICIO_TAREA") return;
        
        if(!this.filtrar(accion.tarea.id)) return;

        this.logger.log({
        
            motivo: "INICIO_TAREA", 

            id: accion.tarea.id,            

            divisa: accion.tarea.args.proceso,

            meta: accion.tarea.args

        }, "info");   

    }

    e__FIN_TAREA(tipo, accion, refStore){
    
        if(tipo !== "FIN_TAREA") return;

        if(!this.filtrar(accion.tarea.id)) return;

        this.logger.log({

            motivo: "FIN_TAREA",
            id: accion.tarea.id,
            divisa: accion.tarea.args.proceso,
            meta: accion.tarea.resultados

        }, "info")
    }

    e__EJECUTAR_PASO(tipo, accion, refStore){

        if(tipo != "EJECUTAR_PASO") return;

        if(!this.filtrar(accion.id)) return;

        this.logger.log({

            motivo: "RUN_PASO",
            id: accion.id,
            divisa: `${accion.proceso} -> ${accion.paso}`,
            meta: {}
        }, "debug");

    }

    e__PASO_EJECUTADO(tipo, accion, refStore){

        if(tipo != "PASO_EJECUTADO") return;

        if(!this.filtrar(accion.id)) return;

        this.logger.log({
            motivo: "PASO_EJECUTADO",
            id: accion.id,
            divisa: `${accion.proceso} <- ${accion.paso}`,
            meta: {}

        }, "debug");
    }

    e__INICIO_PROCESO_PPAL(tipo, accion, refStore){

        if(tipo !== "INICIO_PROCESO") return;
        
        if(!this.filtrar(accion.id)) return;

        this.logger.log({
        
            motivo: "INICIO_PROCESO", 

            id: accion.id,            

            divisa: accion.proceso,

            meta: {}

        }, "info");   
    }

    e__ERRORES(tipo, accion, refStore){

        if(tipo !== "PASO_ERRONEO") return;
        
        if(!this.filtrar(accion.id)) return;

        this.logger.log({

            motivo: "ERROR",

            id: accion.id,

            divisa: `${accion.proceso} -> ${accion.paso}`,

            meta: accion.error

        }, "error");
    }

    e__INICIO_SUBPROCESO(tipo, accion, refStore){

        if(tipo !== "INICIO_SUB_PROCESO") return;

        if(!this.filtrar(accion.id)) return;

        this.logger.log({
        
            motivo: "INICIO_SUB_PROCESO",

            id: `${accion.id}@${accion.subProcesoId}`,

            divisa: accion.proceso
            
        }, "info");
    }

    e__FIN_SUBPROCESO(tipo, accion, refStore){

        if(tipo !== "FIN_SUBPROCESO") return;

        if(!this.filtrar(accion.id)) return;

        this.logger.log({

            motivo: "FIN_SUB_PROCESO",

            id: `${accion.id}@{accion.subProcesoId}`,

            divisa: accion.proceso

        }, "info")
    }

    e__FIN_PROCESO_PPAL(tipo, accion, refStore){

        if(tipo !== "FIN_PROCESO") return;

        if(!this.filtrar(accion.id)) return;

        this.logger.log({

            motivo: "FIN_PROCESO",
            id: accion.id,
            divisa: accion.proceso,

        }, "info")
    }

    filtrar(id){
        if(!this.filtros) return true;

        return this.filtros(id);
    }

    __seleccionarManejadoresEventos(nivel){

        return CargadorNivelesLog(nivel);

    }


}




