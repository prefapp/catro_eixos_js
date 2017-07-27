const EP = require("./procesos.js");
const ET = require("./tareas.js");

const {Map} = require("immutable");

module.exports = {

    "procesos": function(estado = EP.estadoInicial(), accion){

        switch(accion.type){

            case "INICIO_PROCESO":

                return EP.ejecutarProceso(
                    estado, 
                    accion.id
                )

            case "FIN_PROCESO":
                return EP.procesoEjecutado(
                    estado,
                    accion.id
                )

            case "INICIO_SUB_PROCESO":
                return EP.ejecutandoSubproceso(
                    estado,
                    accion.id,
                    accion.subProcesoId
                )

            case "FIN_SUB_PROCESO":
                return EP.subprocesoEjecutado(
                    estado,
                    accion.id
                )

            case "EJECUTAR_PASO":
                return EP.ejecutandoPaso(
                    estado,
                    accion.id,
                    accion.paso
                )   

            case "PASO_EJECUTADO":
                return EP.pasoEjecutado(
                    estado,
                    accion.id,
                    accion.paso
                )

            case "PASO_ERRONEO":
                return EP.pasoErroneo(
                    estado,
                    accion.id,
                    accion.paso
                )

            default:
                return estado;
        }
    },

    "tareas": function(estado = ET.tareasInicial(), accion){

        switch(accion.type){

            case "INICIO_TAREA":
                return ET.nuevaTarea(
                    estado,
                    accion.tarea
                )

            case "FIN_TAREA":
                return ET.finTarea(
                    estado,
                    accion.tarea
                )
            default:
                return estado;
        }

    },

    "ultimaAccion": (estado = Map(), accion) => {
        return estado.set("accion", accion)
    }
}
