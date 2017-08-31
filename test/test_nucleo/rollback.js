"use strict";

const chai = require("chai");

const expect = chai.expect;
const assert = chai.assert;

const CatroEixos = require("../../index.js");

const fs = require("fs");

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

    it("Permite ejecutar un rollback", function(hecho){

      Procesador.ejecutar(

        new CatroEixos.Tarea("rollback", {
          proceso: "A.rollback",
          ruta: "/tmp"
      })

      )
        .then(() => {

          hecho("NO DEBE LLEGAR AQUÍ");
        })

        .catch(({resultados}) => {

          expect(fs.existsSync(resultados.dir)).to.equal(false);

          hecho();
        })

    })
})
