//middleware base de información de procesador
module.exports = function(info){

  instalarInfoTareas(info);
  instalarInfoProcesos(info);

}
function instalarInfoProcesos(info){

  const procesos = {

    ejecutandose: 0,
    ejecutados: 0,  
    procesosEnEjecucion: {},
    procesosEjecutados: {}
  };

  info.setInfo("procesos", procesos);

  info.agregarObserver("INICIO_PROCESO", (a) => {
    
    procesos.ejecutandose++;

    procesos.procesosEnEjecucion[a.proceso] = procesos.procesosEnEjecucion[a.proceso] || 0;
    procesos.procesosEnEjecucion[a.proceso]++;

  })

  info.agregarObserver("INICIO_SUB_PROCESO", (a) => {
    
    procesos.ejecutandose++;

    procesos.procesosEnEjecucion[a.subProceso] = procesos.procesosEnEjecucion[a.subProceso] || 0;
    procesos.procesosEnEjecucion[a.subProceso]++;

  })
  
  info.agregarObserver("FIN_PROCESO", (a) => {

    procesos.ejecutandose--;
    procesos.ejecutados++;

    procesos.procesosEnEjecucion[a.proceso]--;

    if(procesos.procesosEnEjecucion[a.proceso] <= 0){
      delete procesos.procesosEnEjecucion[a.proceso];
    }

    procesos.procesosEjecutados[a.proceso] = procesos.procesosEjecutados[a.proceso] || 0;
    procesos.procesosEjecutados[a.proceso]++;

  })

  info.agregarObserver("FIN_SUB_PROCESO", (a) => {

    procesos.ejecutandose--;
    procesos.ejecutados++;

    procesos.procesosEnEjecucion[a.subProceso]--;
    
    if(procesos.procesosEnEjecucion[a.subProceso] <= 0){
      delete procesos.procesosEnEjecucion[a.subProceso];
    }
    
    procesos.procesosEjecutados[a.subProceso] = procesos.procesosEjecutados[a.subProceso] || 0;
    procesos.procesosEjecutados[a.subProceso]++;

  })

}

function instalarInfoTareas(info){

  //info de tareas
  const tareas = {
    ejecutandose: 0,    
    ejecutadas: 0
  }

  info.setInfo('tareas', tareas);
  
  info.agregarObserver('INICIO_TAREA', () => {

    tareas.ejecutandose++;

  })

  info.agregarObserver("FIN_TAREA", () => {

    tareas.ejecutadas++;
    tareas.ejecutandose--;

  })


}
