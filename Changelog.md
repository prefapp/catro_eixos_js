# Changelog

## [unreleased]

- Corrección de tests

## 3.3.1 [27-03-2019]

- Corregidas vulnerabilidades en dependencias

## 3.2.2 [18-02-2019]

- Agregado bundler para módulos
- Permitir pasar argumentos a módulos


## 3.2.1 [18-02-2019]

- Implementación de módulos en catro-eixos-js

## 3.1.2 [28-10-2018]

- Agregado constructor de interfaces 

## 3.1.1 [26-09-2018]

- Agregado evento 'parchear' para permitir MonkeyPatching en procesos

- Corregido un error en controlador_procesos tipo progresivo

## 3.1.0 [14-09-2018]

- Correccion de fallos en locks de procesos

- Agregado controlador de subprocesos

## 3.0.0 [1-09-2018]

- Creación de locks para procesos

## 2.9.6 [15-08-2018]

- Alijo Global

- Validación de tipos de datos en parámetros

- Asegurado orden de ejecución en proceso Bootstrap

## 2.9.3 [08-08-2018]

- Fase REP 

## 2.9.2 [07-08-2018]

- Agregada funcionalida de forkProceso en núcleo

## 2.9.1 [01-07-2018]

- Agregado sistema de bundling 

- Agregado método finalizar()

- Agregado UtilesFS.listarDirectorio()

## 2.8.1 [02-06-2018]

- Agregados métodos fan

## 2.7.2 [13-05-2018]

- Métodos base de fs

## 2.7.1 [01-05-2018]

- Agregada funcionalidad de paraCada
- Agregada validación de bloque __r

## 2.6.2 [24-10-2017]

- Agregado alijo al proceso

## 2.6.1 [02-10-2017]

- Agregado un método que permite controlar el tiempo total
  de ejecución de un proceso (__tTranscurrido())
- Agregado un método __elapsedTime
- Agregado sistema de info interna de un procesador

## 2.4.5
- Corrección de hito automático

## 2.4.4
- Agregado hito automático

## 2.4.3 [27-09-2017]

- hito() agregado
- porcentaje() agregado (alias de completado)
- completado() es ahora getter/setter

## 2.4.2 [19-09-2017]

- Se corrige un bug en los límites de proceso para cuando el proceso falla.

## 2.4.1 [07-09-2017]

- Se agrega un método de cancelación de un proceso (propagable al resto de subprocesos)
- Se agrega un método para establecer un porcentaje de completado
- Nuevo evento (PORCENTAJE_ACTUALIZADO) 
- Nueva documentación
- Se pueden pasar eventos de control al procesador desde una llamada a subProceso
- Se valida que los parámetros necesarios no sean undefined
- Validaciones en nivel de logs (para caso de niveles no definidos) y se habilita off para apagar logs

## 2.3.3 - [05-09-2017]

- Fix de bug que impedía recoger adecuadamente el estado de un subproceso

## 2.3.2 - [05-09-2017]

- Corrección de bug de subprocesos con rollback

## 2.3.1 - [02-09-2017]

- Corrección de bug que no permitía saber si un paso estaba o no implementado en el proceso y se llamaba desde "\__r"

- Implementación de un helper para dormir (basado en promesas)



