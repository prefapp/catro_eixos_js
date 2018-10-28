/*Permite exponer un procesador como una interfaz de trabajo*/

const Tarea = require("../nucleo/tarea.js");

module.exports = class {

	constructor(init, extremos = {}, procesoInit = false){

		this.init = init;
		
		this.extremos = extremos;

		this.procesoInit = procesoInit;

		this.refProcesador = {};

	}

	iniciar(args){

		return this.init().then((refProcesador) => {
		
			this.refProcesador = refProcesador;

		}).then(() => {
		
			if(this.procesoInit){

				return this.__ejecutarProceso(
					
					this.procesoInit.proceso,
	
					args

				)
			}

		}).then(() => {

			const interfaz = {};

			Object.keys(this.extremos).forEach((metodo) => {
			
				const e = this.extremos[metodo];

				const _self = this;

				interfaz[metodo] = function(args){

					if(e.tratarArgs){
						args = e.tratarArgs(arguments);
					}

					return _self.__ejecutarProceso(
					
						e.proceso,

						args
					
					).then((resultados) => {
					
						if(e.tratarResultados){
							return e.tratarResultados(resultados);
						}
						else{
							return resultados;
						}
					})

				}
			
			})

			console.log(interfaz)

			return interfaz;
		
		})

	}

	__ejecutarProceso(proceso, args = {}){

		return this.refProcesador.ejecutar(
		
			new Tarea(
			
				"",

				{
					proceso,

					...args
				}

			)
		
		).then(({resultados}) => {
		
			return resultados;
		
		})

	}

}
