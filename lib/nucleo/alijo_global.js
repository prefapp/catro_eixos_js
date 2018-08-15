module.exports = class {

    constructor(args = {}){

        this._alijo = {};
        this._depurado = args.depurado || true;

        this.depurar = function(){};

        if(this._depurado){
            this.__activarDepurado();
        }
    }

    set(clave, valor){

        this.depurar(`SET ${clave} => ${valor}`)

        this._alijo[clave] = valor;

    }

    get(clave){

        return this._alijo[clave];

    }

    vaciar(){

        this.depurar(`VACIADO DE ALIJO`);

        this._alijo = {};

    }

    unset(clave){

        this.depurar(`UNSET ${clave}`);

        delete this._alijo[clave];

    }

    __activarDepurado(){

        const debug = require("debug")("catro-eixos-js:alijo-global");

        this.depurar = function(cadena){
            debug(cadena);
        }

    }

}
