const {expect} = require("chai");

const {
    ProcesoSinKo,
    ProcesoPetaConstructor,
    ProcesoPeteInterno,
    ProcesoErrorEnOk

} = require("../fixtures/procesos/procesos_erroneos.js");

const {Procesador, Tarea, init} = require("../../index.js");

describe("Se controlan los errores", function() {

    let P;

    before(function(){

        P = new Procesador({

            ProcesoSinKo,
            ProcesoPetaConstructor,
            ProcesoPeteInterno,
            ProcesoErrorEnOk

        })

    })

    it("Error en constructor", function(hecho){

        P.ejecutar(
            new Tarea("", {proceso: "ProcesoPetaConstructor"})
        )

        .then(() => {
            console.log("Error: en ProcesoPetaConstructor");
            hecho(1);
        })
        .catch((err) => {
            console.log(err);
            hecho();
        })
    })

    it("Error interno de specs", function(hecho){

        P.ejecutar(
            new Tarea("", {proceso: "ProcesoPeteInterno"})
        )

        .then(() => {
            console.log("Error: en ProcesoPeteInterno");
            hecho(1);
        })
        .catch((err) => {
            console.log(err);
            hecho();
        })

    })

    it("Error sin ko", function(hecho){

        P.ejecutar(
            new Tarea("", {proceso: "ProcesoSinKo"})
        )

        .then(() => {
            console.log("Error: en ProcesoSinKo");
            hecho(1);
        })
        .catch((err) => {
            console.log(err);
            hecho();
        })
    })

    it("Error en ok", function(hecho){

        P.ejecutar(
            new Tarea("", {proceso: "ProcesoErrorEnOk"})
        )
        .then(() => {
            console.log("Error: en ProcesoErrorEnOk");
            hecho(1);
        })

        .catch((err) => {
            console.log(err);
            hecho();
        })
    })

    it("Error en subproceso (VALIDACION)", function(hecho){

      init({
        "A": __dirname + "/../fixtures/procesos"
      })
        .then((refProcesador) => {

          return refProcesador.ejecutar(

            new Tarea("", {proceso: "A.complejo_error", familia: "A"})

          )

        })

        .then(() => {
          hecho("NO_DEBIO_LLEGAR_A_ESTE_PUNTO");
        })

        .catch(({resultados}) => {

          expect(resultados.estado).to.equal("KO");

          hecho();
        })
      

    })

    it("Error en subproceso ", function(hecho){

      init({
        "A": __dirname + "/../fixtures/procesos"
      })
        .then((refProcesador) => {

          return refProcesador.ejecutar(

            new Tarea("", {proceso: "A.complejo_error", familia: "A", continuar: true})

          )

        })

        .then(() => {
          hecho("NO_DEBIO_LLEGAR_A_ESTE_PUNTO");
        })

        .catch(({resultados}) => {

          expect(resultados.estado).to.equal("KO");

          expect(resultados.error.match(/FALLO/)[0]).to.equal("FALLO")

          hecho();
        })
      

    })
})
