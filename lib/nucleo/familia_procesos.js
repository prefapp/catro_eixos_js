"use strict";

const Tarea = require("./tarea.js");

class FamiliaProcesos {
    
    constructor(nombre, ruta, mascara = new RegExp(/\.js$/)){

        this.nombre = nombre;
        this.ruta = ruta;   
        this.mascara = mascara;
    }

    cargar(enBundle = false){

        let CargarProcesos;

        if(enBundle){

            CargarProcesos = require("../sistema/cargar_procesos_bundle.js");

        }
        else{

            CargarProcesos = require("../sistema/cargar_procesos.js").CargarProcesos;
        }

        return new Promise((cumplida, falla) => {

            new CargarProcesos(

                new Tarea(

                    null,

                    {
                        ruta: this.ruta,
                        mascara: this.mascara,
                        familia: this.nombre,
                        bundle: enBundle
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
