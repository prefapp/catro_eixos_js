const Logger = require("./logger.js");

const DepuradorProceso = require("../utiles/depurador_proceso.js");

module.exports = function(logs = {}){

    //se parte de las fases a loguear
    let fases = logs.loguear;

    return new AgenteLogs(fases || false, logs);

}

class AgenteLogs{

    constructor(fases, opciones){

        this.fSinLogs = (fases) ? false : true; 

        if(!this.fSinLogs){

            this.logger = new Logger(opciones);

            this.__instalarManejadores(fases, this.logger);
        }
    }

    instalar(store){

        this.store = store;

        if(this.fSinLogs) return;

        this.manejador.instalar(store);
        
    }

    custom(refProceso, mensaje){

        if(this.fSinLogs) return;
     
        this.logger.log({
    
            motivo: "LOG",
            id: refProceso.tarea.id,
            divisa: refProceso.tarea.args.proceso,
            meta: mensaje

        });
    }

    depurar(idProceso){

        new DepuradorProceso(
            idProceso
        ).instalar(this.store);

    }

    __instalarManejadores(fases, logger){

        this.manejador = new ManejadorLogs(fases, logger);

    }
}

class ManejadorLogs{

    static FASES(){

        return [

                "INICIO_PROCESO_PPAL",
                "FIN_PROCESO_PPAL",
                
                "INICIO_SUBPROCESO",
                "FIN_SUBPROCESO",

                "ERRORES",
        ]
    }

    constructor(fases, logger, filtros = false){

        this.eventos = this.__instalarEventos(fases);

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

    e__INICIO_PROCESO_PPAL(tipo, accion, refStore){

        if(tipo !== "INICIO_TAREA") return;
        
        if(!this.filtrar(accion.tarea.id)) return;

        this.logger.log({
        
            motivo: "INICIO_TAREA", 

            id: accion.tarea.id,            

            divisa: accion.tarea.args.proceso,

            meta: accion.tarea.args

        });   
    }

    e__ERRORES(tipo, accion, refStore){

        if(tipo !== "PASO_ERRONEO") return;
        
        if(!this.filtrar(accion.id)) return;

        this.logger.log({

            motivo: "ERROR",

            id: accion.id,

            divisa: `${accion.proceso} -> ${accion.paso}`,

            meta: accion.error

        });
    }

    e__INICIO_SUBPROCESO(tipo, accion, refStore){

        if(tipo !== "INICIO_SUB_PROCESO") return;

        if(!this.filtrar(accion.id)) return;

        this.logger.log({
        
            motivo: "INICIO_SUB_PROCESO",

            id: accion.id,

            divisa: accion.subProceso,
            
        });
    }

    e__FIN_SUBPROCESO(tipo, accion, refStore){

        if(tipo !== "FIN_SUBPROCESO") return;

        if(!this.filtrar(accion.id)) return;
    }

    e__FIN_PROCESO_PPAL(tipo, accion, refStore){

        if(tipo !== "FIN_TAREA") return;

        if(!this.filtrar(accion.tarea.id)) return;

        this.logger.log({

            motivo: "FIN_TAREA",
            id: accion.tarea.id,
            divisa: accion.tarea.args.proceso,
            meta: accion.tarea.resultados

        })
    }

    filtrar(id){
        if(!this.filtros) return true;

        return this.filtros(id);
    }

    __seleccionarManejadoresEventos(fases){

        const ff = ManejadorLogs.FASES();

        if(fases.includes("TODO")) return ff;

        return ff.filter((fase) => fases.includes(fase))
    }


}




