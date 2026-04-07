# language: es
Característica: Flujos negativos y reglas de negocio
  Para validar errores controlados
  Como equipo de calidad
  Quiero comprobar respuestas cuando el usuario no existe

  Antecedentes:
    Dado que no existe un usuario con id 99999

  Escenario: Agregar certificación a usuario inexistente
    Cuando intento agregar la certificación "Docker" al usuario con id 99999
    Entonces el servicio responde con código 404
    Y el error contiene "Usuario no encontrado"

  Escenario: Actualizar usuario inexistente con datos en tabla
    Cuando intento actualizar el usuario con id 99999 con los datos
      | campo  | valor               |
      | nombre | Usuario Fantasma    |
      | correo | fantasma@example.io |
    Entonces el servicio responde con código 404
    Y el error contiene "Usuario no encontrado"
