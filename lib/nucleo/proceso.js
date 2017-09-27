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
        this.enSubProceso = false;
        this.fEnValidacion = false;
        this.fEventos = {};
        this.fErrorSeteado = false;
        this.fCancelar = false;

    }

    cancelar(){

      this.fCancelar = true;

      if(this.enSubProceso){ //cancelamos el proceso

        this.refProcesador.getProcesoEnEjecucion(

          this.enSubProceso

        ).cancelar()
      }
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

        return this.__ejecutarPasos(pasos, true);
        
    }

    __ejecutarPasos(pasos, enEjecucion = false){

        return new Promise((cumplida, fallo) => {

            pasos.reduce((promesa, paso) => {

                return promesa
        
                    .then((resultado) => {

                        if(this.fCancelar) 
                          throw "CANCELADO";

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
    
                        return this.__rollback(enEjecucion)

                          .then(() => {

                            this.__ejecutarEvento("PROCESADO_ERROR", err);

                            return this.terminar(fallo, true, err );

                          })

                    })

            }, Promise.resolve())

        });
    }

    __rollback(enEjecucion){

      return this.ejecutor.rollback(enEjecucion);

    }

    //método de conveniencia para la ejecución de 
    //varios metodos
    __runLote(metodos){

      if(!Array.isArray(metodos))      
        throw `[__runLote][metodos no es un array]`;

      let resultados = [];

      metodos.push("FIN");

      return new Promise((cumplida, falla) => {

          metodos.reduce((promesa, metodo) => {

            let nombreMetodo = (Array.isArray(metodo)) ? metodo[0] : metodo;
            let args = (Array.isArray(metodo)) ? metodo[1] : undefined;

            return promesa

              .then((res) => {

                resultados.push(res);

                if(nombreMetodo === "FIN") 
                  return cumplida(resultados.slice(1));

                return this.ejecutor.ejecutar(nombreMetodo, args);

              })

              .catch((err) => {

                return falla(`[LOTE][${nombreMetodo}][${err}]`);

              })

          }, Promise.resolve())

      })

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

    completado(porcentaje = false){

      if(porcentaje === false) 
        return this.tarea.resultados.porcentaje_completado;

      this.resultado("porcentaje_completado", porcentaje)

      this.__ejecutarEvento("PORCENTAJE_ACTUALIZADO", porcentaje);

    }

    porcentaje(porcentaje){

      return this.completado(porcentaje);

    }

    hito(hito = false){

      if(hito === false)
        return this.tarea.resultado.hito;

      this.resultado("hito", hito)

      this.__ejecutarEvento("HITO_ACTUALIZADO", hito)


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

    subProceso(nombre, args = {}, opciones){

        return EjecutorSubProceso(
          this,
          nombre,
          args,
          opciones
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
            if(!(pn[i] in this.tarea.args) || pn[i] == undefined) 
                throw "FALTA_PARAMETRO: " + pn[i];

        return true;
    }

    //logs
    __log(mensaje){

        if(!this.tarea.sys["__agente_logs__"]) return;

        this.tarea.sys["__agente_logs__"].custom(this, mensaje);
    }

    log(level,...args){
    
        let mensaje = args.map(function(e){

          if(typeof(e) === 'string')
            return e
          else
            return JSON.stringify(e)
        
          }).join(' - ')

        mensaje = `@${level} ${mensaje}`

        this.__log(mensaje)

    }

    logDebug(...args){
      this.log('debug',...args)
    }

    logInfo(...args){
      this.log('info',...args)
    }

    logWarn(...args){
      this.log('warn',...args)
    }

    logError(...args){
      this.log('error',...args)
    }

    /*helpers*/
    __esperar(segundos){

      return new Promise((cumplida) => {

        setTimeout(() => {
          cumplida();
        }, segundos * 1000)

      })
    }
}

module.exports = Proceso;
