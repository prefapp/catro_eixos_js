"use strict";

const CatroEixos = require("../../../index.js");

module.exports = class extends CatroEixos.Proceso {

    __r(){

        return [
          "__duermeA",
          "__duermeB",
          "__duermeC",
          "__duermeBucle",
        ]
    }

    __duermeA(){
      this.resultado("A", true);
      this.completado(20);
      return this.__esperar(1)
    }

    __duermeB(){
      this.resultado("B", true);
      this.completado(50);
      return this.__esperar(2)
    }

    __duermeC(){
      this.resultado("C", true);
      this.completado(90);
      return this.__esperar(3)
    }

    __duermeBucle(){
      if(!this.arg("bucle")) return;
      this.resultado("BUCLE", true);
    }

}

