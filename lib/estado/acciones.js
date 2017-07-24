module.exports = function(accion, args){

    if(!ACCIONES[accion])
        throw `[CATRO_EIXOS_JS][ESTADO][ACCION_INEXISTENTE: ${accion}]`

    let a = args; 

    a.type = accion;

    return a;

}

const ACCIONES = {
    "INICIO_TAREA" : 1,
    "FIN_TAREA": 1,
    "INICIO_PROCESO": 1,
    "FIN_PROCESO": 1,
    "INICIO_SUB_PROCESO": 1,
    "FIN_SUB_PROCESO": 1,
    "EJECUTAR_PASO": 1,
    "PASO_EJECUTADO": 1, 
    "PASO_ERRONEO": 1,
    "FASE_PASO": 1
}

