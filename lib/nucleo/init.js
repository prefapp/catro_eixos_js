"use strict";

const Procesador = require("./procesador.js");
const Familia = require("./familia_procesos.js");

function init(familias, opciones = {}){

    let objetosFamilias = [];

    for(let nombreFamilia in familias){
        objetosFamilias.push(new Familia(nombreFamilia, familias[nombreFamilia]));
    }

 
    return __init(objetosFamilias, opciones)

        //.then()
}

function __init(familias, opciones){

    let cargadores = familias.map((familia) => {

        return familia.cargar();

    });

    return new Promise((cumplida, falla) => {
    
        Promise.all(cargadores)

            .then((familias) => {

                let procesos = {};

                familias.forEach((familia) => {

                    Object.assign(procesos, familia);

                })

                cumplida(new Procesador(procesos, opciones))

            })
            .catch((err) => {

                falla(err);
            })

    });
}


module.exports = init;
