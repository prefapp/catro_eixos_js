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

		this.__pendientes = []

		this.__hayPendientes = false;

	}

	tienePendientes(){

		return this.__hayPendientes;

	}

	bloquear(opciones = {}){
	
		let c = !this.__bloqueado && (this.__bloqueado = true);

		this.__hayPendientes = true;

		if(c){

			return Promise.resolve();
		}
		else{

			return new Promise((cumplida, falla) => {

				this.__pendientes.push(cumplida);

			})

		}

	}

	desbloquear(){

		this.__bloqueado = false;

		if(this.__pendientes.length > 0){

			this.__bloqueado = true;

			return this.__pendientes.shift()();

		}
		else{

			this.__hayPendientes = false;

		}
	}


}

module.exports = {
	Bloqueos,
	Bloqueo
}


