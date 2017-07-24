const { Map, List, is, fromJS } = require("immutable");

module.exports = {

    "tareasInicial": function(estado = Map()){

        return estado.merge({

            tareasPendientes: Map(),

        });

    },

    "nuevaTarea": function(estado, tarea){

        return estado.updateIn(

            ["tareasPendientes"],

            (tareasPendientes) => {

                return tareasPendientes.set(

                    tarea.id,

                    crearObjetoTarea(tarea)

                )
            }

        )
    },

    "finTarea": function(estado, tarea){

        return estado.deleteIn(

            ["tareasPendientes", tarea.id],

        );

    }
}

function crearObjetoTarea(tarea){

    return Map({

        proceso: tarea.proceso,

        args: fromJS(tarea.args),
    
        resultados: fromJS(tarea.resultados)

    })

}
