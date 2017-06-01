"use strict";

const Proceso = require("../nucleo/proceso.js");

const fs = require("fs");

class CargarProcesos extends Proceso{

    __r(){
        return [
            "__leerFicherosProcesos",
            "__filtrarProcesos",
            "__cargarModulosProcesos",
            "__devolverFamiliaProcesos"
        ]
    } 

    __leerFicherosProcesos(){

        return new Promise((cumplida, falla) => {

            fs.readdir(this.arg("ruta"), (err, ficheros) => {

                if(err) falla(err);
                else    cumplida(ficheros);
            });

        })
    }

    OK__leerFicherosProcesos(ficheros){
        
        this.ficherosProcesos = ficheros;
    }  

    __filtrarProcesos(){

        if(!this.arg("mascara")) return;

        this.ficherosProcesos = this.ficherosProcesos.filter((f) =>{
            return this.arg("mascara").test(f)

        })
    }

    __cargarModulosProcesos(){

        this.procesos = {};

        this.ficherosProcesos.forEach((f) => {

            let nombreProceso = f.replace(/\.js$/, "");
            let rutaProceso = this.arg("ruta") + "/" + f;

            this.procesos[

                this.arg("familia") + "." + nombreProceso

            ] = require(rutaProceso);            
        });
    }

    __devolverFamiliaProcesos(){
    
        this.resultado("familia",  this.procesos);
    }
}

module.exports = CargarProcesos;
