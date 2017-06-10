
class DepuradorProceso{

    constructor(refProceso, opciones = {}){
        this.refProceso = refProceso;
        this.opciones = opciones;
        this.ultimoSubProceso = false;
    }

    static incrementarNivel(){
        if(!this.NIVEL) this.NIVEL = 0;
        return this.NIVEL++;
    }

    static decrementarNivel(){
        return this.NIVEL--;
    }

    static nivel(){
        return this.NIVEL;
    }

    instalar(){

        this.refProceso.ejecutor.trazado.agregarObserver(function(store) {

            try{
                this.__cambio(store);
            }
            catch(e){

                console.log(e);
            }

        }.bind(this));

    }    

    __cambio(e){


        let ultimaAccion = e.get("ultimaAccion");

        let t = this.__getIndentacion();

        switch(ultimaAccion){

            case "PASO_ERRONEO":
                this.__pasoErroneo(e.get("pasoError"), t);
                break;
            case "EJECUTANDO_PASO":
                this.__ejecutandoPaso(e.get("enPaso"), t);                     
                break;
            case "PASO_EJECUTADO":
                this.__pasoEjecutado(e.get("pasosEjecutados").last(), t);
                break;
            case "EJECUTANDO_SUBPROCESO":
                this.__ejecutandoSubproceso(e.get("enSubproceso"), t);
                break;
            case "SUBPROCESO_EJECUTADO":
                this.__subprocesoEjecutado(this.ultimoSubProceso, t); 
                break;
        }

    }

    __pasoErroneo(paso, t){
        console.log(`${t}! error - paso ${paso}`);
    }

    __ejecutandoPaso(paso, t){
        console.log(`${t}+ ejecutando ... ${paso}`);
    }

    __pasoEjecutado(paso, t){
        console.log(`${t}- ejecutado ${paso}\n`);
    }

    __ejecutandoSubproceso(subProceso, t){

        DepuradorProceso.incrementarNivel();

        this.ultimoSubProceso = subProceso;

        t = this.__getIndentacion();

        console.log(`${t}Subproceso : [ ${subProceso} ] - ejecutando`);

    }

    __subprocesoEjecutado(subProceso, t){

        console.log(`${t}FinSubproceso: [ ${subProceso} ]`);

        DepuradorProceso.decrementarNivel();
    }

    __getIndentacion(){

        let t = "";

        for(let i = 0 ; i < DepuradorProceso.nivel(); i++) {
            t += "    ";
        }

        return t;

    } 

    __detenerEjecucion(paso){

//        var prompt = require('prompt-sync')();
//
//        if(this.opciones.stop === paso){
//
//            prompt("[ " + paso + " ] Pulsa una tecla para continuar...");
//        }

    }

}

module.exports = DepuradorProceso;
