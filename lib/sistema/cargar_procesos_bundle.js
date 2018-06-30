const Proceso = require("../nucleo/proceso.js");

module.exports = class extends Proceso{

    DEPURAR(){
        return true;
    }

    parametrosNecesarios(){

        return [

            "familia",
            "bundle"

        ]

    }

    __r(){

        return [

            "__cargarModulosProcesos",
            "__devolverFamiliaProcesos"

        ]

    }

    __cargarModulosProcesos(){

        this.a("procesos", {})  

        const procesos_familia = this.arg("bundle")[this.arg("familia")];

        Object.keys(procesos_familia).forEach((proceso) => {

            let nombre_proceso = `${this.arg("familia")}.${proceso}`

            this.a("procesos")[nombre_proceso] = procesos_familia[proceso];

        })

    }

    __devolverFamiliaProcesos(){

        this.resultado("familia", this.a("procesos"))
        
    }


}
