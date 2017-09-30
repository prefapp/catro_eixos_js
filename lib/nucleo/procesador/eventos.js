module.exports = class {

  constructor(){

    this.__eventos = {};

  }

  agregarAEvento(nombre, cb){

    this.__eventos[nombre] = this.__eventos[nombre] || [];

    this.__eventos[nombre].push(cb);

  }

  ejecutarEvento(nombre, args = []){

    if(this.__eventos[nombre])
      this.__eventos[nombre].forEach(cb => cb(...args))
  }

}
