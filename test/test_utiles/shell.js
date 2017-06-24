"use strict";

const chai = require("chai");

const expect = chai.expect;
const assert = chai.assert;

const CatroEixos = require("../../index.js");
const Shell = require("../fixtures/shell/entrada.js");

const {tarea} = require("../fixtures/utiles.js")

describe("Núcleo - Útiles - Shell", () => {

    var procesador;

    before((hecho) => {

        procesador = new CatroEixos.Procesador({

            "Shell.entrada" : Shell.Entrada,

            "Shell.crearRuta": Shell.CrearRuta,
        
            "Shell.crearFichero": Shell.CrearFichero,

            "Shell.leerFichero": Shell.LeerFichero,

            "Shell.borrarFichero": Shell.BorrarFichero

        });       

        hecho();

    })

    describe("Ejecución", () => {

        it("ejecuta normalmente un proceso que usa subprocesos", (hecho) => {

            procesador.ejecutar(

                tarea(

                    "Shell.entrada",

                    {
                        ruta: "/tmp/foo_test_shell",

                        datos: "{a:1, b:2, c:3}"
                    }

                )

            )

            .then(() => {

                hecho();    
            })

            .catch((err) => {

                console.log(err);
            
                hecho(1);
            })


        })

    })
})
