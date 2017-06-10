/*
 * Un proceso guarda información de su propia ejecución en una store
 */

const { Map, List, is, fromJS } = require("immutable");

function setEstadoProceso(estado = Map()){

    return estado.merge(Map({

        pasosEjecutados : List(),

        subProcesos: List(),

        enPaso: false,

        enSubproceso: false,

        pasoError: false,

        ultimaAccion: false

    }));
}

function pasoEjecutado(estado, paso){

    return estado.update(

        "pasosEjecutados",

        (pe) => pe.push(paso)


    ).set("enPaso", false);
}


function subprocesoEjecutado(estado, subproceso){

    return estado.update(
    
        "subProcesos",

        (subProcesos) => {

            return subProcesos.push(subproceso);

        }

    ).set("enSubproceso", false)
}

function pasoErroneo(estado, paso){

    return estado
        
        .set("pasoError", paso)

        .set("enPaso", false);

}

function ejecutandoPaso(estado, paso){
    return estado.set("enPaso", paso);
}

function ejecutandoSubproceso(estado, subproceso){
    return estado.set("enSubproceso", subproceso)
}

function ultimaAccion(estado, nombre){
    return estado.set("ultimaAccion", nombre);
}

module.exports = {

        setEstadoProceso, 
        pasoEjecutado, 
        subprocesoEjecutado,
        pasoErroneo,
        ejecutandoPaso,
        ejecutandoSubproceso,
        ultimaAccion
};

