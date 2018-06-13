const fs = require("fs");

// fundamentales de fs devueltos como Promise
module.exports = {

    // crea o agrega a un fichero el contenido pasado
    escribirFichero(ruta, contenido, opciones = {}){

        if(!ruta){
            throw `catro-eixos-js::fs::escribirFichero: falta ruta`;
        }

        else if(!contenido){
            throw `catro-eixos-js::fs::escribirFichero: falta contenido a volcar`;
        }

        if(!Buffer.isBuffer(contenido) && (typeof contenido != "string")){
            throw `catro-eixos-js::fs::escribirFichero: contenido no es un buffer|string`
        }

        return new Promise((cumplida, falla) => {

            fs.writeFile(ruta, contenido, opciones, function(err){

                if(err) 
                    return falla(`catro-eixos-js::fs::escribirFichero: En escritura de fichero en ruta ${ruta} -> ${err}`)
                else    
                    return cumplida();
            })

        })

    },

    leerFichero(ruta, opciones = {}){

        if(!ruta){
            throw `catro-eixos-js::fs::leerFichero: falta ruta`;
        }

        return new Promise((cumplida, falla) => {

            fs.readFile(ruta, opciones, function(err, contenido){

                if(err) 
                    return falla(`catro-eixos-js::fs::leerFichero: En lectura de fichero en ruta ${ruta} -> ${err}`)
                else    
                    return cumplida(contenido);

            })

        })

    },

    existeFichero(ruta){

        if(!ruta){
            throw `catro-eixos-js::fs::existeFichero: falta ruta`;
        }

        return new Promise((cumplida, falla) => {

            fs.stat(ruta, function(err, stats){

                if(err) return cumplida(false);
                else    return cumplida(stats);

            })

        })

    },

    borrarFichero(ruta){

        if(!ruta){
            throw `catro-eixos-js::fs::borrarFichero: falta ruta`;
        }

        return new Promise((cumplida, falla) => {

            fs.unlink(ruta, function(err){

                if(err) return falla(`catro-eixos-js::fs::borrarFichero: en borrado de ${ruta} -> ${err}`)

                else    return cumplida();

            })

        })
    },

    listarDirectorio(ruta){

        if(!ruta){
            throw `catro-eixos-js::fs::listarDirectorio: falta ruta`;
        }

        return new Promise((cumplida, falla) => {

            fs.readdir(ruta, function(err, lista){

                if(err) return falla(`catro-eixos-js::fs::listarDirectorio: en listado de directorio ${ruta} -> ${err}`)

                else    return cumplida(lista);

            })

        })


    }

}
