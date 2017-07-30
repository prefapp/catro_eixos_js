"use strict";

const Ejecutor = require("./ejecutor.js");
const EjecutorComando = require("../utiles/comando.js");
//const Depurador = require("../utiles/depurador_proceso.js");
const EjecutorSubProceso = require("./ejecutor_subproceso.js");

class Proceso{

    constructor(tarea){

        this.tarea = tarea;
        this.ejecutor = new Ejecutor(this);
        this.refProcesador = undefined;
        this.nSubProcesos = 0;
        this.fEnValidacion = false;
        this.fEventos = {};
        this.fErrorSeteado = false;

        this.alijo = {};
    }

    ejecutar() {

        let _self = this;

        if(this.__tieneMetodo("DEPURAR") && this.DEPURAR()){
            this.__activarDebug();
        }
        
        //comunicamos el inicio de un proceso principal
        if(!this.tarea.sys.__subproceso__){
            this.ejecutor.__enviarAccion(
                "INICIO_PROCESO",
                {id: this.tarea.id,
                 proceso: this.tarea.args.proceso
                }
            );
        }

        this.__ejecutarEvento("INICIO_PROCESADO");


        return new Promise((cumplida, falla) => {

            _self.__cumplida__  = cumplida;

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
            validaciones.push("terminarValidacion");
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
                        else if(paso == "terminarValidacion"){
                            return this.terminarValidacion(cumplida);
                        }    
                        else{
                            return this.ejecutor.ejecutar(paso, resultado);
                        }

                    })
                    .catch((err) => {

                        this.__ejecutarEvento("PROCESADO_ERROR", err);

                        return this.terminar(fallo, true, err );

                    })

            }, Promise.resolve())

        });
    }

    terminarValidacion(cumplida){

        cumplida();
    }

    terminar(cumplida, hayError = false, err){

        if(hayError){
            if(!this.fErrorSeteado){
                this.error(`Error no controlado ${err}`);
            }
        }
        else if(!this.tarea.resultados.estado){
            this.resultado("estado", "OK");
        }

        this.__ejecutarEvento("FIN_PROCESADO");

        if(!this.tarea.sys["__subproceso__"]){

            this.ejecutor.__enviarAccion(
                "FIN_PROCESO",
                {
                    id: this.tarea.id,
                    proceso: this.tarea.args.proceso
                }
            );
        }      

        return new Promise(() => { cumplida(this.tarea) } );
    }

    arg(nombre) {
        return this.tarea.args[nombre];
    }

    sys(nombre){
        return this.tarea.sys[nombre];
    }    

    resultado(nombre, valor){
        return this.tarea.resultados[nombre] = valor;
    }

    error(err){

        this.fErrorSeteado = true;        

        if(typeof err === "string"){
            err = `[${this.arg("proceso")}][${err}]`
        }     
   
        this.resultado("estado", "KO");
        this.resultado("error", err);
    }

    comandoShell(comando, args, opciones = {}){

        opciones.soloSalida = true;
        opciones.__trazado__ = this.ejecutor.trazado;

        return new EjecutorComando(

            comando,

            args,

            opciones

        ).lanzar();
    }

    subProceso(nombre, args = {}){

        return EjecutorSubProceso(
            this,
            nombre,
            args
        );

    }

    __noHacerNada(d) { return d } 

    __validarKoDefecto(metodo) { this.error(`[${metodo}][KO]`)  } 

    __enErrorNoControlado(err) {

        this.error(err);        
    }

    __activarDebug(debug = this.DEPURAR()){

        if(this.tarea.sys["__depurar__"]) return;

        if(debug && this.tarea.sys["__agente_logs__"]){

            try{

                this.tarea.sys["__agente_logs__"].depurar(
                    this.tarea.id
                );  

                this.tarea.sys["__depurar__"] = true;

            }
            catch(err){
                console.log(err);
                throw new Error(`[DEPURADO][${err}]`);
            }          

        }

        //new Depurador(this, debug).instalar();

    }

    //gestion de eventos
    __agregarEvento(evento, codigo){

        if(!this.fEventos[evento]) this.fEventos[evento] = [];
        
        this.fEventos[evento].push(codigo);

    }

    __ejecutarEvento(evento, args){

        if(!this.fEventos[evento]) return;

        this.fEventos[evento].forEach((e) => e(args) )
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

    //logs
    __log(mensaje){

        if(!this.tarea.sys["__agente_logs__"]) return;

        this.tarea.sys["__agente_logs__"].custom(this, mensaje);
    }

    //acceso al alijo
    a(){
      if(arguments.length > 1){
        this.alijo[arguments[0]] = arguments[1];
      } 
      else{
        return this.alijo[arguments[0]]
      }
    }
}

module.exports = Proceso;
