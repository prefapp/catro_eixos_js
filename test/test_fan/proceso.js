"use strict";

const chai = require("chai");

const expect = chai.expect;
const assert = chai.assert;

const CatroEixos = require("../../index.js");

describe("Fan - Proceso", () => {

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

    it("Permite ejecutar un lote de acciones", function(){

        this.timeout(0);

        return Procesador.ejecutar(

            new CatroEixos.Tarea("foo", {

                proceso: "A.fan",

                cadena: "abcdefghijk"

            })

        ).catch((err) => {

            console.log(err)

        })

    })
})
