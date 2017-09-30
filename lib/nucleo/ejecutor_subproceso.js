const Tarea = require("./tarea.js");

module.exports = function(refProceso, nombre, args = {}, opciones){

    args.proceso = nombre;
 //   args.__subproceso__ = true;
 //   args.__depurar__ = this.__depurar__ || false;

    let tarea = new Tarea(

        refProceso.tarea.id + "@" + refProceso.nSubProcesos,

        args
    );

    tarea.sys.__subproceso__ = true;
    tarea.sys.__depurar__ = refProceso.tarea.sys.__depurar__;

    let id = refProceso.nSubProcesos++;

    enviarAccion(refProceso, "INICIO_SUB_PROCESO", {
        id: refProceso.tarea.id,
        subProcesoId: id.toString(),
        subProceso: nombre
    })

    refProceso.enSubProceso = tarea.id;

    return new Promise((cumplida, falla) => {

        let f = (tarea) => {

            refProceso.enSubProceso = false;

            enviarAccion(refProceso, "FIN_SUB_PROCESO", {
                id: tarea.id,
                subProcesoId: id.toString(),
                subProceso: nombre
            })
        }

        refProceso.refProcesador.ejecutar(tarea, opciones)

        .then((tarea) => {

            f(tarea);
            cumplida(tarea.resultados);

        })

        .catch((tarea) => {

            f(tarea);
            falla(tarea.resultados.error);

        })

    })
}

function enviarAccion(refProceso, accion, args){

    if(!refProceso.tarea.sys["__manejador_estado__"]) return;

    refProceso.tarea.sys["__manejador_estado__"].enviarAccion(
        accion,
        args
    )

}
