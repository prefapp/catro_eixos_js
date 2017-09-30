const ProcesadorInfo = require("./info.js");

const net = require("net");

module.exports = function(procesador, info = false){

  if(!info) 
    return Promise.resolve(procesador)

  return new ProcesadorInfo(procesador.getRefStore())

      .instalar()

      .then((pi) => {

        if(info.middlewares){

          info.middlewares.forEach((m) => m(pi))

        }

        return pi;

      })
      .then((pi) =>{

        if(info.bindings){
        
          instalarBindingsInfo(pi, info.bindings);
        }

        return procesador;

      })

}

function instalarBindingsInfo(pi, bindings){

  if(bindings.callback){

    let cb = bindings.callback;

    bindings.callback = function(){

      return cb(pi.raw());
 
    }

  }

  if(bindings.unix){

    net.createServer((socket) => {

      socket.write(JSON.stringify(pi.raw()), () => {

        socket.end();

      })

    }).listen(bindings.unix)

  }

}


