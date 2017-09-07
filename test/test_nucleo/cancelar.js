"use strict";

const chai = require("chai");

const expect = chai.expect;
const assert = chai.assert;

const {init, Tarea} = require("../../index.js");

describe("Núcleo - Cancelar", () => {

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

    it("Permite cancelar un proceso", (hecho) => {

      setTimeout(() => {

        Procesador.getProcesoEnEjecucion("escalonado")

          .cancelar();

      },500)

      Procesador.ejecutar( new Tarea("escalonado", {

          proceso: "A.escalonado",

        }), 
      )
        .then(() => {

          hecho("NO_DEBE_LLEGAR_AQUI");
        })
        .catch(({resultados}) => {

          expect(resultados.error).match(/CANCELADO/);
          expect(resultados.A).to.equal(true);
          expect(resultados.B).to.equal(undefined);
          expect(resultados.C).to.equal(undefined);
          expect(resultados.BUCLE).to.equal(undefined);

          hecho();
        })
    })

    it("Permite cancelar un subproceso", function(hecho){

      this.timeout(0);

      setTimeout(() => {

        Procesador.getProcesoEnEjecucion("escalonado2")
        
          .cancelar()

      }, 500)

      Procesador.ejecutar(new Tarea("escalonado2", {

        proceso: "A.llama_a_otro",

        llama_a: "A.escalonado"

      }))
        .then(() => {
          hecho("NO_DEBE_LLEGAR_AQUI");
        })

        .catch(({resultados}) => {

          expect(resultados.error).match(/CANCELADO/);
          expect(resultados.A).to.equal(undefined);
          expect(resultados.B).to.equal(undefined);
          expect(resultados.C).to.equal(undefined);
          expect(resultados.BUCLE).to.equal(undefined);

        

          hecho();
        })

    })

})
