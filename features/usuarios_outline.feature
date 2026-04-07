# language: es
Característica: Validación con Esquema del escenario
  Para cubrir variaciones de entradas
  Como analista funcional
  Quiero ejecutar el mismo flujo con diferentes ejemplos

  Esquema del escenario: Crear y modificar un usuario con múltiples ejemplos
    Cuando creo un usuario con nombre "<nombre_inicial>" y correo "<correo_inicial>"
    Y actualizo el usuario a nombre "<nombre_final>"
    Entonces el resultado es exitoso
    Y el usuario modificado tiene nombre "<nombre_final>"

    Ejemplos:
      | nombre_inicial | correo_inicial        | nombre_final |
      | Carla          | carla@example.com     | Carla Pérez  |
      | Bruno          | bruno+qa@example.com  | Bruno Díaz   |
