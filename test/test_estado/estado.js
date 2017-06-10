const chai = require("chai");
const { expect  } = require("chai");
const  chaiImmutable = require('chai-immutable');
const ProcesoEstado = require("../../lib/estado/proceso_estado.js");

const acciones = require("../../lib/estado/acciones.js");

const {fromJS, is} = require("immutable");

chai.use(chaiImmutable);

describe("Estado - Proceso", () => {

    it("Se puede seguir facilmente la ejecucion de un proceso", () => {

        let estado = new ProcesoEstado();

        let aa = [

            acciones.EJECUTANDO_PASO("A"),
            acciones.PASO_EJECUTADO("A"),
            acciones.EJECUTANDO_PASO("B"),
            acciones.PASO_EJECUTADO("B")
        ];

        aa.forEach((a) => estado.accion(a));

        let e = estado.getTrazadoProceso();

        expect(is(e, fromJS({

            "pasosEjecutados": ["A", "B"],

            "subProcesos": [],

            "enPaso": false,
            
            "enSubproceso": false,

            "pasoError": false,
    
            "ultimaAccion": "PASO_EJECUTADO"    
    
        }))).to.be.equal(true)

    })

    it("Controla un paso erroneo", () => {

        let estado = new ProcesoEstado();

        let aa = [

            acciones.EJECUTANDO_PASO("A"),
            acciones.PASO_EJECUTADO("A"),
            acciones.EJECUTANDO_PASO("B"),
            acciones.PASO_EJECUTADO("B"),
            acciones.EJECUTANDO_PASO("C"),
            acciones.PASO_ERRONEO("C")
        ];

        aa.forEach(a => estado.accion(a));

        let e = estado.getTrazadoProceso();

        expect(is(e, fromJS({

            pasosEjecutados: ["A", "B"],
            subProcesos: [],
            pasoError: "C",
            enPaso: false,
            enSubproceso: false,
            ultimaAccion: "PASO_ERRONEO"
            
        }))).to.be.equal(true);

    })

})

