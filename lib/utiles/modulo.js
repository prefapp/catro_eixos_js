const Tarea = require("../nucleo/tarea.js");

module.exports = class {

	constructor(init, opciones = {}){

		this.init = init;

		this.boot = opciones.boot;

		this.procesador = {};

	}

	cargar(opciones = {}){

		return (args = {}) => {
    
			return this.init(opciones)

				.then((procesador) => {

					this.procesador = procesador;

					if(this.boot){

						return this.ejecutar(

							this.boot,

							args.boot_args || {},

						).then(() => {

							return procesador;

						})

					}
					else	
						return procesador;


				}).then(() => {

					return {

						ejecutar: (proceso, args) => {

							return this.ejecutar(proceso, args);

						}

					}

				})

		}

	}

	ejecutar(proceso, args){

		return this.procesador.ejecutar(

			new Tarea("", {

				proceso,

				...args

			})

		)

	}


}
