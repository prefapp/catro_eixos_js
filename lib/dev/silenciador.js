const Reescritor = require("./reescritor.js");

module.exports = class extends Reescritor{

    aplicarSilencios(silencios){

        //procesos self
        this.__metodosPropios(silencios, true)

            .forEach(s => this.__aplicarSilencio(s))

        return this;
    }

    __aplicarSilencio(metodo, proceso){

        proceso = proceso || this.proceso;

        this.__reescribir(proceso, metodo, function(args){
            return args;
        })
    }

}
