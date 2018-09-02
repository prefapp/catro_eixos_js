const {expect} = require("chai");

const {init, Tarea} = require("../../index.js"); 

describe("Nucleo - Bloqueos", function(){

    let Procesador;

    before(function(){

        return init({

            "P": __dirname + "/../fixtures/familia_bloqueos"

        }).then((refProcesador) => {

            Procesador = refProcesador;

        })

    })

    it("Permite controlar los accesos a un bloqueo", function(){

		this.timeout(0);

		const f = (id) => {

			return Procesador.ejecutar(

				new Tarea("", {

					proceso: "P.base",

					identificador: id

				})

			)

		}

		const pp = "t1,t2,t3,t4,t5,t6,t7,t8,t9,t10,t11,t12,t13,t14".split(/\,/).map((id) => {

			return f(id);

		})

		return Promise.all(pp).then(() => {


		})

    })

})
