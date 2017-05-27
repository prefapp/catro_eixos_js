"use strict";

const Ejecutor = require("./ejecutor.js");
const Tarea = require("./tarea.js");

const EjecutorComando = require("../utiles/comando.js");
const Depurador = require("../utiles/depurador.js");

class Proceso{

    constructor(tarea){

        this.tarea = tarea;
        this.ejecutor = new Ejecutor(this);
        this.refProcesador = undefined;
        this.fEnValidacion = false;
    }

    ejecutar() {

        let _self = this;

        if(this.__tieneMetodo("DEPURAR") && this.DEPURAR()){
            _self = this.__activarDebug();
        }

        return new Promise((cumplida, falla) => {

            _self.__validarProceso()

                .then(() => {

                    return _self.__ejecutarProceso();

                }).then((tarea) => {

                    cumplida(tarea);

                }).catch((tarea) => {
                
                    falla(tarea);
                });

        });
    }


    __validarProceso(){
        
        return new Promise((cumplida, falla) => {

            let validaciones = this.__getValidaciones();

            if(validaciones){

                this.fEnValidacion = true;

                 this.__ejecutarPasos(validaciones)

                    .then(() => {

                        this.fEnValidacion = false;

                        cumplida();
                    })
                    .catch((tarea) => {
    
                        falla(tarea);
                    })
        
            }
            else{

                cumplida();

            }

        });
    }

    __getValidaciones(){

        let validaciones = [];

        if(this.__tieneMetodo("parametrosNecesarios")){
            validaciones.push("__validacionParametrosNecesarios");
        }

        if(this.__tieneMetodo("__v")){
            validaciones = validaciones.concat(this.__v());
        }

        if(validaciones.length == 0) {
           return false;
        }
        else{
            validaciones.push("terminar");
            return validaciones;
        }
    }

    __ejecutarProceso(){

        //ejecutamos los distintos pasos o fases de un proceso
        let pasos = this.__r();

        pasos.push("terminar");

        return this.__ejecutarPasos(pasos);
        
    }

    __ejecutarPasos(pasos){

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

    comandoShell(comando, args, opciones = {}){

        opciones.soloSalida = true;

        return new EjecutorComando(

            comando,

            args,

            opciones

        ).lanzar();
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

    __noHacerNada(d) { return d } 

    __enErrorConControlado(err) {

        this.error(err);        
    }

    __activarDebug(){
 
        let miProxy = new Depurador(this).obtenerProxy();       

        this.ejecutor.proceso = miProxy;

        return miProxy;
    }

    //sugar
    __tieneMetodo(metodo){
        return this.ejecutor.__tieneMetodo(metodo);
    }

    __validacionParametrosNecesarios(){

        let pn = this.parametrosNecesarios();

        for(let i = 0; i < pn.length; i++) 
            if(!(pn[i] in this.tarea.args)) 
                throw "FALTA_PARAMETRO: " + pn[i];

        return true;
    }
}

module.exports = Proceso;
