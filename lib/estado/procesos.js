const { Map, List, is, fromJS } = require("immutable");

module.exports = {

    "estadoInicial": function(estado = Map()){

        return estado.merge({

            procesosEjecutados: 0,

            procesos: Map()

        })

    },

    "ejecutarProceso": function(estado, id){

        return estado.set(

            "procesosEjecutados",

            estado.get("procesosEjecutados") + 1

        ).update(

            "procesos",

            (procesos) => procesos.set(id, crearEstadoProceso())

        )
    },

    "ejecutandoPaso": function(estado, id, paso){

        let selector = ["procesos"].concat(getProceso(id))

        return estado.updateIn(

            selector,

            (p) => {
                return p.set("enPaso", paso)
            }

        )

    },

    "pasoErroneo": function(estado, id, paso){

        
        let selector = ["procesos"].concat(getProceso(id));

        return estado.updateIn(

                selector.concat("pasoErroneo"),

                (pasoErroneo) => {
                    return paso;
                }

            ).updateIn(
            
                selector.concat("enPaso"),

                (enPaso) => false
            )

    },

    "pasoEjecutado": function(estado, id, paso){

        let selector = ["procesos"].concat(getProceso(id));

        return estado.updateIn(

            selector.concat("pasosEjecutados"),

            (pe) => {
                return pe.push(paso);
            }

        ).updateIn(

            selector.concat("enPaso"),

            (enPaso) => false

        )

    },
   
    "ejecutandoSubproceso": function(estado, id, subprocesoId){

        let selector = ["procesos"].concat(getProceso(id))

        return estado.updateIn(

            selector,

            (p) => {

                return agregarSubproceso(p, subprocesoId)

            }

        ).set(
    
            "procesosEjecutados",

            estado.get("procesosEjecutados") + 1

        ).setIn(

            selector.concat("enSubproceso"),

            true
        )

    },

    "procesoEjecutado": function(estado, id){

        return estado.deleteIn(
            ["procesos", id]
        )

    },

    "subprocesoEjecutado": function(estado, id){

        let selector = ["procesos"].concat(getProceso(id));
        let selectorPadre = ["procesos"].concat(getProcesoPadre(id));
        return estado.deleteIn(selector).setIn(

            selectorPadre.concat("enSubproceso"),

            false

        );
        
    }

}

function getProcesoPadre(id){

    if(!id.match(/\@/)) return getProceso(id);

    else return getProceso(id.match(/(.+)(\@\d+$)/)[1])

}

function getProceso(id, selector = []){

    if(id.match(/\@\d+$/)){
        
        let p = id.split(/\@(.+)$/, 2);

        return  getProceso(

            p[1],

            selector.concat(p[0]).concat("subProcesos")
        )
    }
    else{
        return selector.concat(id)
    }
}

function agregarSubproceso(estado, subprocesoId){

    return estado.update(

        "subProcesos",

        (subProcesos) => {

            return subProcesos.set(

                subprocesoId, 

                crearEstadoProceso()

            )
        }
    )
}

function crearEstadoProceso(){

    return Map({

        pasosEjecutados: List(),

        subProcesos: Map(),

        enPaso: false,

        enSubproceso: false,

        pasoError: false 
    })
}
