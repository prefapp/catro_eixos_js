const Driver = require("./driver.js");

const fs = require("fs");
const path = require("path");

module.exports = class extends Driver{

    constructor(conf = {}){

        super(conf);

        this.__rutaBoxes = conf.ruta;
        this.__buclesEscritura = {};
    }

    __iniciar(box){

        let ruta = this.__calcularRutaBox(box.id);

        fs.open(ruta, "a+", (err, fd) => {

            this.__boxes[box.id]["fd"] = fd;

            let enEscritura = false;

            this.__buclesEscritura[box.id] = () => {

                if(!enEscritura){

                    enEscritura = true;
            
                    this.__escribirLineas(box.id)

                        .then(() => {
                            enEscritura = false;
                        })
                    
                }

            }

            this.__buclesEscritura[box.id]();
        })
    }

    __escribir(box){

        if(this.__buclesEscritura[box.id])
            this.__buclesEscritura[box.id]();

    }

    __cerrar(box){

        delete this.__buclesEscritura[box.id];

        fs.close(this.__boxes[box.id].fd, function(){});
    }

    __calcularRutaBox(id){
        return path.join(this.__rutaBoxes, id)
    }

    __escribirLineas(id){

        return new Promise((cumplida, falla)=>{

            let lineas = this.__boxes[id].lineas;
            
            (async () => {

                while(lineas.length !== 0){
                    await this.__escribirLinea(id, lineas.shift().linea);
                }

                cumplida();
            })();
        })
    }

    __escribirLinea(id, linea){

        return new Promise((cumplida, falla) => {

            fs.write(this.__boxes[id].fd, linea, "", "utf-8", (err) => {

                cumplida();
            }) 
        })
    }
}
