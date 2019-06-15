const {Proceso} = require("../../../index.js");

module.exports = class extends Proceso{

    parametrosNecesarios(){

        return {

            a: Number,

            b: Number,

            mock: Boolean,

        }

    }

    __r(){

        return [
            
            "__calcular"

        
        ]

    }

    __calcular(){

        return this.subProceso(
            
            "Test.calcular", 
                
            {
                
                __MOCK__: this.arg("mock"),

                a: this.arg("a"),

                b: this.arg("b")

                
            }

        ).then(({suma, mock}) => {
            
            this.resultado("suma", suma);
            this.resultado("mock", mock);
        })

    }


}


