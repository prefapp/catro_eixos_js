module.exports = class {

    //argumentos:
    //rep: función que ejecuta el paso rep
    //paso: función que ejecuta el paso
    constructor(rep, paso){

        this.rep = rep;
        this.paso = paso;

    }

    ejecutar(){

        return (async () => {

            let continuar = await this.rep();

            let r;

            while(continuar){

                r = await this.paso();

                continuar = await this.rep();

            }

            return r;

        })()

    }


}
