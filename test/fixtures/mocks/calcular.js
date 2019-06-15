const {Proceso} = require("../../../index.js");

module.exports = class extends Proceso{

    __r(){

        return [
        
            "__calculo"
        
        ]

    }

    __calculo(){

        this.resultado("suma", this.arg("a") + this.arg("b"));

    }

}


