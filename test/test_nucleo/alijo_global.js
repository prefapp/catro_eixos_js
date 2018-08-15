const {expect} = require("chai");

const {init, Tarea} = require("../../index.js"); 


describe("Nucleo - Alijo Global", function(){

    let Procesador;

    before(function(){

        return init({

            "P": __dirname + "/../fixtures/familia_alijo"

        }).then((refProcesador) => {

            Procesador = refProcesador;

        })

    })

    it("Permite realizar inserciones en el alijo global", function(){

        return Procesador.ejecutar(

            new Tarea("", {

                proceso: "P.a",

                inicio: 1, 

                hasta: 10

            })

        )

    })

    it("Permite que otro proceso pueda recoger el valor del alijo global", function(){

        return Procesador.ejecutar(

            new Tarea("", {

                proceso: "P.b"

            })

        ).then(({resultados}) => {

            expect(resultados.valor).to.equal(11);

        })

    })

})
