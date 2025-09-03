# syntax=docker/dockerfile:1
FROM node:18-alpine

RUN apk add --no-cache python3 py3-pip

WORKDIR /app

# Crea entorno virtual y lo activa
RUN python3 -m venv /venv
ENV PATH="/venv/bin:$PATH"

# Dependencias Node
COPY package.json package-lock.json* ./
RUN npm install && npm cache clean --force

# Dependencias Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Código de la aplicación
COPY . .

CMD ["npm", "test"]
