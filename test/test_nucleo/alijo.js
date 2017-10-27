"use strict";

const chai = require("chai");

const expect = chai.expect;
const assert = chai.assert;

const CatroEixos = require("../../index.js");
const ProcesoBaseAlijo = require("../fixtures/procesos/alijo.js");
describe("Núcleo - Alijo", () => {

  it("Permite ejecutar un proceso que emplea alijos", function(hecho){

    new ProcesoBaseAlijo(
      new CatroEixos.Tarea("test")
    )
    .ejecutar()
    .then(({resultados}) => {

      expect(resultados.cifra).to.equal(22);

      hecho(0);
    })

    .catch((err) => {
      console.log(err);
      hecho(1);
    })

  })

})
