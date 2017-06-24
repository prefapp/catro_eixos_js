const Proceso = require("../../../lib/nucleo/proceso");

const fs = require("fs");

class Entrada extends Proceso{

    DEPURAR(){
        return true;
    }

    paramerosNecesarios(){
        return ["ruta", "datos"]
    }

    __r(){

        return [
            "__crearRuta",
            "__crearFichero",
            "__leerFichero",
//            "__listarRuta",
            "__borrarFichero",
//            "__borrarRuta"
        ]
    }

    __crearRuta(){

        return this.subProceso(

            "Shell.crearRuta",

            {ruta: this.arg("ruta")}
        );

    }

    EVAL__crearRuta(datos){

        return new Promise((cumplida, falla) => {

            fs.stat(this.arg("ruta"), (err) => {

                if(err) return falla("RUTA_NO_CREADA");
                else    cumplida(datos);
            })

        })
        
    }
    
    KO__crearRuta(err){
        this.error(`CREAR_RUTA: ${err}`);
    }

    OK__crearRuta(r){
        this.ruta = r.ruta;
    }

    __crearFichero(){
        
        return this.subProceso(
            "Shell.crearFichero",

            {
                "ruta": this.ruta + "/prueba.txt",
                "datos": this.arg("datos")
            }
        );
    }

    EVAL__crearFichero(datos){

        return new Promise((cumplida, falla) => {

            fs.stat(this.ruta + "/prueba.txt", (err) => {

                if(err) return falla("FICHERO_NO_CREADO");
                else    return cumplida(datos);
            })
        })
    }

    KO__crearFichero(err){

        this.error(`CREAR_FICHERO ${err}`);

    }

    __leerFichero(){
    
        return this.subProceso(

            "Shell.leerFichero",

            {ruta : this.arg("ruta") + "/prueba.txt"}
        );
    }

    EVAL__leerFichero(resultados){

        if(resultados.datos !== this.arg("datos")) throw "DATOS_NO_COINCIDENTES";

        return resultados.datos;
    }

    KO__leerFichero(err){
        this.error(`LEER_FICHERO ${err}`);
    }

    OK__leerFichero(datos){

        this.datos = datos;
    }

    __borrarFichero(){

        return this.subProceso(

            "Shell.borrarFichero",
    
            {ruta : this.arg("ruta") + "/prueba.txt"}
        )
    }

    EVAL__borrarFichero(){

        if(fs.exists(this.arg("ruta") + "/prueba.txt")) throw "FICHERO_NO_BORRADO"
    }

    KO__borrarFichero(err){
        this.error(`BORRAR_FICHERO ${err}`);
    }
}

class CrearRuta extends Proceso{

    paramerosNecesarios(){
        return ["ruta"]
    }

    __r(){
        return ["__crearRuta", "__apuntarResultados"]
    }

    __crearRuta(){

        return this.comandoShell(

            "/bin/mkdir",

            [this.arg("ruta")]

        );
    }

    KO__crearRuta(err){
        this.error(`CREAR_RUTA ${err}`);
    }

    __apuntarResultados(){
        this.resultado("ruta", this.arg("ruta"));
    }       

}

class CrearFichero extends Proceso{

    paramerosNecesarios(){
        return ["ruta", "datos"]
    }

    __r(){
        return [
            "__crearFichero",

            "__volcarDatos"
        ]
    }

    __crearFichero(){
        return this.comandoShell(
        
            "/usr/bin/touch",
    
            [this.arg("ruta")]

        );
    }

    KO__crearFichero(err){
        this.err(`CREAR_FICHERO ${err}`);
    }

    __volcarDatos(){

        return new Promise((cumplida, falla) => {

            fs.writeFile(this.arg("ruta"), this.arg("datos"), (err) => {

                if(err) return falla(err);

                else cumplida();

            })

        })

    }

    KO__volcarDatos(err){
        this.error(err)
    }

}

class LeerFichero extends Proceso{

    parametrosNecesarios(){
        return ["ruta"]
    }

    __r(){
        return [
            "__leerFichero", 
            "__apuntarResultados"
        ]
    }

    __leerFichero(){

        return this.comandoShell(

            "cat",

            [this.arg("ruta")]

        );

    }

    OK__leerFichero(datos){
        this.datos = datos;
    }

    __apuntarResultados(){

        this.resultado("datos", this.datos);
    }
}

class BorrarFichero extends Proceso{

    parametrosNecesarios(){
        return ["ruta"]
    }

    __r(){
        return ["__borrarFichero"]
    }

    __borrarFichero(){

        return this.comandoShell(

            "/bin/rm",

            [this.arg("ruta")]
        );
    }

    KO__borrarFichero(err){
        this.error(err);
    }

}

module.exports = {

    Entrada,
    CrearRuta,
    CrearFichero,
    LeerFichero,
    BorrarFichero
}
