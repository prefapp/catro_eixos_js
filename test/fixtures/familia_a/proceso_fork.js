"use strict";

const CatroEixos = require("../../../index.js");

class PDaemon extends CatroEixos.Proceso {

    __r(){

        return [

            "__abrirCanales",
            "__forkProceso",
            "__apuntarResultados"
        ]
    }

    __abrirCanales(){

        this.a("canal_in", []);
        this.a("canal_out", []);

    }

    __forkProceso(){

        return this.forkProceso(

            "Familia.proceso_daemon",

            {
                canal_in: this.a("canal_in"),
                canal_out: this.a("canal_out")
            }

        )

    }

    __apuntarResultados(){

        this.resultado("canal_in", this.a("canal_in"))
        this.resultado("canal_out", this.a("canal_out"))

    }
    
}

module.exports = PDaemon;
