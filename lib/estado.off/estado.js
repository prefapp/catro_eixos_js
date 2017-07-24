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

function setEstadoComando(estado = Map()){

    return estado.merge({

        comando: "",

        args: ""

    });
}

function ejecutandoComando(estado, cmd, args){

    return estado

        .set("comando",cmd)

        .set("args", args)
}

function comandoEjecutado(estado){

    return setEstadoComando(estado);    

}

function ejecutandoPaso(estado, paso){
    return estado.set("enPaso", paso);
}

function ejecutandoSubproceso(estado, subproceso){
    return estado.set("enSubproceso", subproceso)
}

module.exports = {

        setEstadoProceso, 
        pasoEjecutado, 
        subprocesoEjecutado,
        pasoErroneo,
        ejecutandoPaso,
        ejecutandoSubproceso,
        setEstadoComando,
        ejecutandoComando,
        comandoEjecutado
};

