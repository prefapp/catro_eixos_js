const {Proceso} = require("../../../index.js");

module.exports = {

    "ProcesoPetaConstructor": class extends Proceso{

        constructor(tarea){

            super(tarea);

            throw "EN_CONSTRUCTOR";
        }
    },

    "ProcesoPeteInterno": class extends Proceso{

        __r() {
            return "foo"
        }
    },

    "ProcesoSinKo": class extends Proceso{

        __r(){
            return ["__falla"]
        }

        __falla(){
            throw new Error();
        }

    },

    "ProcesoErrorEnOk": class extends Proceso{

        __r(){
            return ["__falla"]
        }

        __falla(){
            
        }

        OK__falla(){
            throw new Error();
        }

    }

}
