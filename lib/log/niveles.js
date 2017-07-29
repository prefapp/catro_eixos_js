const niveles = {

    
    "warn": [

        "ERRORES",

    ],

    "info": [

        "n_warn",

        "INICIO_TAREA",

        "FIN_TAREA",

        "INICIO_PROCESO_PPAL",

        "FIN_PROCESO_PPAL",

        "INICIO_SUBPROCESO",

        "FIN_SUBPROCESO",
    ],

    "debug": [
        "n_info",
        "EJECUTAR_PASO",
        "PASO_EJECUTADO",
    ]

}

module.exports = function(nivel){

    return expandir(nivel);    

}

function expandir(nivel){

    return niveles[nivel].map((n) => {

        if(n.match(/n_(\w+)/)){
            return expandir(n.match(/n_(\w+)/)[1])
        }
        else{
            return n;
        }
    }).reduce((a,b) => a.concat(b), [])
}
