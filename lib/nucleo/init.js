"use strict";

const Procesador = require("./procesador.js");
const Familia = require("./familia_procesos.js");

const initLogs = require("../log/init.js");

const initInfo = require("./procesador/info_init.js");

function init(familias, opciones = {}){

    let objetosFamilias = [];

    for(let nombreFamilia in familias){
        objetosFamilias.push(new Familia(nombreFamilia, familias[nombreFamilia]));
    }

 
    return __init(objetosFamilias, opciones)

        //inicializacion de logs
        .then((procesador) => {
        
            procesador.setAgenteLogs(

                initLogs(opciones.logs)

            );

            return procesador;
        })

        //inicializacion de info
        .then((procesador) => {

          return initInfo(procesador, opciones.info)

        })
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
