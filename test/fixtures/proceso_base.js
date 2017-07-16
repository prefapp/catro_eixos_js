"use strict";

const CatroEixos = require("../../index.js");

class ProcesoBase extends CatroEixos.Proceso {

 //   DEPURAR() {return true}

    __r(){

        return [

            "__sumarCifras",
            "__restarCifras",
            "__multiplicarCifras",
            "__dividirCifras",
            "__terminado"
        ]
    }

    __sumarCifras(){

        this.resultado(

            "suma",

            this.arg("a") + this.arg("b")
        );

    }
        OK__sumarCifras(){
            this.resultado("sumar", "realizado");
        }

        KO__sumarCifras(){
            this.resultado("sumar", "no_realizado");
        }


    PRE__restarCifras(){
        this.resultado("pre_restar", "realizado");
    }

    __restarCifras(){

        this.resultado(
            
            "resta",

            this.arg("a") - this.arg("b")
        );

    }

    __multiplicarCifras(){

        return new Promise((cumplida) => {
        
            this.resultado(
        
                "multiplicacion",

                this.arg("a") * this.arg("b")           

            );

            cumplida();
        });
    }

    __dividirCifras(){

        if(this.arg("b") == 0)
            throw "INTENTO_DE_DIVISION_POR_CERO";

        this.resultado(

            "division",

            this.arg("a") / this.arg("b")

        );
    }
    
        KO__dividirCifras(e){
            this.error(e);
        }

    __terminado(){
        this.resultado("hito", "terminado");
    }

}

module.exports = ProcesoBase;
