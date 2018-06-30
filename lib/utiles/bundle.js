const fs = require("fs");

const {SET_BUNDELER} = require("../sistema/cargar_procesos.js");

module.exports = function(init, salida = "./catro_eixos_bundle.js"){

    let procesos = {}

    SET_BUNDELER((nombre, ruta) => {

        let familia = nombre.replace(/\.\w+$/, "");

        if(!procesos[familia])
            procesos[familia] = {};

        procesos[familia][nombre.replace(/\w+\./, "")] = ruta;

    })

    return init().then((refProcesador) => {

        const codigo = serializadorModulo(procesos)

        return new Promise((cumplida, falla) => {

            fs.writeFile(salida, codigo, function(err){

                if(err) return falla(`Error en escritura de ${salida}: ${err}`);

                else    return cumplida();
            })

        })

    })

}

function serializadorModulo(procesos){

return `

module.exports = {

    ${

        Object.keys(procesos).map((f) => serializadorFamilia(f, procesos[f])).join(",\n")

    }


}


`

}

function serializadorFamilia(familia, procesos){

return `

    ${familia}: {

        ${

            Object.keys(procesos).map(p => serializadorProceso(p, procesos[p])).join(",\n\t")

        }

    }`


}

function serializadorProceso(nombre, ruta){

return `${nombre}: require("${ruta}")`

}
