"use strict";

const chai = require("chai");

const expect = chai.expect;
const assert = chai.assert;

const CatroEixos = require("../../index.js");

const utiles = require("../fixtures/utiles.js");

describe("Núcleo - Base", () => {

    let Procesador;

    before((hecho) => {

            CatroEixos.init({

                "A": __dirname + "/../fixtures/procesos"

            })

                .then((procesador) => {
                  Procesador = procesador;
                  hecho();
                })

                .catch((err) => {
                    hecho(err);
                })
    });

    it("Permite ejecutar un lote de acciones", function(hecho){

      Procesador.ejecutar(

        new CatroEixos.Tarea("lote", {
          proceso: "A.lote",
          numero: 10
      })

      )
        .then(({resultados}) => {

          expect(resultados.suma).to.equal(11);
          expect(resultados.resta).to.equal(8);
          expect(resultados.multiplicacion).to.equal(30);

          hecho();
        })

        .catch((err) => {
          hecho(err);
        })

    })
})
