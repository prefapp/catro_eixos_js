const {Tarea, Proceso} = require("../../../index.js");


module.exports = class extends Proceso{

	parametrosNecesarios(){

		return {

			"callback_control": Function,

		}

	}

	__r(){

		return [

			"__lanzarA"

		]


	}

	__lanzarA(){

		return this.subProceso(


			"Familia.a", {

				callback_control: this.arg("callback_control")


			},

			{
				controladorSubprocesos: {

					"Familia.a.__a": {

						porcentaje: 30,

						hito: "A_COMPLETADO"

					},

					"Familia.a.__b": {

						porcentaje: 60,

						hito: "B_COMPLETADO",
		
						a_resultado: (refSubProceso) => {

							this.resultado("donde", refSubProceso.a("estoy_en"));

						}

					},

					"Familia.b.__d": {

	//					porcentaje: 90,

						porcentaje_progresivo: {

							desde: 60,

							hasta: 90,

							tiempo: 100

						},

						hito: "D_COMPLETADO"

					}

				}
			}
		)


	}


}
