const ProcesoBase = require("./base.js");

module.exports = class extends ProcesoBase{

    __r(){

        return [

            "__realizarEspera",
            "__recuperarValor",
            "__apuntarValor",
            "__comprobarValor"

        ]

    }

    __realizarEspera(){

        if(this.arg("esperar"))
            return this.__esperar(this.arg("esperar"));

    }

    __recuperarValor(){
    
        this.a("valor", this.GET_VALOR_A())

    }

    __apuntarValor(){

        this.resultado("valor", this.a("valor"));

    }

    __comprobarValor(){

        if(this.arg("comprobar"))
            this.arg("comprobar")(this.a("valor"))

    }

}
