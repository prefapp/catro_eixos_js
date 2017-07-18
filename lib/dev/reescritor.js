module.exports = class{

    constructor(proceso){
        this.proceso = proceso;
    }

    __metodosPropios(selecciones, soloMetodos = false){

        let metodosPropios = selecciones.filter(s => /^self\./)

        if(soloMetodos){
            return metodosPropios.map(s => s.replace(/^self\./, ""))
        }
        else{
            return metodosPropios;
        }

    }

    __reescribir(proceso, metodo, codigo){

        let original = proceso.prototype[metodo];

        proceso.prototype[metodo] = codigo.bind(proceso)
    }
}
