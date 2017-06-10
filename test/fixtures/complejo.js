"use strict";

const CatroEixos = require("../../index.js");
const fs = require("fs");

class ProcesoComplejo extends CatroEixos.Proceso{

  DEPURAR()  { return true} 
 
   __r(){
        
        return [

            "__crearFichero",
            "__volcarDatosFichero",
            "__leerFichero",
            "__cerrarFichero",
 //           "__borrarFichero"
        ]
    
    }

    __crearFichero(){

        return this.subProceso(
        
            "Complejo.crearFichero",

            {
                ruta: this.arg("ruta_fichero")
            }
        
        )
    }
    
    OK__crearFichero(resultados){

        this.descriptor = resultados.descriptor;
    }
 
    KO__crearFichero(err){

        this.error("CREACION_FICHERO: " + err);
    }   

    __volcarDatosFichero(){

        return this.subProceso(

            "Complejo.volcarFichero",

            {
                descriptor: this.descriptor,

                datos: this.arg("datos")
            }

        );
    }

    __leerFichero(){

        return this.subProceso(

            "Complejo.leerFichero",

            {
                ruta: this.arg("ruta_fichero"),

                tam: this.arg("datos").length
            }

        );

    }

    OK__leerFichero(resultados){

        this.resultado("leido", resultados.leido);
    }

    __cerrarFichero(){

        fs.closeSync(this.descriptor);
    }
}

class ProcesoCrearFichero extends CatroEixos.Proceso{

    __r(){
        return [
            "__abrirFichero",
            "__devolverFichero"
        ];
    }

    __abrirFichero(){

        return new Promise((cumplida, falla) => {

            fs.open(this.arg("ruta"), "w", (err, fd) => {

                if(err) falla(err);

                else cumplida(fd);

            })

        })
    }

    OK__abrirFichero(fd){
        this.fd = fd;
    }

    __devolverFichero(){
        this.resultado("descriptor", this.fd)
    }
}

class ProcesoVolcarDatos extends CatroEixos.Proceso{

    __r(){

        return [
        
            "__volcarDatosEnFichero"

        ]

    }

    __volcarDatosEnFichero(){

        return new Promise((cumplida, falla) => {

            fs.write(

                this.arg("descriptor"), 

                new Buffer(this.arg("datos")),

                0,

                this.arg("datos").length,

                0,

                (err, escritos) => {

                    if(err) falla(err);

                    else    cumplida();
                }

            );

        });
    }

    KO__volcarDatosEnFichero(err){

        this.error("EN_VOLCADO_DE_DATOS: " + err);
    }
}

class ProcesoLeerFichero extends CatroEixos.Proceso{

    __r(){
        return [
            "__abrirFicheroLectura",
            "__leerFichero",
            "__apuntarDatos",   
            "__leerFichero"
        ]
    }

    __abrirFicheroLectura(){

        return new Promise((cumplida, falla) => {

            fs.open(this.arg("ruta"), "r", (err, fd) => {

                if(err) falla(err);

                else    cumplida(fd);

            })

        })
    }
    
    OK__abrirFicheroLectura(fd){

        this.fd = fd;
    }

    __leerFichero(){

        return new Promise((cumplida, falla) => {

            let buffer = new Buffer(this.arg("tam"));            

            fs.read(this.fd, buffer, 0, this.arg("tam"), 0, 

                (err, datosLeidos) =>{ 

                    if(err) fallo(err);

                    else    cumplida(String(buffer))
                })
        })
    }

    OK__leerFichero(datos){

        this.datos = datos;
    }
    
    __cerrarFichero(){
        
        fs.closeSync(this.fd)
    }

    __apuntarDatos(){

        this.resultado("leido", this.datos);

    }
}

module.exports = {

    "ProcesoComplejo" : ProcesoComplejo,

    "ProcesoCrearFichero": ProcesoCrearFichero,

    "ProcesoVolcarDatos": ProcesoVolcarDatos,

    "ProcesoLeerFichero": ProcesoLeerFichero,

}
