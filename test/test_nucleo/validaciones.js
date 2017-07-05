"use strict";

const chai = require("chai");

const expect = chai.expect;
const assert = chai.assert;

const CatroEixos = require("../../index.js");
const ProcesoValidacion = require("../fixtures/proceso_validacion.js");
const utiles = require("../fixtures/utiles.js");

describe("Núcleo - Base", () => {

    describe("Validaciones", () => {

        it("valida correctamente los parámetros necesarios", (hecho) => {

            new ProcesoValidacion(

                utiles.tarea("foo", {a:1, b:2, c:3})

            ).ejecutar()

                .then(() => {

                    hecho();

                })
                .catch((err) => {
                    console.log(err);
                    hecho(1);
                })

        });

        it("valida correctamente la falta de parámetros necesarios", (hecho) => {

            new ProcesoValidacion(

                utiles.tarea("foo", {a:1, c:3})

            ).ejecutar()

                .then(() => {
                
                    hecho(1);
                })

                .catch((tarea) => {

                    expect(tarea.resultados.estado).to.equal("KO");
        
                    hecho();
                })

        })

        it("realiza correctamente metodos de validacion", (hecho) => {

            new ProcesoValidacion(

                utiles.tarea("foo", {a: "no_numero", b:2, c:3})

            ).ejecutar()
    
            .then(() => {

                hecho(1);
            })

            .catch((tarea) => {

                expect(tarea.resultados.estado).to.equal("KO");
                expect(tarea.resultados.error).to.match(/A_NO_ES_NUMERICO/);

                hecho();
            })

        })

        it("realiza correctamente metodos de validacion diferidos", (hecho) => {

            new ProcesoValidacion(

                utiles.tarea("foo", {a:1, b: "no_numero", c:3})

            ).ejecutar()

            .then(() => {

                hecho(1);
            })

            .catch((tarea) => {

                expect(tarea.resultados.estado).to.equal("KO");
                expect(tarea.resultados.error).to.match(/B_NO_ES_NUMERICO/);

                hecho();
            })

        })

    })

})
