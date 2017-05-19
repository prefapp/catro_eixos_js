"use strict";

const chai = require("chai");

const expect = chai.expect;
const assert = chai.assert;

const CatroEixos = require("../../index.js");
const FamiliaA = require("../fixtures/familia_a.js");

describe("Núcleo - Base", () => {

    var familia;

    before((hecho) => {

        familia = new FamiliaA();

        hecho();

    })

    describe("Familia de procesos", () => {

        it("carga una familia de procesos", (hecho) => {

            familia.cargar()
 
                .then((familia) => {

                    expect(familia).to.contain.all.keys([

                        "A.mayusculas",
                        "A.minusculas"

                    ]);

                    hecho();
                })
                .catch((err) => {
                    console.log(err);
                    hecho(1);
                })

        });

    })

})
