# language: es
Característica: Gestión de usuarios

  Escenario: Crear un usuario
    Cuando creo un usuario con nombre "Juan" y correo "juan@example.com"
    Entonces el resultado es exitoso
    Y el usuario creado tiene el nombre "Juan"

  Escenario: Modificar un usuario
    Dado que existe un usuario con nombre "Ana" y correo "ana@example.com"
    Cuando actualizo el usuario a nombre "Ana Maria"
    Entonces el resultado es exitoso
    Y el usuario modificado tiene nombre "Ana Maria"

  Escenario: Agregar una certificación a un usuario
    Dado que existe un usuario con nombre "Luis" y correo "luis@example.com"
    Cuando agrego la certificación "Python Avanzado" al usuario
    Entonces el resultado es exitoso
    Y el usuario tiene la certificación "Python Avanzado"
