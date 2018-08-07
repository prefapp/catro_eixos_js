"use strict";

const chai = require("chai");

const expect = chai.expect;
const assert = chai.assert;

const {init, Tarea} = require("../../index.js");

describe("Núcleo - Fork", () => {

    let RP;

    before(() => {

        return init({

            "Familia": __dirname + "/../fixtures/familia_a"

        }).then((refProcesador) => {

            RP = refProcesador;
        })

    })

    it("Se puede hacer un fork de un proceso", function(){

       this.timeout(0);

       const dormir = (t) => {

            return new Promise((cumplida) => setTimeout(cumplida, t))

       };

       return RP.ejecutar(

            new Tarea("", {

                proceso: "Familia.proceso_fork"

            })

        ).then(({resultados}) => {

            let {canal_in, canal_out} = resultados;

            return (async () => {

                let n = canal_in.length;

                await dormir(1000);

                let n2 = canal_in.length;

                expect(n2 > n);               
                
                canal_out.push("SALIR");

                await dormir(1000);

                console.log(canal_in)

                expect(canal_in.pop()).to.equal("FIN");


            })()


        })


    })

})
