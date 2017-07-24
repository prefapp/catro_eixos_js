"use strict";

const chai = require("chai");

const expect = chai.expect;
const assert = chai.assert;

const CatroEixos = require("../../index.js");

const utiles = require("../fixtures/utiles.js");

describe("Núcleo - Base", () => {

    let Procesador;

    before((hecho) => {

        hecho();

    })

    describe("Init", () => {

        it("inicializa correctamente un procesador", (hecho) => {

            CatroEixos.init({

                "A": __dirname + "/../fixtures/familia_a"

            })

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

                return Procesador.ejecutar(

                    utiles.tarea("A.minusculas", tarea.args)

                );

            }).then((tarea) => {

                expect(tarea.resultados.cadena).to.equal("hola");

                hecho();

            }).catch((err) => {
            
                console.log(err);

                hecho(1);
            })
            

        })

        it("Controla la carga de un proceso erroneo", (hecho) => {

            CatroEixos.init({

                "Test" : __dirname +  "/../fixtures"

            })
            .then((c) => {

                hecho(1);
            })
            .catch((e) => {

                console.log(e);

                hecho();

            })

        })

    })

})
