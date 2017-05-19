"use strict";

const chai = require("chai");

const expect = chai.expect;
const assert = chai.assert;

const CatroEixos = require("../../index.js");
const ProcesoPaso = require("../fixtures/proceso_paso.js");

describe("Núcleo - Base", () => {

    var proceso;

    before((hecho) => {

        proceso = new ProcesoPaso(

            new CatroEixos.Tarea("test", {

                cifra: 22

            })

        );

        hecho();

    })

    describe("Ejecución", () => {

        it("ejecuta normalmente un proceso que pasa valores intermedios", (hecho) => {

            proceso.ejecutar()

                .then((tarea) => {

                    expect(tarea.resultados.cifra_final).to.equal(26);

                    hecho();
                })

                .catch((tarea) => {
                    console.log(tarea);
                    hecho(1);
                })

        })

    })

})
