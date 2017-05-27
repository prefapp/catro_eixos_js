"use strict";

const TrazadoProceso = require("./trazado_proceso.js");

class EjecutorProceso{

    constructor(proceso){
        this.proceso = proceso;
        this.trazado = new TrazadoProceso();
    }
    
    ejecutar(metodo, resultadoAnterior){
 
        return this.__lanzarMetodo(metodo, resultadoAnterior)

    }

    __lanzarMetodo(metodo, args){

        let flag_error = false;

        return new Promise((cumplida, falla)=>{

            ["PRE", "LANZAR", "CONTROL", "LOG", "FIN"].reduce((promesa, accion) => {

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
        else if(accion == "CONTROL"){
            if(hayError){
                nombreMetodo = "KO" + nombreMetodo;
            }
            else{
                nombreMetodo = "OK" + nombreMetodo;
            }
        }

        //ejecución de paso
        return new Promise((cumplida, falla) => {

            try{

                //recogemos el codigo del paso
                let fallarSiNoExiste = (accion == "LANZAR");
        
                let codigo = this.__getCodigoMetodo(nombreMetodo, fallarSiNoExiste);        

                let salida = null;

                if(codigo !== this.proceso["__noHacerNada"]) 
                    this.trazado.ejecutarMetodo(nombreMetodo);

                salida = codigo.call(this.proceso, args);

                //si es una promesa
                if(this.__esPromesa(salida)){

                    salida

                        .then((nuevaSalida) => {
                            
                            //es una validacion? 
                            if(this.proceso.fEnValidacion && accion == "LANZAR" && !hayError){
                                if(!nuevaSalida) return falla();
                            }
                            cumplida(nuevaSalida);   
                        })
                        .catch((err) => {
                            falla(err);
                        })
                }   
                else{

                    //es una validacion? (en cuyo caso tiene que devolver un true)
                    if(this.proceso.fEnValidacion && accion == "LANZAR" && !hayError){
                        if(!salida) return falla();
                    }
                        
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
