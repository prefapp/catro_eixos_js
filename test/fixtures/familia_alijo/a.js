const ProcesoBase = require("./base.js");


module.exports = class extends ProcesoBase{

    parametrosNecesarios(){

        return {

            inicio: Number,

            hasta: Number

        }

    }

    __r(){

        return [

            "__incrementarValor",
            "__apuntarValor",

        ]

    }

    PRE__incrementarValor(){

        this.a("valor", this.arg("inicio"))        

    }

    REP__incrementarValor(n, i){

        return i < this.arg("hasta")

    }

    __incrementarValor(){
    
        this.a("valor", this.a("valor") + 1)

    }

    __apuntarValor(){

        this.SET_VALOR_A(this.a("valor"));

    }

}
