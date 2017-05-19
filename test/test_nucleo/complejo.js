"use strict";

const chai = require("chai");

const expect = chai.expect;
const assert = chai.assert;

const CatroEixos = require("../../index.js");
const Complejo = require("../fixtures/complejo.js");

describe("Núcleo - Complejo", () => {

    var procesador;

    before((hecho) => {

 
        procesador = new CatroEixos.Procesador({

            "Complejo.padre" : Complejo.ProcesoComplejo,

            "Complejo.crearFichero": Complejo.ProcesoCrearFichero,
            "Complejo.volcarFichero": Complejo.ProcesoVolcarDatos,
            "Complejo.leerFichero": Complejo.ProcesoLeerFichero
        });       

        hecho();

    })

    describe("Ejecución", () => {

        it("ejecuta normalmente un proceso que usa subprocesos", (hecho) => {

            procesador.ejecutar(new CatroEixos.Tarea("test", {

                proceso: "Complejo.padre",

                ruta_fichero: "/tmp/foo",

                datos: "LINEA_LINEA_LINEA"

            }))

            .then((tarea) => {

                expect(tarea.resultados.leido).to.be.equal("LINEA_LINEA_LINEA");

                hecho();    
            })

            .catch((err) => {

                console.log(err);
            
                hecho(1);
            })


        })

    })

})
