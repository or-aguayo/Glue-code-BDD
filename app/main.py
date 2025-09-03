from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

class UsuarioBase(BaseModel):
    nombre: str
    correo: str

class Usuario(UsuarioBase):
    id: int
    certificaciones: List[str] = []

class UsuarioActualizacion(BaseModel):
    nombre: Optional[str] = None
    correo: Optional[str] = None

class Certificacion(BaseModel):
    nombre: str

usuarios = {}
contador_id = 1

@app.post("/usuarios", response_model=Usuario)
def crear_usuario(usuario: UsuarioBase):
    global contador_id
    nuevo = Usuario(id=contador_id, nombre=usuario.nombre, correo=usuario.correo, certificaciones=[])
    usuarios[contador_id] = nuevo
    contador_id += 1
    return nuevo

@app.put("/usuarios/{usuario_id}", response_model=Usuario)
def actualizar_usuario(usuario_id: int, datos: UsuarioActualizacion):
    if usuario_id not in usuarios:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    usuario = usuarios[usuario_id]
    if datos.nombre is not None:
        usuario.nombre = datos.nombre
    if datos.correo is not None:
        usuario.correo = datos.correo
    usuarios[usuario_id] = usuario
    return usuario

@app.post("/usuarios/{usuario_id}/certificaciones", response_model=Usuario)
def agregar_certificacion(usuario_id: int, cert: Certificacion):
    if usuario_id not in usuarios:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    usuario = usuarios[usuario_id]
    usuario.certificaciones.append(cert.nombre)
    return usuario
