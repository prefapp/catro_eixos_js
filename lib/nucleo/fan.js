const flatten = require("array-flatten");

class Fan{

    constructor(numParalelos, alimentador, opciones = {}){

        this.numParalelos = numParalelos;   

        this.alimentador = alimentador;

        this.opciones = opciones;

    }

    ejecutar(worker){

        if(typeof worker != 'function'){
            throw `Fan::ejecutar: worker tiene que ser una funcion`
        }

        const pp = [];

        for(let i = 0; i < this.numParalelos; i++){

            pp.push(new Worker(worker).run(this.alimentador));

        }
        
        return Promise.all(pp).then((resultados) => {

            return flatten.depth(resultados, 1);

        })
    }

}

class Worker{

    constructor(codigo){

        this.codigo = codigo;

        this.resultados = [];

        this.running = true;

    }

    run(alimentador){

        this.running = true;

        return (async() => {

            let args = alimentador();

            while(args){

                let resultado = await this.codigo(args);

                this.resultados.push(resultado);

                args = alimentador();

            }

            this.running = false;

            return this.resultados;

        })()

    }

}



module.exports = {

    Fan


}
