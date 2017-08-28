"use strict";

const CatroEixos = require("../../../index.js");

class ProcesoDormilon extends CatroEixos.Proceso {

    parametrosNecesarios(){
      return ["numero"]
    }

    __r(){

        return [
          "__operaciones",
          "__apuntarResultados"
        ]
    }

    __operaciones(){

      return this.__runLote([

        ["sumar", 1],
        ["restar", 2],
        ["multiplicar", 3]

      ])

    }

    OK__operaciones(res){
      this["res_lotes"] = res;
    }

    __apuntarResultados(){
      this.resultado("suma", this["res_lotes"][0]);
      this.resultado("resta", this["res_lotes"][1]);
      this.resultado("multiplicacion", this["res_lotes"][2]);
    }

    sumar(n){
      return this.arg("numero") + n 
    }

    restar(n){
      return this.arg("numero") - n
    }

    multiplicar(n){
      return this.arg("numero") * n
    }

}

module.exports = ProcesoDormilon;
