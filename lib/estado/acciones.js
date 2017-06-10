/*
 * acciones de ejecucion de un proceso
 */

module.exports = {

    "SET_ESTADO": () => {
        return { type: "SET_ESTADO" };
    },

    "PASO_EJECUTADO": (paso) =>{
        return { type: "PASO_EJECUTADO", paso: paso}
    },

    "SUBPROCESO_EJECUTADO": (subproceso) => {
        return { type: "SUBPROCESO_EJECUTADO", subproceso: subproceso}
    },

    "EJECUTANDO_PASO": (paso) => {

        return {type: "EJECUTANDO_PASO", paso: paso}
    },

    "EJECUTANDO_SUBPROCESO": (subproceso) => {

        return {type: "EJECUTANDO_SUBPROCESO", subproceso: subproceso}
    },

    "PASO_ERRONEO": (paso) => {
    
        return {type: "PASO_ERRONEO", paso: paso}
    }
};
