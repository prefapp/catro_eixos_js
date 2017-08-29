"use strict";

const Tarea = require("../nucleo/tarea.js");

const fs = require("fs");

module.exports = function(f_iniciar){

  f_iniciar()

    .then((refProcesador) => {

      let tarea = _prepararParametrosTarea();

      return refProcesador.ejecutar(tarea)

    })

    .then(({resultados}) => {

      console.log(resultados);

    })

    .catch((err) => {

      console.log(err);

      process.exit(1);

    })

}

function _prepararParametrosTarea(){

  let tarea_args = {};

  if(process.argv.length < 3) 
    throw 'Falta el proceso a ejecutar';

  process.argv.forEach((val, index) => {

    if(index == 2){

      tarea_args.proceso = val;

    }
    if(index > 2){

      if(val.match(/\=\@/)){
        __cargarFicheroDesdeParametro(val, tarea_args);
      }
      else{
        let partes = val.split(/\=/);

        tarea_args[partes[0]] = partes[1]
      }
    }

  })

  return new Tarea("t", tarea_args);
}

function __cargarFicheroDesdeParametro(parametro, tarea_args){

  let partes = parametro.split(/\=\@/);

  if(fs.existsSync(partes[1])){
    fs.readFile(partes[1], (err, datos) => {

      if(err) throw `ERROR APERTURTA FICHERO  ${partes[1]}: ${err}`
      
      tarea_args[partes[0]] = JSON.parse(datos);
      
    })
  }
  else{
    throw `ERROR NO SE ENCUENTRA FICHERO ${partes[1]}`
  }

}

