"use strict";

const chai = require("chai");

const expect = chai.expect;
const assert = chai.assert;

const CatroEixos = require("../../index.js");
const ProcesoDepurado = require("../fixtures/proceso_depurado.js");

describe("Útiles - Depurado", () => {

    var proceso;

    before((hecho) => {

        proceso = new ProcesoDepurado(

            new CatroEixos.Tarea("test", {

                a: 10,
                b: 10

            })

        );

        hecho();

    })

    describe("Ejecución", () => {

        it("ejecuta normalmente un proceso", (hecho) => {

            proceso.ejecutar()
            
                .then((tarea) => {


                    expect(tarea.resultados["suma"]).to.equal(20);
                    expect(tarea.resultados["resta"]).to.equal(0);
                    expect(tarea.resultados["multiplicacion"]).to.equal(100);
                    expect(tarea.resultados["division"]).to.equal(1);

                    hecho();
                })
                .catch((err) => {
                    console.log(err);
                    hecho(1);
                })

        });

    })

})
