const {Map} = require("immutable");

const { 

    setEstadoProceso,
    pasoEjecutado,
    pasoErroneo,
    subprocesoEjecutado,
    ejecutandoPaso,
    ejecutandoSubproceso,
    ultimaAccion,
    setEstadoComando,
    ejecutandoComando,
    comandoEjecutado

} = require("./estado.js");

module.exports = {

    proceso: (estado = setEstadoProceso(), accion) => {

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
    },

    comando: (estado = setEstadoComando(), accion) => {

       switch(accion.type){

            case "SET_ESTADO_COMANDO":
                return setEstadoComando(estado);
            case "EJECUTANDO_COMANDO":
                return ejecutandoComando(estado, accion.cmd, accion.args);
            case "COMANDO_EJECUTADO":
                return comandoEjecutado(estado);

        }

        return estado;
    },

    ultimaAccion: (estado = Map(), accion) => {

        return estado.set("accion", accion.type);

    }

}
