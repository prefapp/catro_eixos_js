const repl = require("repl");

const Tarea = require("../nucleo/tarea.js");

const colors = require("colors");

const fs = require("fs");
const yamljs = require('yaml-js');
const net = require("net");

const ReplJobs = require("./repl_jobs.js");

const HISTORIAL_REPL = './.repl_historial';

class InterpreteComandos{

  COMANDOS() {
    return ["l", "r", "c", "u", "i"]
  }

  constructor(refProcesador, fIniciar, opciones){

    this.fIniciar = fIniciar; //para poder recargar el sistema
    this.fSetInfoServer = opciones.servidorExterno || false;
    this.fIntervaloF = false;
    this.tareasId = 0;
    this.refProcesador = refProcesador;
    this.procesos = Object.keys(refProcesador.procesos);
    this.enComandoReg = new RegExp(/^\s*\.(\w+)\s+(.*)$/);
    this.enComandoProcesoArgs = new RegExp(/^\s*\.r\s+([\w\.]+)\s+(.*)/);

    this.jobs = new ReplJobs();

    this.opciones = opciones;
  }

  iniciar(){
  
      this.repl = repl.start({prompt: ">", completer: this.completar.bind(this)});

      this.__iniciarHistorial()

        .then(() => {

          this.__configurar();

        })

        .then(() => {

          this.repl.on("exit", () => {
            console.log("SALIENDO...");
            process.exit(0);
          })

        })

        .catch((err) => {
          throw new Error(err);
        })
  }

    __iniciarHistorial(){

      return new Promise((cumplida, falla) => {

        if(fs.existsSync(HISTORIAL_REPL)){

          this.repl.rli.history = fs.readFileSync(HISTORIAL_REPL, 'utf-8').split('\n').reverse();
          this.repl.rli.history.shift();
          this.repl.rli.historyIndex = -1
        
        }
  
        let fd = fs.openSync(HISTORIAL_REPL, 'a'); 

        let wstream = fs.createWriteStream(HISTORIAL_REPL, {
          fd: fd
        });     

        wstream.on("error", (err) => {
          throw `[REPL][HISTORIAL][${err}]`
        })       

        this.repl.rli.addListener('line', (code) => {

          wstream.write(code + "\n");  

        }) 

        cumplida();

      })

    }

  completar(linea){

    let subLinea = linea;
    let busqueda = [];

    if(this.enComandoProcesoArgs.test(linea)){
      let {b, s} = this.__helperExtraerArgsComando(this.enComandoProcesoArgs.exec(linea));
      subLinea = s;
      busqueda = b;
    }
    else if(this.enComandoReg.test(linea)){
      subLinea = this.enComandoReg.exec(linea)[2];
      busqueda = Object.keys(this.refProcesador.procesos);
    }

    let matches = busqueda.filter(p => p.startsWith(subLinea))

    return [matches.length ? matches: [], subLinea]
  }

  __helperExtraerArgsComando(partes){

    let proceso = partes[1];
    let args = partes[2];    

    let p = new this.refProcesador.procesos[proceso](new Tarea())

    if(p["parametrosNecesarios"]){
  
      let hayMatch = args.match(/([^=]*)$/);

      return {
        s: (hayMatch) ? hayMatch[1] : "",
        b: (hayMatch) ? p["parametrosNecesarios"]() : []
      }
    }
    else{
      return {
        s: args,
        b: []
      }
    }
  }

  __configurar(){

    this.COMANDOS().forEach((c) => {

      this.repl.defineCommand(c, this[`com__${c}`]())

    })

    if(this.opciones.precargar){
    
      Object.keys(this.opciones.precargar).forEach((k) => {

        let key = k;

        this.repl.context[key] = this.opciones.precargar[key]((valor) => {
            this.repl.context[key] = valor;
        });

      })

    }

  }

  com__u(){
    return {

      "help": "Recarga del procesador",

      "action": (entrada) => {

        this.__limpiarIntervalo();

        console.log("Recargando procesador....\n");
      
        this.__recargar(() => {
          console.log("Recargado!\n");
          this.repl.displayPrompt();
        })
      }

    }
  }

  __recargar(terminado = () => {}){

     return this.fIniciar()

       .then((refProcesador) => {
         this.refProcesador = refProcesador;
       })
       .then(() => {
          terminado();
       })
  }

  com__c(){

    return {

      "help": "Cargar un fichero de datos externo (json|yaml)",
      "action": (entrada) => {

        this.__limpiarIntervalo();

        let args = entrada.split(/\s+/);

        args = this.__resolverContexto({en: args[0], ruta: args[1]});

        if(!args.en){
          this.__mensajeError("Falta variable de almacenamiento");
          this.repl.displayPrompt();
        }
        else if(!args.ruta){
          this.__mensajeError("Falta ruta de carga de fichero");
          this.repl.displayPrompt();
        }
        else{

          fs.readFile(args.ruta, (err, data) => {

            if(err){
              this.__mensajeError(`NO SE HA PODIDO LEER FICHERO ${err}`);
              this.repl.displayPrompt();
              return;
            }
            else{
              if(args.ruta.match(/\.json$/)){
                data = JSON.parse(data);
              }
              else if(args.ruta.match(/(\.yaml|\.yml)$/)){
                data = yamljs.load(data);
              }
              else{
                this.__mensajeError(`Formato de fichero desconocido`);
                this.repl.displayPrompt();
                return;
              }

              delete this.repl.context[args.en];

              this.repl.context[args.en] = data;
              this.repl.displayPrompt();
            }

          })
        }

      }

    }
  }

  com__i(){

    return {

      "help": "Información de un procesador externo en ejecución",

      "action": (a) => {

        this.__limpiarIntervalo();

        if(!this.fSetInfoServer){
          this.__mensajeError('No hay un procesador externo seteado');
          return this.repl.prompt();
        }
        else{

          const args = a.split(/\,/);

          if(args.indexOf("-f") == -1){
      
            this.__infoServidorExterno(() => {
              this.repl.prompt();
            })
          }
          else{

            const f = () => {

              this.__limpiarPantalla();

              this.__infoServidorExterno(() => {});
            };

            this.fIntervaloF  = setInterval(f, 1000);

          }

        }

      }

    }

  }

  __infoServidorExterno(cb){

    const c = net.createConnection(this.fSetInfoServer).on("error", (err) => {

      this.__mensajeError(`Error en conexion a servidor externo ${err}`)
  
      return cb();

    })

    let info;

    c.on("data", (i) => {

      info = JSON.parse(i)

    })

    c.on("close", () => {
  
      if(info)
        console.log(JSON.stringify(info, null, 3));

      return cb();

    })
  }

  com__l(){

    return {

      "help": "Listar familias y procesos",

      "action": (familia) => {

        this.__limpiarIntervalo();

        let args = this.__resolverContexto({f: familia});

        let imprimir = [];

        if(args.f){
          imprimir = Object.keys(this.refProcesador.procesos)
            .filter(n => n.match(args.f));
        }
        else{
          imprimir = Object.keys(this.refProcesador.procesos);
        }

        imprimir.forEach((f) => {
          console.log(f);
        })

        this.repl.displayPrompt();
      }
    }
  }

  com__r(){

    return {
      "help": "Ejecutar un proceso del sistema",

      "action": (a) => {

        this.__limpiarIntervalo();

        let args = a.split(/\s+/);

        let funciones_previas = function(){ return Promise.resolve()};

        if(args.indexOf("--u") !== -1){
          delete args[args.indexOf("--u")];
          funciones_previas = () => {
            return this.__recargar();
          }
        }

        let proceso = args.shift();
        let t_args = {};

        args.forEach((a) => {
          t_args[a.split(/\=/)[0]] = a.match(/\=(.+)$/)[1]
        })

        t_args = this.__resolverContexto(t_args);

        if(!proceso){
          this.__mensajeError("Falta el proceso a ejecutar");
        }
        else{

          t_args.proceso = proceso;  

          return funciones_previas()
        
              .then(() => {

                return this.refProcesador.ejecutar(

                  new Tarea("tarea" + this.tareasId++, t_args)

                )

              })
              .then((resultados) => {
                console.log(resultados);
                console.log("\n");
                this.repl.displayPrompt();
              })
              .catch((err) => {
                this.__mensajeError(err);
                this.repl.displayPrompt();
              })
        }


      }
    }

  }  

  __mensajeError(mensaje){

    if(typeof mensaje === "string")
      console.log(colors.red(mensaje));
    else
      console.log(colors.red(JSON.stringify(mensaje, 0, 3)));
  }

  __resolverContexto(valores = {}){

    Object.keys(valores).forEach((k) => {
      if(this.repl.context.hasOwnProperty(valores[k])) valores[k] = this.repl.context[valores[k]]
    })

    return valores;
  }

  __limpiarPantalla(){

    process.stdout.write('\u001B[2J\u001B[0;0f');

  }

  __limpiarIntervalo(){

    if(this.fIntervaloF !== false){

      clearInterval(this.fIntervaloF);

      this.fIntervaloF = false;

    }
    
  }
}

module.exports = function(fIniciar, opciones = {}){

  fIniciar()

    .then((refProcesador) => {

      return new InterpreteComandos(refProcesador, fIniciar, opciones);

    })

    .then((interprete) => {

      setTimeout(() => {
        console.log("\n\n");
        interprete.iniciar();
      }, 100)

    })

}

