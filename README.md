# Trabajo Práctico Obligatorio — Aplicaciones Interactivas

## Marketplace Inmobiliario

Trabajo Práctico Obligatorio **Aplicaciones Interactivas**.

### Integrantes

- Ivanec Mora Amalia 
- Peralta Perez Luka Andres

## Descripción

Aplicación web de marketplace inmobiliario que permite a vendedores gestionar su inmobiliaria y sus propiedades, mientras que los interesados pueden buscar publicaciones, consultar propiedades, solicitar visitas y dejar reseñas.

El proyecto está dividido en dos aplicaciones:

```text
/
├── back/    API REST y acceso a datos
├── front/   Aplicación web
└── README.md
```

La documentación específica de cada parte se encuentra en:

- [`back/README.md`](./back/README.md)
- [`front/README.md`](./front/README.md)

## Requisitos

Antes de levantar el proyecto es necesario tener instalado:

- Node.js
- npm
- PostgreSQL
- Git

## Levantar el proyecto desde cero

### 1. Clonar el repositorio

```bash
git clone https://github.com/Luka-Peralta-Perez/TPO-Aplicaciones-Interactivas-Marketplace-Inmobiliario.git
cd TPO-Aplicaciones-Interactivas-Marketplace-Inmobiliario
```

### 2. Configurar y levantar el backend

Ingresar a la carpeta:

```bash
cd back
npm install
```

Crear un archivo `.env` tomando como referencia `back/.env.example`.

Ejemplo:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=TU_CONTRASENA_DE_POSTGRES
DB_NAME=tpo_inmobiliario

JWT_SECRET=TU_SECRETO_JWT
```

Crear en PostgreSQL una base vacía llamada:

```text
tpo_inmobiliario
```

Ejecutar las migraciones y cargar los datos de prueba:

```bash
npm run migration:run
npm run seed
```

Levantar la API:

```bash
npm run dev
```

La API queda disponible en:

```text
http://localhost:3000
```

Se puede verificar con:

```text
GET http://localhost:3000/health
```

Respuesta esperada:

```json
{
  "status": "ok"
}
```

### 3. Configurar y levantar el frontend

Abrir otra terminal desde la raíz del proyecto:

```bash
cd front
npm install
```

Crear un archivo `.env` tomando como referencia `front/.env.example`.

```env
VITE_API_URL=http://localhost:3000
```

Levantar el frontend:

```bash
npm run dev
```

La aplicación queda disponible en:

```text
http://localhost:5173
```

## Datos de prueba

El seed carga vendedores, inmobiliarias, propiedades en distintos estados, historial de estados, comentarios, solicitudes de visita, reseñas y actividades.

### Usuario de prueba principal

```text
Email: juan@pinamarpropiedades.com
Contraseña: Clave123!
Inmobiliaria: Pinamar Propiedades
```

### Segundo usuario de prueba

```text
Email: maria@costainmuebles.com
Contraseña: Clave123!
Inmobiliaria: Costa Inmuebles
```

## Verificación del frontend

Para comprobar que el frontend compila correctamente:

```bash
cd front
npm run build
```