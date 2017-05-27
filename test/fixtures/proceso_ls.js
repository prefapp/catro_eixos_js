"use strict";

const CatroEixos = require("../../index.js");

class ProcesoLs extends CatroEixos.Proceso {

    parametrosNecesarios(){

        return ["ruta"];
    }

    __r(){

        return [

            "__lanzarLs",
            "__apuntarResultados"
        ]
    }
    
    __lanzarLs(){

        return this.comandoShell(

            "/bin/ls",

            [this.arg("ruta")]

        );
    }

    OK__lanzarLs(salida){

        this.lista = salida.split(/\n/);

    }

    KO__lanzarLs(err){

        this.error("ERROR_LS: " + err);
    }

    __apuntarResultados(){

        this.resultado(

            "entradas",

            this.lista.map((e) => {

                return e.trim();

            }).filter((e) => {

                return e.length > 0

            })

        );

    }


}

module.exports = ProcesoLs;
