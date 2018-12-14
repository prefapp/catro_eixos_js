const Modulo = require("../fixtures/modulo");

const {init, Tarea} = require("../../index.js");

const {expect} = require("chai");

describe("Instalación y ejecucion de un módulo", function(){

	it("Permite arrancar modulos y pasarlos al sistema", function(){
		
		return Modulo().then((m) => {

			return init({
				
				"P": __dirname + "/../fixtures/modulo/principal"

			}, {

				modulos: {

					"MODULO": m

				}

			}).then((procesador) => {

				return procesador.ejecutar(

					new Tarea(

						"", {

							"proceso": "P.operaciones",

							"a": 20,

							"b": 20

						}

					)

				).then((p) => {

					console.log(p)
				})

			})

		})
		


	})

})
