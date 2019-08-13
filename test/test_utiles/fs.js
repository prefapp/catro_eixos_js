"use strict";

const chai = require("chai");

const expect = chai.expect;
const assert = chai.assert;

const CatroEixos = require("../../index.js");
const ProcesoFS = require("../fixtures/proceso_fs.js");

describe("Útiles - FS", () => {

    var proceso;

    before((hecho) => {

        proceso = new ProcesoFS(

            new CatroEixos.Tarea("test", {

                ruta: "/tmp/foo_" + String(Math.floor(Math.random() * (33 - 1)) + 1)

            })

        );

        hecho();

    })

    it("Se pueden realizar los fundamentales de fs", function(){

        return proceso.ejecutar();

    })

})
