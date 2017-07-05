"use strict";

const chai = require("chai");

const expect = chai.expect;
const assert = chai.assert;

const CatroEixos = require("../../index.js");
const ProcesoBase = require("../fixtures/proceso_base.js");

describe("Núcleo - Base", () => {

    var proceso;

    before((hecho) => {

        proceso = new ProcesoBase(

            new CatroEixos.Tarea("test", {

                a: 10,
                b: 10

            })

        );

        hecho();

    })

    describe("Ejecución", () => {

        it("ejecuta normalmente un metodo", (hecho) => {

            new CatroEixos.Ejecutor(proceso).ejecutar(
             
               "__sumarCifras"

            )
            .then(() => {

                let suma = proceso.tarea.resultados["suma"];
                let sumar = proceso.tarea.resultados["sumar"];

                expect(suma).to.equal(20);
        
                expect(sumar).to.equal("realizado");

                hecho();

            })
            .catch((err) => {
                console.log(err);
                hecho(1);
            })

        });

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

        it("controla adecuadamente los errores base", (hecho) => {

            proceso.tarea = new CatroEixos.Tarea(
                
                "test",

                {
                    a : 10,
                    b: 0
                } 

            );

            proceso.ejecutar()

                .then((tarea) => {
                    console.log(tarea);
                    hecho(1);
                })

                .catch((tarea) => {
        
                    expect(tarea.resultados.suma).to.equal(10);
                    expect(tarea.resultados.multiplicacion).to.equal(0);
                    expect(tarea.resultados.estado).to.equal("KO");
                    expect(tarea.resultados.error).to.match(/INTENTO_DE_DIVISION_POR_CERO/);
                    expect(tarea.resultados.hito).to.be.undefined;
                    
                    hecho();
                })

        })

    })

})
