"use strict";

const CatroEixos = require("../../../index.js");

module.exports = class extends CatroEixos.Proceso {

    parametrosNecesarios(){
      return ["llama_a"]
    }

    __r(){

        return [
          "__llamaAOtro",
        ]
    }

    __llamaAOtro(){
      return this.subProceso(this.arg("llama_a"), Object.assign({}, this.tarea.args))
    }
  
    OK__llamaAOtro(resultados){

      Object.keys(resultados).forEach((k) => {
        this.resultado(k, resultados[k])
      })

    }

}

