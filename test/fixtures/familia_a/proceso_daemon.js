"use strict";

const CatroEixos = require("../../../index.js");

class PDaemon extends CatroEixos.Proceso {

    parametrosNecesarios(){

        return [

            "canal_in",
            "canal_out"

        ]

    }

    __r(){

        return [

            "__bucle"
        ]
    }

    __bucle(){

        return (async () => {

            let ok = false;

            let i = 0;

            while(!ok){

                this.arg("canal_in").push(i++);

                if(this.arg("canal_out").shift() == "SALIR"){
                    this.arg("canal_in").push("FIN");
                    ok = true;
                }
                else{
                    await this.__esperar(0.75);
                }
                

            }

        })()

    }
}

module.exports = PDaemon;
