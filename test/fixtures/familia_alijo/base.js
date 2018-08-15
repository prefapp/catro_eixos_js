const Proceso = require("../../../lib/nucleo/proceso.js");


module.exports = class extends Proceso{

    SET_VALOR_A(valor){

        this.A("VALOR_A", valor)

    }

    GET_VALOR_A(){

        return this.A("VALOR_A")

    }



}
