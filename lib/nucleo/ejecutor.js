const EjecutorPaso = require("./ejecutor_paso.js");

module.exports = class{

    constructor(refProceso){

        this.proceso = refProceso;

        this.manejadorEstado = this.proceso.tarea.sys["__manejador_estado__"];

        this.ejecutorPaso = new EjecutorPaso(refProceso);
    }

    ejecutar(metodo, resultadoAnterior){

        return this.__ejecutarMetodo(metodo, resultadoAnterior);

    }

    rollback(){

      if(!this.manejadorEstado) 
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

    __r(prefijo, metodo, args){

        let codigo = this.__getCodigoMetodo(prefijo + metodo);

        if(codigo !== this.proceso["__noHacerNada"]){

            this.__enviarAccion("FASE_PASO", {
                fase: prefijo + metodo,
                id: this.proceso.tarea.id
            });
        }

        return this.ejecutorPaso.ejecutar(codigo, args)
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
}
