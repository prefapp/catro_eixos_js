const MiddlewareInfoBase = require("./info_base.js");

/*
 * Estructura de información del procesador
 */
module.exports = class ProcesadorInfo{

  constructor(refStore){

    this.refStore = refStore;

    this.__info = {};

    this.__observers = {};

  }

  raw(){
    return this.__info;
  }

  setInfo(clave, valor){

    if(!clave.match(/\./)){
      return this.__info[clave] = valor;
    }

    let f = this.getInfo[clave.split(/\./).slice(0,-1).join('.')]

    f = valor;

  }

  getInfo(clave){

    return clave.split(/\./).reduce((fuente, clave, i, a) => {

      if(i < a.length && !fuente.hasOwnProperty(clave))
        throw `[CatroEixos-js][Procesador-Info][No hay clave ${clave}]`

      return fuente[clave];

    }, this.__info)
  }

  instalar(){

    return (async () => {

      MiddlewareInfoBase(this);

      return this;

    })()

  }

  agregarObserver(evento, cb){

    if(this.__observers[evento])
      return this.__observers[evento].push(cb);

    this.__observers[evento] = [cb];

    this.__instalarObserver(evento);

  }

  __instalarObserver(evento){

      this.refStore.subscribe(() => {


        let estado = this.refStore.getState();

        if(estado["ultimaAccion"].get("accion")["type"] === evento){
          this.__observers[evento].forEach((cb) => {
              cb(estado.ultimaAccion.get("accion"))
          })
        }        

      })

  }


}
