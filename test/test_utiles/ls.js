"use strict";

const chai = require("chai");

const expect = chai.expect;
const assert = chai.assert;

const CatroEixos = require("../../index.js");
const ProcesoLs = require("../fixtures/proceso_ls.js");

describe("Núcleo - Base", () => {

    var proceso;

    before((hecho) => {

        proceso = new ProcesoLs(

            new CatroEixos.Tarea("test", {

                ruta: __dirname + "/../"

            })

        );

        hecho();

    })

    describe("Ejecución", () => {

        it("ejecuta normalmente un metodo comandoShell", (hecho) => {

            proceso.ejecutar()

            .then((tarea) => {

                let entradas = tarea.resultados.entradas;

                expect(entradas).to.be.an("array").that.includes("fixtures");

                hecho();
            })
            .catch((tarea) => {

                console.log(tarea.resultados);

                hecho(1);
    
            })

        });

    })

})
