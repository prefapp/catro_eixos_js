"use strict";

const chai = require("chai");

const expect = chai.expect;
const assert = chai.assert;

const CatroEixos = require("../../index.js");
const FamiliaA = require("../fixtures/familia_a.js");

const utiles = require("../fixtures/utiles.js");

describe("Núcleo - Base", () => {

    let Procesador;

    before((hecho) => {

        hecho();

    })

    describe("Init", () => {

        it("inicializa correctamente un procesador", (hecho) => {

            CatroEixos.init([FamiliaA])

                .then((procesador) => {

                    expect(procesador.procesos).to.have.any.keys("A.mayusculas");

                    Procesador = procesador;

                    hecho();
                })

                .catch((err) => {
                    console.log(err);
                    hecho(1);
                })
        });

        it("El procesador inicializado es funcional", (hecho) => {

            Procesador.ejecutar(

                utiles.tarea("A.mayusculas", {cadena: "hola"})

            ).then((tarea) => {

                expect(tarea.resultados.cadena).to.equal("HOLA");

                return tarea;
                
            }).then((tarea) => {

                tarea.args.proceso = "A.minusculas";

                return Procesador.ejecutar(tarea);

            }).then((tarea) => {

                expect(tarea.resultados.cadena).to.equal("hola");

                hecho();

            }).catch((err) => {
            
                console.log(err);

                hecho(1);
            })
            

        })

    })

})
