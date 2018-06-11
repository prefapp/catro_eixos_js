"use strict";

const chai = require("chai");

const expect = chai.expect;
const assert = chai.assert;

const CatroEixos = require("../../index.js");
const ProcesoFinalizar = require("../fixtures/proceso_finalizar.js");

describe("Núcleo - Finalizar", function() {

   it("Un proceso se puede finalizar antes", function() {

        this.timeout(0);

        return new ProcesoFinalizar(

            new CatroEixos.Tarea("test", {

 //               en_uno: true


            })


        ).ejecutar()

        .then(({resultados}) => {

            console.log(resultados)

        })

   });


})
