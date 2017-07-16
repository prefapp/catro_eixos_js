"use strict";

//const TrazadoProceso = require("./trazado_proceso.js");
const ProcesoEstado = require("../estado/proceso_estado.js");

const EjecutorPaso = require("./ejecutor_paso.js");

const AC = require("../estado/acciones.js");

class EjecutorProceso{

    constructor(proceso){
        this.proceso = proceso;
        this.trazado = new ProcesoEstado();
        this.ejecutorPaso = new EjecutorPaso(proceso);
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
 //                           return new Promise( () => { falla(err) });
                            return falla(err);

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

        //nombre de metodo
        let nombreMetodo = this.__getNombreMetodo(accion, metodo, hayError);

        //en evaluacion (si hay un fallo anterior)
        //ya no ejecutamos
        if(hayError && metodo == "EVALUAR"){
            return Promise.resolve(salida)
        }

        //hay que saber si podemos ir a un código por defecto 
        // (no hay el metodo)
        let fallarSiNoExiste = (accion == "LANZAR");
        let codigo;
        let informarPaso = false;
        let enValidar = this.proceso.fEnValidacion;

        try{
            codigo = this.__getCodigoMetodo(nombreMetodo, fallarSiNoExiste);
        }
        catch(err){
            return Promise.reject(err);
        }       
    
        //es necesario informar del paso? no es un código de no hacer nada?
        if(codigo !== this.proceso["__noHacerNada"]){

            informarPaso = true;
                    
            this.trazado.accion(AC.EJECUTANDO_PASO(nombreMetodo))
        }

        return this.ejecutorPaso.ejecutar(codigo, args)

            .then((salida) => {

                //es un metodo de validar
                if(enValidar && accion === "LANZAR" && !hayError){

                    if(!salida){

                        this.trazado.accion(AC.PASO_ERRONEO(nombreMetodo));

                        return Promise.reject(nombreMetodo);
                    }
                }

                //informamos
                if(informarPaso)
                    this.trazado.accion(AC.PASO_EJECUTADO(nombreMetodo));

                return salida;
            })
    }

    __getNombreMetodo(accion, metodo, hayError){

        switch(accion){
            case "PRE":
                return "PRE" + metodo;
            case "LOG":
                return "LOG" + metodo;
            case "EVALUAR": 
                return "EVALUAR" + metodo;
            case "CONTROL":{
                let r = (hayError) ? "KO" + metodo : "OK" + metodo;
                return r;
            }
        }

        return metodo;
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
