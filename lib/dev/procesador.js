const Procesador = require("../nucleo/procesador.js");


module.exports = class extends Procesador{

    //el primer proceso se lanza desde aquí
    setObjetoProceso(proceso){
        this.OBJETO_PROCESO = proceso;
    } 

    ejecutar(tarea){
        //solo el objeto padre se lanza desde aquí
        if(this.OBJETO_PROCESO){
            let o = this.OBJETO_PROCESO;
            this.OBJETO_PROCESO = false;

            return o.ejecutar();

        }
        else{
            return super.ejecutar(tarea);
        }
    }

}
