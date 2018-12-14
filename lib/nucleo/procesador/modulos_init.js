module.exports = function(procesador, modulos = {}){

	procesador.setInvocadorModulos((proceso, args) => {

		return runModuloProceso(proceso, args, modulos);

	})

	return procesador;
}

function runModuloProceso(proceso, args = {}, modulos){

	const modulo = proceso.replace(/\#.+/, "");
	const procesoFamilia = proceso.replace(/^\w+\#/, "")

	if(!modulos[modulo])
		throw `Modulo desconocido ${modulo}`

	return modulos[modulo].ejecutar(

		procesoFamilia,

		args
	)

}


