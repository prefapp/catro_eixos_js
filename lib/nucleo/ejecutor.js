"use strict";

//const TrazadoProceso = require("./trazado_proceso.js");
const ProcesoEstado = require("../estado/proceso_estado.js");

const AC = require("../estado/acciones.js");

class EjecutorProceso{

    constructor(proceso){
        this.proceso = proceso;
        this.trazado = new ProcesoEstado();
    }
    
    ejecutar(metodo, resultadoAnterior){
 
        return this.__lanzarMetodo(metodo, resultadoAnterior)

    }

    __lanzarMetodo(metodo, args){

        let flag_error = false;

        return new Promise((cumplida, falla)=>{

            ["PRE", "LANZAR", "EVALUAR", "CONTROL", "LOG", "FIN"].reduce((promesa, accion) => {

                return promesa
                
                    .then((salida) => {

                        if(accion == "FIN" || flag_error){
                             return new Promise( () => { (flag_error) ? falla(salida) : cumplida(salida) });
                        }
                        else{
                            return this.__prepararPaso(accion, metodo, salida);
                        }

                    })

                    .catch((err) => {

                        if(accion == "CONTROL"){


                            return new Promise( () => { falla(err) });

                        }
                        else{

                            flag_error = true;

                            return this.__prepararPaso("CONTROL", metodo, err, true);
                        }
                    })

            }, Promise.resolve(args))

        });
    }

    __prepararPaso(accion, metodo, args, hayError = false){

        let nombreMetodo = metodo;

        //preparamos accion
        if(accion == "PRE"){
           nombreMetodo = "PRE" + nombreMetodo;
        }
        else if(accion == "LOG"){
            nombreMetodo = "LOG" + nombreMetodo;
        }
        else if(accion == "EVALUAR"){
            nombreMetodo = "EVAL" + nombreMetodo;
        }
        else if(accion == "CONTROL"){
            if(hayError){
                nombreMetodo = "KO" + nombreMetodo;
            }
            else{
                nombreMetodo = "OK" + nombreMetodo;
            }
        }

        //en evaluacion (si hay un fallo anterior)
        //ya no ejecutamos
        if(hayError && metodo == "EVALUAR"){
            return Promise.resolve(salida)
        }

        //ejecución de paso
        return new Promise((cumplida, falla) => {

            try{

                //recogemos el codigo del paso
                let fallarSiNoExiste = (accion == "LANZAR");
        
                let codigo = this.__getCodigoMetodo(nombreMetodo, fallarSiNoExiste);        

                let salida = null;
                let informarPaso = false;

                if(codigo !== this.proceso["__noHacerNada"]) {
 //                   this.trazado.ejecutarMetodo(nombreMetodo);      

                    informarPaso = true;                 

                    this.trazado.accion(AC.EJECUTANDO_PASO(nombreMetodo))

                }

                salida = codigo.call(this.proceso, args);
                    
                //si es una promesa
                if(this.__esPromesa(salida)){


                    salida

                        .then((nuevaSalida) => {
                            
                            //es una validacion? 
                            if(this.proceso.fEnValidacion && accion == "LANZAR" && !hayError){

                                if(!nuevaSalida) {
    
                                    this.trazado.accion(AC.PASO_ERRONEO(nombreMetodo));

                                    return falla();

                                }
                            }

                            if(informarPaso)
                                this.trazado.accion(AC.PASO_EJECUTADO(nombreMetodo));

                            cumplida(nuevaSalida);   
                        })
                        .catch((err) => {

                            this.trazado.accion(AC.PASO_ERRONEO(nombreMetodo))

                            falla(err);
                        })
                }   
                else{

                    //es una validacion? (en cuyo caso tiene que devolver un true)
                    if(this.proceso.fEnValidacion && accion == "LANZAR" && !hayError){
                        if(!salida){

                            this.trazado.accion(AC.PASO_ERRONEO(nombreMetodo));

                            return falla();
                        }
                    }
                        
                    if(informarPaso)    
                        this.trazado.accion(AC.PASO_EJECUTADO(nombreMetodo));

                    cumplida(salida);
                }
            }
            catch(err){

                falla(err);

            }

        })
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
                return this.proceso["__enErrorConControlado"];
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

    __esPromesa(obj) {
        return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
    }

}

module.exports = EjecutorProceso;
