const Proceso = require("../../../lib/nucleo/proceso.js");


module.exports = class extends Proceso{

  __r(){
    return [
      "__computar",
      "__apuntarResultados"
    ]
  }

  __computar(){

    this.a("cifra", 22);

  }

  __apuntarResultados(){

    this.resultado("cifra", this.a("cifra"));
  }

  

}
