"use strict";

const CatroEixos = require("../../../index.js");

module.exports = class extends CatroEixos.Proceso {

    parametrosNecesarios(){
      return ["familia"]
    }

    __r(){

        return [
          "__llamarACadena",
          "__llamarACadenaConError"
        ]
    }

    __llamarACadena(){

      if(this.arg("continuar")) return;

      return this.subProceso(

        this.arg("familia") + ".proceso_test",

        {}

      )
    }
      
    __llamarACadenaConError(){
    
      return this.subProceso(
        this.arg("familia") + ".proceso_test",

        {
          cadena: "FALLA"
        }
      )

    }

}

