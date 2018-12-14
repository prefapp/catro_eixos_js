const Modulo = require("../fixtures/modulo");

const {expect} = require("chai");

describe("Test de carga de un modulo", function(){

	it("Permite cargar un modulo", function(){

		let V = false;

		return Modulo({

			boot_args: {
			
				confirmacion: (v) => {

					V = v;
				}
			}

		}).then(() => {

			expect(V).to.be.an("string");

			expect(V).to.equal("BOOT_REALIZADO");

		})


	})


})
