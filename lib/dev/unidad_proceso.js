const Tarea = require("../nucleo/tarea.js");

const Silenciador = require("./silenciador.js");
const Stopper = require("./stopper.js");

const ProcesadorDev = require("./procesador.js");

class UnidadProceso{

    constructor(proceso, refProcesador){

        this.proceso = proceso;
 
        this.refProcesador = new ProcesadorDev();

        if(refProcesador){
            this.refProcesador.procesos = refProcesador.procesos;
        }


        this.cadena = false;

        this.fDump = false;

        this.reescrituras = [];
    }

    ejecutar(args = {}){

        let t = new Tarea(args.id || "test", args);

        this.__prepararProceso();

        this.cadena = new Promise((cumplida, falla) => {

            let objetoProceso = new this.proceso(t);

            objetoProceso.refProcesador = this.refProcesador;

            cumplida(objetoProceso)

        });

        return this;
    }

    dump(realizar = true){
        this.fDump = realizar;
        return this;
    }

    silenciar(silencios){

        this.cadena

            .then((proceso) => {

                new Silenciador(this.proceso)

                    .aplicarSilencios(
                        silencios
                    )
            })

        return this;
    }

    detenerEn(stoppers){

        this.cadena

            .then((proceso) => {

                new Stopper(this.proceso)

                    .aplicarStoppers(stoppers)
            })

        return this;
    }

    simular(simulaciones){

        this.cadena

            .then((proceso) => {

                new Simulador(this.proceso).aplicarSimulaciones(
                    simulaciones
                )

            })

        return this;
    }

    evaluar(evaluacion = {}, end = () => {}){

        return this.cadena

            .then((proceso) => {

                this.refProcesador.setObjetoProceso(proceso);

                return this.refProcesador.ejecutar();
            })

            .then((t) => {
                return this.__realizarEvaluacion(
                    evaluacion,
                    t.resultados,
                    end
                )
            })

            .catch((t) => {
                return this.__realizarEvaluacion(
                    evaluacion,
                    t.resultados,
                    end
                )
            })
    }

    __prepararProceso(){

        //creamos una clase nueva para
        //salvaguardar la original de reescrituras

        let claseProceso = this.proceso;

        this.proceso = class extends claseProceso {};

    }

    __realizarEvaluacion(evaluacion, resultados, end){

        let ok = true;
        let noCoincidentes = {};

        if(this.fDump) this.__anuncio(resultados, false);

        for(let k in evaluacion){

            if(evaluacion[k] !== resultados[k]){
                noCoincidentes[k] = {};
                noCoincidentes[k][" + "] = evaluacion[k];
                noCoincidentes[k][" - "] = resultados[k];

                ok = false;
            }
        }

        if(ok){
            end();
        }
        else{
            this.__anuncio(noCoincidentes);
            end(1)
        }
    }

    __anuncio(datos, formatear=true){
        if(typeof datos === "string")   
            console.log(datos);
        else if(formatear)                           
            console.log(JSON.stringify(datos, 0, 3));
        else
            console.log(datos);
    }
}

module.exports = UnidadProceso;
