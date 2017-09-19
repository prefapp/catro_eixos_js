# Changelog

## [unreleased]

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



