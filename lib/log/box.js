module.exports = class{

    constructor(id, refDriver){

        this.id = id;
        this.refDriver = refDriver;
    }

    iniciar(){
        this.refDriver.iniciar(this);
    }

    ok(linea){
        this.__linea("OK", linea);
    }

    error(linea){
        this.__linea("KO", linea);
    }

    cerrar(){
        this.refDriver.cerrar(this);
    }

    __linea(tipo, linea){

        linea = `${this.__cabecera(tipo)} ${linea}\n`;

        this.refDriver.escribir(this, {tipo, linea});

    }

    __cabecera(tipo){
        if(tipo === "OK")   return `[OK]`
        else                return `[KO]`
    }
}
