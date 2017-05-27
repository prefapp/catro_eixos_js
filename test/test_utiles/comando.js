"use strict";

const chai = require("chai");

const expect = chai.expect;
const assert = chai.assert;

const CatroEixos = require("../../index.js");
const Comando = require("../../lib/utiles/comando.js");

describe("Utiles - Comando", () => {

    describe("Ejecución", () => {

        it("ejecuta normalmente un metodo", (hecho) => {

            new Comando("ls", ["/"], {

                soloSalida: true

            }).lanzar()

            .then((datos) => {

                console.log(datos);

                hecho();
            })
    
            .catch((err, codigErr) => {

                console.log(err);

                hecho(1);
            })
            

        });

    })

})
