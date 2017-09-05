"use strict";

const CatroEixos = require("../../../index.js");

module.exports = class extends CatroEixos.Proceso {

    parametrosNecesarios(){
      return ["familia"]
    }

    __r(){

        return [
          "__llamarACadena"
        ]
    }

    __llamarACadena(){

      return this.subProceso(

        this.arg("familia") + ".proceso_test",

        {}

      )

    }

}

