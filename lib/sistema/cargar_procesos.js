"use strict";

const Proceso = require("../nucleo/proceso.js");

const fs = require("fs");

const {inspect} = require("util");

let BUNDELER = () => {}

const REG_MOCK = new RegExp(/\.mock\.js$/);

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
        this.procesosMock = {};

        this.ficherosProcesos.forEach((f) => {

            let nombreProceso = f.replace(/\.js$/, "");
            let rutaProceso = this.arg("ruta") + "/" + f;

            let modulo;

            try{
                delete require.cache[rutaProceso];
                modulo = require(rutaProceso);
            }
            catch(e){

                let err = inspect(e);

                throw `CARGA_MODULO ${rutaProceso}: ${err}`;
            }

            if(REG_MOCK.test(f)){

                this.procesosMock[
                
                    this.arg("familia") + "." + nombreProceso.replace(/\.mock/, "")
                
                ] = modulo;

            }
            else{

                this.procesos[

                    this.arg("familia") + "." + nombreProceso

                ] = modulo;            

                BUNDELER(this.arg("familia") + "." + nombreProceso, rutaProceso)
            }

        });
    }

    KO__cargarModulosProcesos(err){
        this.error(`CARGA_ERROR: ${this.arg("familia")}: ${err}`);
    }

    __devolverFamiliaProcesos(){
    
        this.resultado("familia",  this.procesos);
        this.resultado("familia_mock", this.procesosMock);
    }
}

module.exports = {

    CargarProcesos,

    SET_BUNDELER: (f) => {

        BUNDELER = f
    }

}
