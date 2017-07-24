
class DepuradorProceso{

    constructor(idProceso){
        this.idProceso = idProceso;
        this.rIdProceso = new RegExp(this.idProceso);
        this.NIVELES = {};
    }

    incrementarNivel(id, ref){

        if(!this.NIVELES[id]) 
            this.NIVELES[id] = this.NIVELES[ref] || 0;

        this.NIVELES[id]++; 
    }

    decrementarNivel(id){
        this.NIVELES[id]--;
    }

    nivel(id){
        return this.NIVELES[id];
    }

    instalar(store){

        store.subscribe(function() {

            try{
                this.__cambio(store.getState());
            }
            catch(e){

                console.log(e);
            }

        }.bind(this));

    }    

    __cambio(estado){

        let ultimaAccion = estado["ultimaAccion"].get("accion");

        if(!this.__filtrar(ultimaAccion)) return;

        switch(ultimaAccion.type){

            case "INICIO_PROCESO":
                this.__INICIO_PROCESO(ultimaAccion, estado);
                break;
            case "INICIO_SUB_PROCESO":
                this.__INICIO_SUB_PROCESO(ultimaAccion, estado);
                break;
            case "FIN_SUB_PROCESO":
                this.__FIN_SUB_PROCESO(ultimaAccion, estado);
                break;
            case "FASE_PASO":
                this.__FASE_PASO(ultimaAccion, estado);
                break;
            case "EJECUTAR_PASO":
                this.__EJECUTAR_PASO(ultimaAccion, estado);
                break;

        }

    }

    __INICIO_PROCESO(accion, estado){

        this.__i(`___PROCESO_PRINCIPAL___`);

        this.incrementarNivel(accion.id);

    }

    __INICIO_SUB_PROCESO(accion, estado){

        let id = accion.id + "@" + accion.subProcesoId;

        this.incrementarNivel(id, accion.id);

        this.__i(`SUB_PROCESO ${accion.subProceso} ->`, id)

        this.incrementarNivel(id, accion.id);
    }

    __FIN_SUB_PROCESO(accion, estado){

        this.decrementarNivel(accion.id);

        this.__i(`->FIN_SUB_PROCESO ${accion.subProceso}`, accion.id)

    }

    __EJECUTAR_PASO(accion, estado){

        this.__i(`${accion.paso}`, accion.id);

    }

    __FASE_PASO(accion, estado){

        let fase = accion.fase;

        if(!fase.match(/^[A-Z]{2,3}/)){
            fase = "(r)";
        }

        this.__i(`  * ${fase}`, accion.id);
    }

    __i(mensaje, id){

        let t = this.__getIndentacion(id);

        console.log(`${t}${mensaje}`);

    }

    __getIndentacion(id){

        let t = "";

        for(let i = 0 ; i < this.nivel(id); i++) {
            t += "    ";
        }

        return t;
    }

    __filtrar(accion){

        let id;

        if(accion.id) 
            id = accion.id;
        else if(accion.tarea)
            id = accion.tarea.id;
        else
            return false;

        return id.match(this.rIdProceso) !== null
    }


}

module.exports = DepuradorProceso;
