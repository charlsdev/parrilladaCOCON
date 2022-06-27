# Construir la imagen en docker
docker build -t [nameApp] .

# Ver las imagenes
docker images

# Ejecutar imagen 
### -p ==> puerto
### pExterno : pDefecto
docker run -p 4000:3000 [nameApp]

# Ejecutar Docker-Compose
docker-compose build

# Iniciar servicio de Docker-Compose
docker-compose up

# Parar todos los contenedores
docker compose stop