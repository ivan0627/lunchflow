# Etapa 1: Construye el backend
FROM node:14 AS backend

# Establece el directorio de trabajo para el backend
WORKDIR /app/backend

# Copia los archivos del backend desde la carpeta backend de tu proyecto
COPY lunchflow/backend/ .

# Instala las dependencias del backend
RUN npm install

# Etapa 2: Construye el frontend
FROM node:14 AS frontend

# Establece el directorio de trabajo para el frontend
WORKDIR /app/frontend/luchflow-frontend

# Copia los archivos del frontend desde la carpeta frontend de tu proyecto
COPY /frontend/luchflow-frontend/ .

# Instala las dependencias del frontend
RUN npm install

# Construye el frontend
RUN npm run build

# Etapa 3: Combina backend y frontend
FROM node:14

# Copia los archivos del backend desde la etapa backend
COPY --from=backend /app/backend /app/backend

# Copia los archivos del frontend desde la etapa frontend
COPY --from=frontend /app/frontend/luchflow-frontend/build /app/frontend/luchflow-frontend/build

# Establece el directorio de trabajo para el servidor
WORKDIR /app/backend

# Expone el puerto 3000 para acceder al frontend (ajusta según sea necesario)
EXPOSE 3000

# Establece el comando predeterminado para ejecutar el backend
CMD ["node", "index.js"]
