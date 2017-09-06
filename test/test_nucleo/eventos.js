"use strict";

const chai = require("chai");

const expect = chai.expect;
const assert = chai.assert;

const {init, Tarea} = require("../../index.js");

describe("Núcleo - Eventos", () => {

    let Procesador;

    before((hecho) => {

        init({

          "A": __dirname + "/../fixtures/procesos"
        })
          .then((refProcesador) => {

            Procesador = refProcesador;
  
            hecho();

          })

          .catch((err) => hecho(err))

    })

    it("Controla los eventos normales", (hecho) => {


      let eventos = {};

      Procesador.ejecutar( new Tarea("foo", {

          proceso: "A.proceso_test",

          cadena: "a",

        }), 

        {
          eventos: {

            "INICIO_PROCESADO": () => {
              eventos["INICIO_PROCESADO"] = true;
            },

            "FIN_PROCESADO": () => {
              eventos["FIN_PROCESADO"] = true;
            }
          }
        }
      )
        .then(() => {

          expect(eventos["INICIO_PROCESADO"]).to.equal(true);
          expect(eventos["FIN_PROCESADO"]).to.equal(true);

          hecho();
        })
    })

    it("Controla eventos en caso de error en validacion", function(hecho){

      let eventos =  {};

      Procesador.ejecutar(new Tarea("foo2", {

          proceso: "A.proceso_test",

      }), {

        eventos: {

          "INICIO_PROCESADO": () => {
            eventos["INICIO_PROCESADO"] = true;
          },
          "FIN_PROCESADO": () => {
            eventos["FIN_PROCESADO"] = true;
          }

        }

      })
  
        .then(() => hecho("NO_DEBE_LLEGAR_AQUI"))

        .catch((err) => {
    
          expect(eventos["INICIO_PROCESADO"]).to.equal(true);
          expect(eventos["FIN_PROCESADO"]).to.equal(true);
  
          hecho();
        })

    })

    it("Controla eventos en caso de error en ejecucion", function(hecho){

      let eventos =  {};

      Procesador.ejecutar(new Tarea("foo3", {

          proceso: "A.proceso_test",
          cadena: "FALLA"

      }), {

        eventos: {

          "INICIO_PROCESADO": () => {
            eventos["INICIO_PROCESADO"] = true;
          },
          "FIN_PROCESADO": () => {
            eventos["FIN_PROCESADO"] = true;
          }

        }

      })
  
        .then(() => hecho("NO_DEBE_LLEGAR_AQUI"))

        .catch((err) => {
    
          expect(eventos["INICIO_PROCESADO"]).to.equal(true);
          expect(eventos["FIN_PROCESADO"]).to.equal(true);
  
          hecho();
        })

    })
})
