module.exports = class{

    constructor(proceso){

        this.proceso = proceso;

    }

    ejecutar(paso, args, extra){

        return new Promise((cumplida, falla) => {

            try{
         
                let salida = paso.call(this.proceso, args, extra);

                if(this.__esPromesa(salida)){

                    (async function(){

                        try{

                            let resultado = await salida;

                            cumplida(resultado);

                        }
                        catch(err){

                            falla(err);

                        }

                    })();

                }
                else{
                    cumplida(salida);
                }
        
            }
            catch(err){
                falla(err);
            }

        })
    }


    __esPromesa(obj) {
        return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
    }

}
