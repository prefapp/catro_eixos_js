const EjecutorPaso = require("./ejecutor_paso.js");

const {Fan} = require("./fan.js");

const Rep = require("./rep.js");

module.exports = class{

    constructor(refProceso){

        this.proceso = refProceso;

        this.manejadorEstado = this.proceso.tarea.sys["__manejador_estado__"];

        this.ejecutorPaso = new EjecutorPaso(refProceso);
    }

    ejecutar(metodo, resultadoAnterior){

        return this.__ejecutarMetodo(metodo, resultadoAnterior);

    }

    rollback(enEjecucion){

      //no hay estado o estamos en validacion(no hay rollback)
      if(!this.manejadorEstado || !enEjecucion) 
        return Promise.resolve();

      let estado = this.manejadorEstado.getEstadoProceso(

        this.proceso.tarea.id

      );

      //recogemos la lista de pasos ejecutados
      let pasosEjecutados = estado.get("pasosEjecutados")

        .toJS()

        .reverse();

      let rollbacks = pasosEjecutados

            .filter(p => !this.__esPasoValidacion(p));

      return (async () => {

        try{

          let r = undefined;

          for(let i = 0; i < rollbacks.length; i++){
            r = await this.__r("RB", rollbacks[i], r);
          }
        }
        catch(err){
          throw new Error(`[ROLLBACK][${err}]`)
        }

        return;

      })();

    }

    __ejecutarMetodo(metodo, resultadoAnterior){

        let procesoId = this.proceso.tarea.id;

        if(this.__esPasoFan(metodo)){

            return this.__ejecutarMetodoFan(metodo, resultadoAnterior);

        }

        if(this.__esPasoRep(metodo)){

            return this.__ejecutarMetodoRep(metodo, resultadoAnterior);

        }


        return (async () => {

            this.__enviarAccion("EJECUTAR_PASO", {id: procesoId, paso: metodo, proceso: this.proceso.tarea.args.proceso});

            let r = resultadoAnterior;
            
            try{

                r = await this.__r("PRE", metodo, r);

                r = await this.__r("", metodo, r);

                //si estamos en un proceso de validacion
                if(!r && this.proceso.fEnValidacion){
                    throw Error(metodo);
                }

                r = await this.__r("EVAL", metodo, r);

                r = await this.__r("OK", metodo, r);

                let log = await this.__r("LOG", metodo, r);

                if(log){
                    this.proceso.__log(log);
                }

                await this.__r("DEV", metodo, r)

            }
            catch(err){

                    console.log(err);

                this.__enviarAccion("PASO_ERRONEO", {

                    id: procesoId, 
                    paso: metodo, 
                    proceso: this.proceso.tarea.args.proceso, 
                    error: err

                });

                try{
                    await this.__r("KO", metodo, err);   
                }
                catch(err){
                    throw err;
                }

                throw err;
            }

            this.__enviarAccion("PASO_EJECUTADO", {id: procesoId, paso:metodo, proceso: this.proceso.tarea.args.proceso});


            return r;

        })()

    }

    __ejecutarMetodoRep(metodo, resultadoAnterior){

        let procesoId = this.proceso.tarea.id;

        let resultadoPasoAnterior = null;
        let iterador = 0;

        const rep = async () => {

            return await this.__r("REP", metodo, resultadoPasoAnterior, iterador);

        }

        const paso = async () => {

            resultadoPasoAnterior = await this.__r("", metodo, iterador++)

            return resultadoPasoAnterior;

        }

        let r;

        return (async () => {

            try{

                r = await this.__r("PRE", metodo, r)

                r = await new Rep(rep, paso).ejecutar()

                r = await this.__r("EVAL", metodo, r);
                r = await this.__r("OK", metodo, r);
                
                let log = await this.__r("LOG", metodo, r);

                if(log){
                    this.proceso.__log(log);
                }

                await this.__r("DEV", metodo, r)

            }
            catch(err){

                console.log(err);

                this.__enviarAccion("PASO_ERRONEO", {

                    id: procesoId, 
                    paso: metodo, 
                    proceso: this.proceso.tarea.args.proceso, 
                    error: err

                });

                try{
                    await this.__r("KO", metodo, err);   
                }
                catch(err){
                    throw err;
                }

                throw err;

            }

            this.__enviarAccion("PASO_EJECUTADO", {id: procesoId, paso:metodo, proceso: this.proceso.tarea.args.proceso});

            return r;
        })()

    }

    __ejecutarMetodoFan(metodo, resultadoAnterior){

        let procesoId = this.proceso.tarea.id;

        if(!this.__tieneMetodo("FANIN" + metodo)){
            throw `FAN_FALTA_FANIN: ${metodo}`
        }

        let r;

        return (async () => {

            try{

                const fan = await this.__r("FANOUT", metodo, resultadoAnterior);

                if(!fan || !(fan instanceof Fan)){

                    throw `LOS METODOS FANOUT deben devolver un objeto Fan ${metodo}`

                }

                r = await fan.ejecutar(this.__getCodigoMetodo(metodo).bind(this.proceso));

                r = await this.__r("FANIN", metodo, r);

                r = await this.__r("EVAL", metodo, r);

                r = await this.__r("OK", metodo, r);

                let log = await this.__r("LOG", metodo, r);

                if(log){
                    this.proceso.__log(log);
                }

                await this.__r("DEV", metodo, r)

            }
            catch(err){

                console.log(err);

                this.__enviarAccion("PASO_ERRONEO", {

                    id: procesoId, 
                    paso: metodo, 
                    proceso: this.proceso.tarea.args.proceso, 
                    error: err

                });

                try{
                    await this.__r("KO", metodo, err);   
                }
                catch(err){
                    throw err;
                }

                throw err;

            }

            this.__enviarAccion("PASO_EJECUTADO", {id: procesoId, paso:metodo, proceso: this.proceso.tarea.args.proceso});

            return r;

        })();

    }


    __r(prefijo, metodo, args, extra){

        let codigo = this.__getCodigoMetodo(prefijo + metodo, prefijo === "");

        if(codigo !== this.proceso["__noHacerNada"]){

            this.__enviarAccion("FASE_PASO", {
                fase: prefijo + metodo,
                id: this.proceso.tarea.id
            });
        }

        return this.ejecutorPaso.ejecutar(codigo, args, extra)
    }

    __getCodigoMetodo(nombreMetodo, fallarSiNoExiste){

        if(this.__tieneMetodo(nombreMetodo)){

            return this.proceso[nombreMetodo];

        }
        else{

            if(fallarSiNoExiste) {
                throw "METODO_NO_EXISTENTE_EN_PROCESO: " + nombreMetodo;
            }

            if(nombreMetodo.match(/^KO/)){
                if(this.proceso.fEnValidacion)
                    return this.proceso["__validarKoDefecto"]
                else
                    return this.proceso["__enErrorNoControlado"];
            }
            else if(nombreMetodo.match(/^(LOG|DEV)/)){
                return this.proceso["__noHacerNada"]
            }
            else{
                return this.proceso["__noHacerNada"];
            }
        }

    }

    __tieneMetodo(metodo){

        return Reflect.has(this.proceso, metodo) && 

            typeof(this.proceso[metodo]) == "function";
    }

    __enviarAccion(accion, args){

        if(!this.manejadorEstado) return;

        this.manejadorEstado.enviarAccion(accion, args);
    }

    __esPasoValidacion(p){

      if(p === "__validacionParametrosNecesarios") return true;

      if(!this.proceso.__v) return false;

      return this.proceso.__v().indexOf(p) !== -1
    }

    __esPasoFan(metodo){

        return this.__tieneMetodo("FANOUT" + metodo)

    }

    __esPasoRep(metodo){

        return this.__tieneMetodo("REP" + metodo);

    }
}
