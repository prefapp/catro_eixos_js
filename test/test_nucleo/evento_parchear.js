const {expect} = require("chai");

const CatroEixos = require("../../index.js");

describe("Núcleo - Procesador - Evento parchear", () => {

    var procesador;

    before(() => {

		return CatroEixos.init({

			"Familia": __dirname + "/../fixtures/familia_a"

		}).then((refProcesador) => procesador = refProcesador)

    })

	it("Permite un acceso al objeto proceso antes de su ejecucion", function(){

		return procesador.ejecutar(

			new CatroEixos.Tarea(

				"",

				{
					proceso: "Familia.mayusculas",
					cadena: "FOOO"
				}

			),

			{
				parchear: (instanciaProceso) => {

					expect(instanciaProceso instanceof CatroEixos.Proceso).to.equal(true);

					Object.defineProperty(instanciaProceso,

						"__aMayusculas",

						{
							value: function(){

								this.resultado("cadena", "SIN_TOCAR");
							}
						}

					)

				}
			}

		).then(({resultados}) => {

			expect(resultados.cadena).to.equal("SIN_TOCAR");

		})


	})
})
