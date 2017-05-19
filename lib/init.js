"use strict";

const Procesador = require("./procesador.js");

function init(familias){

    let cargadores = familias.map((familia) => {

        return new familia().cargar();

    });

    return new Promise((cumplida, falla) => {
    
        Promise.all(cargadores)

            .then((familias) => {

                let procesos = {};

                familias.forEach((familia) => {

                    Object.assign(procesos, familia);

                })

                cumplida(new Procesador(procesos))

            })
            .catch((err) => {

                falla(err);
            })

    });
}

module.exports = init;
