"use strict";

const CatroEixos = require("../../index.js");

const fs = require("fs");

module.exports = class extends CatroEixos.Proceso {

    DEPURAR(){ return true }

    parametrosNecesarios(){

        return [
            "numero",
            "ruta",
            "espera"
        ]

    }

    __r(){

        return [

            "__lanzarParaCada",
            "__apuntarResultados"

        ]
    }

    __lanzarParaCada(){

        return this.paraCada(

            Array.apply(null, {length: this.arg("numero")}).map((e, i) => {

                return () => { return bloquear(this.arg("ruta"), i, 50) }

            }),

            this.arg("espera")

        )


    }

    __apuntarResultados(rr){

        this.resultado("rr", rr);
    }

}

function bloquear(ruta, id, esperar){

    return new Promise((cumplida, falla) => {

        fs.stat(ruta, function(err){

            if(!err) return falla(` ${id} : El fichero existe`);

            fs.writeFile(ruta, " ", function(err){

                if(err) return falla(`${id}: no se pudo escribir en el fichero ${err}`)

                console.log("Fichero escrito")
                setTimeout(function(){

                    fs.unlink(ruta, function(err){

                        if(err) return falla(`${id}: borrado de fichero ${err}`)

                        cumplida(`${id} ejecutada`);
                    })


                }, esperar)
            })

        })

    })    

}
