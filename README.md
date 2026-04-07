# Glue-code-BDD

Proyecto de ejemplo para pruebas BDD con **Gherkin + Cucumber.js** contra una API en FastAPI.

## Ejecutar pruebas

```bash
npm test
```

## Ejemplos incluidos

- `features/usuarios.feature`: flujo básico de crear, actualizar y agregar certificaciones.
- `features/usuarios_tablas.feature`: uso de **Antecedentes** y **Data Tables** para carga y validación de datos.
- `features/usuarios_outline.feature`: uso de **Esquema del escenario** con múltiples ejemplos.
- `features/usuarios_errores.feature`: flujos negativos con validación de errores HTTP.
