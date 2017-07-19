module.exports = class{

    constructor(conf = {}){

        this.conf = conf;

        this.__boxes = {}
    }
    
    iniciar(box){

        this.__boxes[box.id] = {

            lineas: []

        };

        this.__iniciar(box);
    }

    escribir(box, linea){

        this.__boxes[box.id].lineas.push(linea);    

        this.__escribir(box);
    }

    cerrar(box){
        
        this.__cerrar(box);

        delete this.__boxes[box.id];
    }

    __iniciar(){
        throw `DRIVER: __iniciar: ABSTRACTO!!`
    }

    __escribir(){
        throw `DRIVER: __escribir: ABSTRACTO!!`
    }

    __cerrar(){
        throw `DRIVER: __cerrar: ABSTRACTO!!`
    }
}
