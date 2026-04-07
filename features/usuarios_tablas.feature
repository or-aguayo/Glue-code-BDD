# language: es
Característica: Gestión de usuarios con tablas de datos
  Para modelar flujos de negocio más ricos
  Como equipo de QA
  Quiero usar tablas y antecedentes para preparar datos de prueba

  Antecedentes:
    Dado que existen los siguientes usuarios base
      | nombre | correo              |
      | Marta  | marta@example.com   |
      | Pedro  | pedro@example.com   |

  Escenario: Crear múltiples usuarios en lote con Data Table
    Cuando creo los siguientes usuarios
      | nombre | correo            |
      | Julia  | julia@example.com |
      | Iván   | ivan@example.com  |
    Entonces todos los resultados son exitosos
    Y los usuarios creados incluyen
      | nombre |
      | Julia  |
      | Iván   |

  Escenario: Actualizar correo de un usuario con tabla clave-valor
    Dado que selecciono al usuario "Marta"
    Cuando actualizo el usuario seleccionado con los datos
      | campo  | valor                 |
      | correo | marta.nuevo@email.com |
    Entonces el resultado es exitoso
    Y el usuario seleccionado tiene los datos
      | campo  | valor                 |
      | nombre | Marta                 |
      | correo | marta.nuevo@email.com |
