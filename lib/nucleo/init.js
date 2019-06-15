"use strict";

const Procesador = require("./procesador.js");
const Familia = require("./familia_procesos.js");

const initLogs = require("../log/init.js");

const initInfo = require("./procesador/info_init.js");

const initModulos = require("./procesador/modulos_init.js");

function init(familias, opciones = {}){

    let objetosFamilias = [];
    let objetosFamiliasMock = [];

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

		//inicializacion de modulos
		.then((procesador) => {

			return initModulos(procesador, opciones.modulos);

		})
}

function __init(familias, opciones){

    let cargadores = familias.map((familia) => {

        return familia.cargar(opciones.EN_BUNDLE);

    });

    return new Promise((cumplida, falla) => {
    
        Promise.all(cargadores)

            .then((familias) => {

                let procesos = {};
                let procesosMock = {};

                familias.forEach(({familia, familiaMock}) => {

                    Object.assign(procesos, familia);
                    Object.assign(procesosMock, familiaMock)

                })

                opciones.procesosMock = procesosMock;

                cumplida(new Procesador(procesos, opciones))

            })
            .catch((err) => {

                falla(err);
            })

    });
}


module.exports = init;
