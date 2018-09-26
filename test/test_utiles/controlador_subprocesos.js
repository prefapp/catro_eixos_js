"use strict";

const chai = require("chai");

const expect = chai.expect;
const assert = chai.assert;

const {init, Tarea} = require("../../index.js");

describe("Utiles - ControladorSubprocesos", () => {

    let RP;

    before(function(){

        return init({

            "Familia": __dirname + "/../fixtures/familia_controlador_subprocesos"

        }).then((refProcesador) => {

            RP = refProcesador;
        })

    })

	it("Permite el control de un subproceso", function(hecho){

		this.timeout(0);

		let letra;

		let f_control = function(){

			return letra;

		}

		let t = new Tarea("", {

			proceso: "Familia.principal",

			callback_control: f_control,

		});

		let r;

		RP.ejecutar(t).then(({resultados}) => {

			r = resultados;

		}).then(() => {

			console.log("Proceso terminado")

			hecho();

		})

		Promise.resolve().then(() => {

			letra = "A";
			
			return helper_esperar(50);

		}).then(() => {

			expect(t.resultados.porcentaje_completado).to.equal(30);
			expect(t.resultados.hito).to.equal("A_COMPLETADO");

		}).then(() => {

			letra = "B";

			return helper_esperar(500);

		}).then(() => {

			expect(t.resultados.porcentaje_completado).to.equal(60);
			expect(t.resultados.hito).to.equal("B_COMPLETADO");
			expect(t.resultados.donde).to.equal("B");

		}).then(() => {

			letra = "D"

			return helper_esperar(3500);

		}).then(() => {

			expect(t.resultados.porcentaje_completado > 60 && 
					t.resultados.porcentaje_completado <= 90 
				).to.equal(true);

			expect(t.resultados.hito).to.equal("D_COMPLETADO");

		}).then(() => {

			letra = "E"

			return helper_esperar(500);
		
		}).catch((err) => {

			hecho(err);
		})
	})


})

function helper_esperar(ms){

	return new Promise((cumplida) => setTimeout(cumplida, ms))

}
