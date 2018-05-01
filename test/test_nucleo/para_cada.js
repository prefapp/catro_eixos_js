"use strict";

const chai = require("chai");

const expect = chai.expect;
const assert = chai.assert;

const CatroEixos = require("../../index.js");
const ProcesoCada = require("../fixtures/proceso_cada.js");

describe("Núcleo - ParaCada", function() {

    var proceso;

    before(function(hecho) {

        proceso = new ProcesoCada(

            new CatroEixos.Tarea("test", {

                numero: 10,
                ruta: "/tmp/.bloquear",
                espera: 500

            })

        );

        hecho();

    })

   it("ejecuta normalmente un metodo", function(hecho) {

        this.timeout(0);

       proceso.ejecutar().then(({resultados}) => {

            expect(resultados.rr).to.be.an("array");

            expect(

                resultados.rr.filter(e => e.match(/^\d+\s+ejecutada$/)).length

            ).to.equal(10);

            hecho();

       })
       .catch((err) => {
           console.log(err);
           hecho(1);
       })

   });


})
