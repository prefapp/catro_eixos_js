module.exports = class {

	constructor(refProceso, mapa){
	
		this.refProceso = refProceso;
		this.mapa = mapa;

		this.__intervalos = {};
		this.__instalado = false;
	}

	desinstalar(){

		if(!this.__instalado) return;

		Object.values(this.__intervalos).forEach(i => clearInterval(i))

		this.__instalado = false;

	}

	instalar(opciones){

		//si ya hay un controlador de subprocesos, tiene preferencia 
		const f = (hito, refSubProceso) => {

			this.__controlarHito(hito, refSubProceso);

		}

		if(opciones.eventos){
			if(opciones.eventos["HITO_ACTUALIZADO"]){
				opciones.eventos["HITO_ACTUALIZADO"].push(f);
			}
			else{
				opciones.eventos["HITO_ACTUALIZADO"] = f;
			}
		}
		else{

			opciones.eventos = {

				"HITO_ACTUALIZADO": f

			}

		}

		delete opciones.controladorSubprocesos;

		opciones.cs = this;

		this.__instalado = true;

		return opciones;

	}

	__controlarHito(hito, refSubProceso){

		let nombreProceso = refSubProceso.tarea.args.proceso;

		let procesoPaso = `${nombreProceso}.${refSubProceso.pasoActual}`;

		console.log(procesoPaso)

		if(this.mapa[procesoPaso]){
			this.__aplicar(this.mapa[procesoPaso], refSubProceso);
		}

	}

	__aplicar(acciones, refSubProceso){

		Object.keys(acciones).forEach((a) => {

			switch(a){

				case "porcentaje":
					this.__setPorcentaje(acciones[a]);
					break;
				case "porcentaje_progresivo":
					this.__setPorcentajeProgresivo(acciones[a]);
					break;
				case "hito":
					this.__setHito(acciones[a]);
					break;
				case "a_resultado":
					this.__setResultado(acciones[a], refSubProceso);
					break;

			}

		})

	}

	__setPorcentaje(porcentaje){

		console.log(porcentaje)

		this.refProceso.completado(porcentaje);

	}

	__setHito(hito){

		this.refProceso.hito(hito);
	}

	__setResultado(f, refSubProceso){

		f(refSubProceso);

	}

	__setPorcentajeProgresivo({hasta, tiempo, desde}){

		const incremento = ((

			hasta - 

			(this.refProceso.tarea.resultados.porcentaje_completado || 0)

		) / tiempo);

		console.log(incremento)

		let porcentaje_completado = desde;
	
		const i = setInterval(() => {


			if(porcentaje_completado >= hasta){

				this.__limpiarIntervalo(i);

			}
			else{

				this.refProceso.completado(porcentaje_completado);

				porcentaje_completado += incremento;

				console.log(`Incrementado a ${porcentaje_completado}`)

			}

		}, tiempo)
		
		this.__intervalos[i] = i;
	}

	__limpiarIntervalo(intervalo){

		clearInterval(intervalo);

		delete this.__intervalos[intervalo];
	}

}
