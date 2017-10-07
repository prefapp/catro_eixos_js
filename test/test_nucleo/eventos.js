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

    it("Controla eventos de porcentaje", function(hecho){

      this.timeout(0);

      let porcentajes = [];
      let hitos = [];

      Procesador.ejecutar(new Tarea("foo2", {
          proceso: "A.escalonado"
      }), {

        eventos: {

          "PORCENTAJE_ACTUALIZADO": (p) => {

            porcentajes.push(p);
          },

          "HITO_ACTUALIZADO": (h) => {
            hitos.push(h);
          }
        }

      }).then(() => {

        expect(porcentajes.length).to.equal(4)
        expect(porcentajes[0]).to.equal(20)
        expect(porcentajes[1]).to.equal(50)
        expect(porcentajes[2]).to.equal(90)
        expect(porcentajes[3]).to.equal(100)

        expect(hitos.length).to.equal(4)
        expect(hitos[0]).to.equal("DUERME_A")
        expect(hitos[1]).to.equal("DUERME_B")
        expect(hitos[2]).to.equal("DUERME_C")
        expect(hitos[3]).to.equal("DUERME_BUCLE")

        hecho();
      })
      .catch((e) => hecho(e))

    })
})
