/*
 * Entrada:
 *   hash:
 *      (Firma proceso (Familia.proceso)) => limites (numero)
 */


class LimitesProceso{

    constructor(limites = {}){

        this.limites = this.__prepararLimites(limites);

    }

    ejecutarProceso(proceso, ejecucionProceso){

        let limite = this.limites[proceso];

        if(limite){

            if(limite.actuales >= limite.max){

                limite.enEspera.push(ejecucionProceso);

                return false;
            }
            else{
                this.__lanzarProceso(proceso, ejecucionProceso);
            }
        }
        else{
            ejecucionProceso();
        }
    }

    procesoEjecutado(proceso){

        if(this.limites[proceso]){

            this.limites[proceso].actuales--;

            this.__lanzarEnEspera(proceso);
        }
    }

    __lanzarProceso(proceso, ejecucionProceso){

        this.limites[proceso].actuales++;

        ejecucionProceso(() => {
            this.procesoEjecutado(proceso);
        });
    }

    __lanzarEnEspera(proceso){

        let enEspera = this.limites[proceso].enEspera.shift();

        if(enEspera){
            this.__lanzarProceso(proceso, enEspera);
        }

    }

    __prepararLimites(limites){

        let limObjeto = {};

        Object.keys(limites).map((l) => {

            limObjeto[l] = {

                max : limites[l],

                actuales: 0,

                enEspera: []
            }

        })

        return limObjeto;
    }
    

}

module.exports = LimitesProceso;
