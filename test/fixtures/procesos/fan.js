"use strict";

const CatroEixos = require("../../../index.js");

module.exports = class extends CatroEixos.Proceso {

    DEPURAR() {return true}

    parametrosNecesarios(){
        return ["cadena"]
    }

    __r(){

        return [
            "__cadenaTratar",
            "__apuntarResultados"
        ]
    }

    FANOUT__cadenaTratar(){

        const letras = this.arg("cadena").split('');

        return this.fan(

            5,

            function(){

                return letras.shift() || false;

            }

        )

    }

    __cadenaTratar(letra){

        return new Promise((cumplida, falla) => {

            return this.__esperar(1).then(() => {

                cumplida(letra.toUpperCase())

            })
        })

    }

    FANIN__cadenaTratar(letras){

        console.log(letras)

        return letras.join('');
    }

    __apuntarResultados(cadena){
        this.resultado("salida", cadena);
    }

}

