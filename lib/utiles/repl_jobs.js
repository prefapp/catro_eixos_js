const Tarea = require("../nucleo/tarea.js");

module.exports = class{

  constructor(fEnError, fEnCompletado, fEnActualizacion){

    this.jobs = {}
    this.fEnError = fEnError;
    this.fEnCompletado = fEnCompletado;
    this.fEnActualizacion = fEnActualizacion;

  }

  nuevoJob(refProcesador, id, args){

    this.jobs[id] = new Tarea(id, args);

    this.jobs[id].__finalizado = false;

    this.__ejecutarJob(refProcesador, id);

  }

  listarJobs(){

    return Object.keys(this.jobs).map((id) =>{

      return {id: id, finalizado: this.jobs[id].__finalizado}

    })
  }

  watchJob(){

  }

  __ejecutarJob(refProcesador, id){

    refProcesador.ejecutar(this.jobs[id])

      .then((resultados) => {

        this.jobs[id].__finalizado = true;       

      })

      .catch((err) => {

        this.fEnError(err);

      })
  }


}
