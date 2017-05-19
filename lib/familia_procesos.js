"use strict";

const CargarProcesos = require("./sistema/cargar_procesos.js");
const Tarea = require("./tarea.js");

class FamiliaProcesos {
    
    constructor(nombre, ruta, mascara = new RegExp(/\.js$/)){

        this.nombre = nombre;
        this.ruta = ruta;   
        this.mascara = mascara;
    }

    cargar(){

        return new Promise((cumplida, falla) => {

            new CargarProcesos(

                new Tarea(

                    null,

                    {
                        ruta: this.ruta,
                        mascara: this.mascara,
                        familia: this.nombre
                    }
                )

            ).ejecutar()

                .then((tarea) => {

                    cumplida(tarea.resultados.familia);

                }).catch((err) => {

                    falla(err);

                })
        });
    }
}

module.exports = FamiliaProcesos;
