module.exports = function(validaciones, error, args = {}){

    return Object.keys(validaciones).every((k) => {

        if(!args.hasOwnProperty(k)){

            error(`Falta el parámetro ${k}`);

            return false;
        }

        return __validar(k, validaciones[k], args[k], error)

    })

}

function __validar(clave, validacion, argumento, err){

    if(__esValidacionCompleja(validacion)){

        return __validacionCompleja(clave, validacion, argumento, err);

    }
    else{

        return __validacionSimple(clave, validacion, argumento, err)

    }

}

function __esValidacionCompleja(validacion){

    if(typeof validacion == "object"){

        if(Object.keys(validacion).length > 0) return true

    }

    return false;

}

function __validacionSimple(clave, validacion, argumento, err){

    //console.log(`${clave} ${validacion == Number} ${Number.isNaN(argumento)}`)

    if(validacion == Array){
        if(!Array.isArray(argumento)){
            err(`${clave} no es correcta: se esperaba un array`)
            return false;
        }
        else{
            return true;
        }
    }

    if(validacion == String){

        if(typeof argumento != "string"){

            err(`${clave} no es correcta: se espera un string`);

            return false;

        }
        else{
            return true;
        }

    }    

    if(validacion == Number){

        if(Number.isNaN(argumento)){
            err(`${clave} no es correcta: se esperaba un Número`)
            return false;
        }
        else{
            return true;
        }
    }

    if(validacion == Function){

        if(typeof argumento != "function"){
            err(`${clave} no es correcta: se esperaba una función`)
            return false;
        }
        else{
            return true;
        }

    }
 
    if(validacion == Object){

        if(typeof argumento != "object"){
            err(`${clave}  no es correcta: se esperaba un objeto`)
            return false;
        }   
        else{
            return true;
        }

    }

    if(validacion == Boolean){

        if(argumento !== true && argumento !== false){

            err(`${clave} no es correcta: se esperaba un booleano`)
            return false;

        }
        else{
    
            return true;

        }

    }
   
}

function __validacionCompleja(clave, validacion, argumento, err){

    if(!validacion.validacion(argumento)){

        err(`${clave} no es válida (validacion especial)`);

        return false;
    }
    else{

        return true;

    }

}
