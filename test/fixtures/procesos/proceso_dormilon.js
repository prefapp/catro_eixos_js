"use strict";

const CatroEixos = require("../../../index.js");

class ProcesoDormilon extends CatroEixos.Proceso {

 //   DEPURAR() {return true}

    __r(){

        return [
            "__dormir",
            "__apuntarResultados"
        ]
    }

    __dormir(){
        return new Promise((cumplida, falla) => {

            setTimeout(

                () => {

                    this.arg("enDespertar")(this.arg("nombre"))

                    cumplida()

                }, 

                this.arg("duerme") || 100
            )
        })
    }

    __apuntarResultados(){
        this.resultado("despierto", this.arg("nombre"));
        this.resultado("tTranscurrido", this.__tTranscurrido());
    }

}

module.exports = ProcesoDormilon;
