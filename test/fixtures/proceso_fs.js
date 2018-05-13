"use strict";

const {Proceso} = require("../../index.js");

module.exports = class extends Proceso {

    parametrosNecesarios(){

        return ["ruta"];
    }

    __r(){

        return [

            "__existeFichero",
            "__crearFichero",
            "__leerFichero",
            "__borrarFichero"
        ]
    }

    __existeFichero(){

        return this.UtilesFS.existeFichero(this.arg("ruta"))

    }

    OK__existeFichero(existe){

        if(existe){
            throw `NO SE CONTROLA BIEN SI EXISTE O NO UN FICHERO`
        }
    }

    __crearFichero(){

        return this.UtilesFS.escribirFichero(this.arg("ruta"), JSON.stringify({valor : 99}))

    }

    EVAL__crearFichero(){

        return this.UtilesFS.existeFichero(this.arg("ruta")).then((stats) => {

            if(!stats) throw `El fichero no se ha creado`
    
        })
    }

    __leerFichero(){

        return this.UtilesFS.leerFichero(this.arg("ruta"))

                .then((datos) => {

                    return JSON.parse(datos)

                })

    }

    EVAL__leerFichero(datos){

        if(!datos || (typeof datos != 'object') || datos.valor != 99){
    
            throw `No se ha podido leer correctamente el contenido del fichero`
        }

    }    

    __borrarFichero(){

        return this.UtilesFS.borrarFichero(this.arg("ruta"))

    }   

    EVAL__borrarFichero(){

        return this.UtilesFS.existeFichero(this.arg("ruta")).then((stats) => {

            if(stats) throw `No se ha borrado realmente el fichero`

        })

    }

    
}

