const ProcesoBase = require("./base.js");

module.exports = class extends ProcesoBase{

    __r(){

        return [

            "__recuperarValor",
            "__apuntarValor"

        ]

    }

    __recuperarValor(){
    
        this.a("valor", this.GET_VALOR_A())

    }

    __apuntarValor(){

        this.resultado("valor", this.a("valor"));

    }

}
