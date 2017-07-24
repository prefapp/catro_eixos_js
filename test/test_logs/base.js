"use strict";

const chai = require("chai");

const expect = chai.expect;
const assert = chai.assert;

const CatroEixos = require("../../index.js");

const utiles = require("../fixtures/utiles.js");

describe("Logs - Base", () => {

    let Procesador;

    before((hecho) => {

        hecho();

    })

    it("inicializa correctamente un procesador", (hecho) => {

        CatroEixos.init({

            "A": __dirname + "/../fixtures/familia_a"

        }, {logs: {loguear: ["TODO"]}})

            .then((procesador) => {

                expect(procesador.procesos).to.have.any.keys("A.mayusculas");

                Procesador = procesador;

                hecho();
            })

            .catch((err) => {
                console.log(err);
                hecho(1);
            })
    });

    it("Permite ejecutar una accion", (hecho) => {

        Procesador.ejecutar(

            utiles.tarea("A.mayusculas", {cadena: "hola"})

        )

        .then(() => {
            hecho();
        })


    })

})
