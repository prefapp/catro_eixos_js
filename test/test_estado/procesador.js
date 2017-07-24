const chai = require("chai");
const { expect  } = require("chai");
const  chaiImmutable = require('chai-immutable');

const {fromJS, is} = require("immutable");

const E = require("../../lib/estado/procesos.js");

describe("Estado - Procesador", () => {

    it("El procesador se inicia con un estado adecuado", () => {

        let estado = E.estadoInicial();

        estado = E.ejecutarProceso(estado, "foo");

        igual(
            
            estado, 

            {
               "procesosEjecutados": 1,
               "procesos": {
                  "foo": {
                     "pasosEjecutados": [],
                     "subProcesos": {},
                     "enPaso": false,
                     "enSubproceso": false,
                     "pasoError": false
                  }
               }
            }
        )


        estado = E.ejecutandoPaso(estado, "foo", "a");

        igual(

            estado,
            {
               "procesosEjecutados": 1,
               "procesos": {
                  "foo": {
                     "pasosEjecutados": [],
                     "subProcesos": {},
                     "enPaso": "a",
                     "enSubproceso": false,
                     "pasoError": false
                  }
               }
            }
        )

        estado = E.ejecutandoSubproceso(
            estado, "foo", "0"
        );

        igual(
            estado,
            {
               "procesosEjecutados": 2,
               "procesos": {
                  "foo": {
                     "pasosEjecutados": [],
                     "subProcesos": {
                        "0": {
                           "pasosEjecutados": [],
                           "subProcesos": {},
                           "enPaso": false,
                           "enSubproceso": false,
                           "pasoError": false
                        }
                     },
                     "enPaso": "a",
                     "enSubproceso": true,
                     "pasoError": false
                  }
               }
            }
        )

        estado = E.ejecutandoSubproceso(
            estado, "foo@0", "0"
        );

        estado = E.ejecutandoPaso(
            estado, "foo@0@0", "a"
        );

        igual(
            estado,
            {
               "procesosEjecutados": 3,
               "procesos": {
                  "foo": {
                     "pasosEjecutados": [],
                     "subProcesos": {
                        "0": {
                           "pasosEjecutados": [],
                           "subProcesos": {
                              "0": {
                                 "pasosEjecutados": [],
                                 "subProcesos": {},
                                 "enPaso": "a",
                                 "enSubproceso": false,
                                 "pasoError": false
                              }
                           },
                           "enPaso": false,
                           "enSubproceso": true,
                           "pasoError": false
                        }
                     },
                     "enPaso": "a",
                     "enSubproceso": true,
                     "pasoError": false
                  }
               }
            }
        )

        estado = E.pasoEjecutado(
            estado, "foo@0@0", "a"
        );

        igual(

            estado,

            {
               "procesosEjecutados": 3,
               "procesos": {
                  "foo": {
                     "pasosEjecutados": [],
                     "subProcesos": {
                        "0": {
                           "pasosEjecutados": [],
                           "subProcesos": {
                              "0": {
                                 "pasosEjecutados": [
                                    "a"
                                 ],
                                 "subProcesos": {},
                                 "enPaso": false,
                                 "enSubproceso": false,
                                 "pasoError": false
                              }
                           },
                           "enPaso": false,
                           "enSubproceso": true,
                           "pasoError": false
                        }
                     },
                     "enPaso": "a",
                     "enSubproceso": true,
                     "pasoError": false
                  }
               }
            }
        )

        estado = E.subprocesoEjecutado(estado, "foo@0@0");

        igual(
            estado, 

            {
               "procesosEjecutados": 3,
               "procesos": {
                  "foo": {
                     "pasosEjecutados": [],
                     "subProcesos": {
                        "0": {
                           "pasosEjecutados": [],
                           "subProcesos": {},
                           "enPaso": false,
                           "enSubproceso": false,
                           "pasoError": false
                        }
                     },
                     "enPaso": "a",
                     "enSubproceso": true,
                     "pasoError": false
                  }
               }
            }
 
        )
    })

})

function igual(a, b){

    expect(is(a, fromJS(b))).to.be.equal(true);

}

function e(estado){
    console.log(JSON.stringify(fromJS(estado), 0, 3));
}
