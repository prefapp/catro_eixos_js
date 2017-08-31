"use strict";

const CatroEixos = require("../../../index.js");

const fs = require("fs");

class ProcesoRollback extends CatroEixos.Proceso {

    parametrosNecesarios(){
      return ["ruta"]
    }

    __r(){

        return [
          "__crearDirectorio",
          "__crearFichero",
          "__falla"
        ]
    }

    __crearDirectorio(){

      this["dir"] = this.arg("ruta") +"/directorio";

      this.resultado("dir", this["dir"]);

      return new Promise((cumplida, falla) => {

        fs.mkdir(this["dir"], (err) => {

          if(err) falla(err);
          else    cumplida();
        })

      })

    }

    EVAL__crearDirectorio(){

      if(!fs.existsSync(this["dir"])) throw "ERROR_CREACION_DIR"

    }

    KO__crearDirectorio(err){

      this.error(`[CREAR_DIRECTORIO][${err}]`);
    }
    
    RB__crearDirectorio(){

      return new Promise((cumplida, falla) => {

        fs.rmdir(this["dir"], (err) => {
          if(err) falla(err);
          else    cumplida();
        });

      })

    }

    __crearFichero(){

      this["fichero"] = this["dir"] + "/foo.txt";

      return new Promise((cumplida, falla) => {

        fs.writeFile(this["fichero"], "hola", (err) => {

          if(err) falla(err);
          else    cumplida();
        })

      })
    }

    EVAL__crearFichero(){

      if(!fs.existsSync(this["fichero"])) throw "ERROR_CREACION_FICHERO"
    }

    KO__crearFichero(err){

      this.error(`[CREACION_FICHERO][${err}]`);
    }

    RB__crearFichero(){

      return new Promise((cumplida, falla) => {

        fs.unlink(this["fichero"], (err) => {
          
          if(err) falla(err)
          else    cumplida();
        })
      })
    }

    __falla(){
      throw 1;
    }

}

module.exports = ProcesoRollback;
