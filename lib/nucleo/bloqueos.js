class Bloqueos{

	constructor(){

		this.__bloqueos = {};

	}

	bloquear(recurso, opciones){

		if(!this.__bloqueos[recurso])
			this.__bloqueos[recurso] = new Bloqueo(recurso);

		return this.__bloqueos[recurso].bloquear(opciones);

	}

	desbloquear(recurso){

		if(!this.__bloqueos[recurso])
			throw `BLOQUEOS: intento de desbloqueo de recurso inexistente: ${recurso}`
	
		this.__bloqueos[recurso].desbloquear();

		if(!this.__bloqueos[recurso].tienePendientes())
			delete this.__bloqueos[recurso];

	}

}

class Bloqueo{

	constructor(nombre){

		this.nombre = nombre;

		this.__bloqueado = false;

		this.__pendientes = 0;

	}

	tienePendientes(){

		return this.__pendientes > 0;

	}

	bloquear(opciones = {}){

		if(!this.__bloqueado) {

			this.__bloqueado = true;		

			return Promise.resolve();

		}

		return this.__bloquear(opciones);
	}

	desbloquear(){

		this.__bloqueado = false;
	}


	__bloquear(opciones){

		this.__pendientes++;

		const f_test_bloqueado = () => {

			if(this.__bloqueado){

				return new Promise((cumplida) => {

					setTimeout(() => {

						cumplida(false);

					}, 1000);

				})

			}
			else{

				this.__bloqueado = true;

				return Promise.resolve(true);

			}

		}

		return (async () => {

			let limite = opciones.timeout || -1;

			let ok = false;

			while(!ok){

				ok = await f_test_bloqueado();

				if(!ok && limite > -1){

					limite -= 1;

					if(limite < 1)
						throw `TIMEOUT BLOQUEO ${this.nombre}`

				}

			} 

			return this.__bloqueado--;

		})()

	}
}

module.exports = {
	Bloqueos,
	Bloqueo
}


