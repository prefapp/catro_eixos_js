const { 

    setEstadoProceso,
    pasoEjecutado,
    pasoErroneo,
    subprocesoEjecutado,
    ejecutandoPaso,
    ejecutandoSubproceso,
    ultimaAccion

} = require("./estado.js");

module.exports = {

    proceso: (estado = setEstadoProceso(), accion) => {

        estado = ultimaAccion(estado, accion.type);

        switch(accion.type){

            case "SET_ESTADO":
                return setEstadoProceso(estado);
            case "EJECUTANDO_PASO": 
                return ejecutandoPaso(estado, accion.paso);
            case "EJECUTANDO_SUBPROCESO":
                return ejecutandoSubproceso(estado, accion.subproceso);
            case "PASO_EJECUTADO":
                return pasoEjecutado(estado, accion.paso);
            case "SUBPROCESO_EJECUTADO":
                return subprocesoEjecutado(estado, accion.subproceso);
            case "PASO_ERRONEO":
                return pasoErroneo(estado, accion.paso);

        }

        return estado;
    }

}
