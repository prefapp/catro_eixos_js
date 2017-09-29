"use strict";

const chai = require("chai");

const expect = chai.expect;
const assert = chai.assert;

const CatroEixos = require("../../index.js");

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
                  console.log(err);
                  hecho(1);
              })
    });

   it("El procesador inicializado es funcional", (hecho) => {

     let tTranscurrido;

     Procesador.ejecutar(

       new CatroEixos.Tarea('', {

         proceso: "A.proceso_dormilon",
         duerme: 1000,
         enDespertar: () => {}

       })

     )
        .then(({resultados}) => {

          expect(resultados.tTranscurrido > 1000).to.equal(true)
      
          hecho();
        })
   })

})
