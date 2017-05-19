"use strict";

const Ejecutor = require("./ejecutor.js");
const Tarea = require("./tarea.js");

class Proceso{

    constructor(tarea){

        this.tarea = tarea;
        this.ejecutor = new Ejecutor(this);
        this.refProcesador = undefined;
    }

    ejecutar() {

        let pasos = this.__r();

        pasos.push("terminar");

        return new Promise((cumplida, fallo) => {

            pasos.reduce((promesa, paso) => {

                return promesa
        
                    .then((resultado) => {

                        if(paso == "terminar"){
                            return this.terminar(cumplida);
                        }    
                        else{
                            return this.ejecutor.ejecutar(paso, resultado);
                        }

                    })
                    .catch((err) => {

                        return this.terminar(() =>{ fallo(this.tarea) } );

                    })

            }, Promise.resolve())

        });
    }

    terminar(cumplida){

        return new Promise(() => { cumplida(this.tarea) } );
    }

    arg(nombre) {
        return this.tarea.args[nombre];
    }
    
    resultado(nombre, valor){
        return this.tarea.resultados[nombre] = valor;
    }

    error(err){
        
        this.resultado("estado", "KO");
        this.resultado("error", err);
    }

    subProceso(nombre, args){

        args.proceso = nombre; 

        //devuelve una promesa       
        return new Promise((cumplida, falla) => {

            this.refProcesador.ejecutar(

                new Tarea(

                    this.tarea.id,
                
                    args

                )

            ).then((tarea) => {

                cumplida(tarea.resultados);

            }).catch((tarea) => {

                falla(tarea.resultados.error);

            })

        })

    }

    __noHacerNada(d) { return d} 

    __enErrorConControlado(err) {

        this.error(err);        
    }
}

module.exports = Proceso;
