const {expect} = require("chai");

const ProcesadorInfo = require("../../lib/nucleo/procesador/info");
const {init, Tarea} = require("../../index.js");

const net = require("net");

describe("Utiles - Info", function(){

  let Procesador;
  let getInfo;

  before(function(hecho){

    let info = {
      bindings: {
        callback: function(info){return info},
        unix: "/tmp/procesador.s"
      }
    }

    init({

      "P": __dirname + "/../fixtures/procesos"

    }, {

        info: info

    })

      .then((proceso) => {

        Procesador = proceso;

        getInfo = info.bindings.callback;

        hecho();

      })

      .catch((err) => hecho(err))
  })

  it("Controla el get/set de informacion", function(){

    const p = new ProcesadorInfo();

    p.setInfo("a", 42);

    expect(p.getInfo("a")).to.equal(42);

    p.setInfo("e", {

      "ee" : {
        "a": 100
      }

    })

    expect(p.getInfo("e.ee.a")).to.equal(100);

  })

  it("La informacion base se mantiene correcta", function(hecho){

    this.timeout(0);

    let pp = Array(5000).fill(1).map(() => {
      return crearProceso('P.llama_a_otro', {llama_a: "P.proceso_test", cadena: "A"})
    })

    Promise.all(pp)

      .then(() => {

        const i = getInfo();

        expect(i.tareas.ejecutadas).to.equal(5000);
        expect(i.tareas.ejecutandose).to.equal(0);

        expect(i.procesos.ejecutados).to.equal(10000);
        expect(i.procesos.ejecutandose).to.equal(0);

        expect(i.procesos.procesosEnEjecucion["P.proceso_test"]).to.be.undefined;
        expect(i.procesos.procesosEnEjecucion["P.llama_a_otro"]).to.be.undefined;
        expect(i.procesos.procesosEjecutados["P.proceso_test"]).to.equal(5000);
        expect(i.procesos.procesosEjecutados["P.llama_a_otro"]).to.equal(5000);

        hecho();

      })

      .catch((err) => {

        hecho(err);

      })
  })

  it("Permite recoger la informacion a traves de un socket unix", function(hecho){

    const c = net.createConnection('/tmp/procesador.s');   

    let Datos = false;

    c.on("connect", function(){
    })

    c.on("data", function(datos){

      Datos = JSON.parse(datos);
    })

    c.on("close", function(){

      expect(Datos).to.be.an("object")

      expect(Datos.procesos.ejecutados).to.equal(10000);
      expect(Datos.procesos.ejecutandose).to.equal(0);

      expect(Datos.procesos.procesosEnEjecucion["P.proceso_test"]).to.be.undefined;
      expect(Datos.procesos.procesosEnEjecucion["P.llama_a_otro"]).to.be.undefined;
      expect(Datos.procesos.procesosEjecutados["P.proceso_test"]).to.equal(5000);
      expect(Datos.procesos.procesosEjecutados["P.llama_a_otro"]).to.equal(5000);

      hecho();
    })

  })

  function crearProceso(proceso, args = {}){

    args.proceso = proceso;

    return Procesador.ejecutar(

      new Tarea("", args)

    )
    

  }

})
