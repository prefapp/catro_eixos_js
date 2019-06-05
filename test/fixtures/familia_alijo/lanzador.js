const ProcesoBase = require("./base.js");

module.exports = class extends ProcesoBase{

    __r(){

        return [

            "__setValor",
            "__forkearProceso",

        ]

    }

    __setValor(){

        this.SET_VALOR_A("EN_FORK");

    }

    __forkearProceso(){

        return this.forkProceso(this.arg("familia") + ".b", {
         
            esperar: 0.5,

            comprobar: this.arg("comprobar")
            
        })

    }

}
