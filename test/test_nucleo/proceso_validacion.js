const {Tarea} = require("../../index.js");

const {expect} = require("chai");

const ProcesoValidacionCompleja = require("../fixtures/proceso_validacion_compleja.js");


describe("Núcleo - Validaciones - Proceso", function(){

    it("Se puede ejecutar un proceso con validacion compleja", function(){

        return new ProcesoValidacionCompleja(

            new Tarea("", {

                numero: 123,
                nombre: "Francisco",
                f: function(){},
                a: [1, 2, 3],
                o: {},
                especial: "G"

            })

        ).ejecutar()

    })

    it("Controla errores de argumentos", function(){

        return new ProcesoValidacionCompleja(

            new Tarea("", {

                numero: 123,
                nombre: "Francisco",
                f: function(){},
                a: [1, 2, 3],
                o: {},
                especial: "n"

            })

        ).ejecutar().then(() => {

            throw `No se controlo un parámetro especial`

        }).catch((err) => {

            

        })

    })

})

