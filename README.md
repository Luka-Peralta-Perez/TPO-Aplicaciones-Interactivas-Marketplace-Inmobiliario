# TPO 2026 — Marketplace Inmobiliario

Trabajo Practico Integrador de **Aplicaciones Interactivas** — UADE 2026.

Plataforma web de tipo marketplace para la publicacion y busqueda de propiedades inmobiliarias.

---

## Estructura del proyecto

```text
back/    API REST - TypeScript - Express 5 - TypeORM - PostgreSQL
front/   Aplicacion cliente - React - TypeScript - Vite
```

## Tech Stack

| Capa      | Tecnologias                                      |
|-----------|--------------------------------------------------|
| Backend   | Node.js 22+, Express 5, TypeORM, PostgreSQL 16+  |
| Frontend  | React, TypeScript, Vite                          |
| Lenguaje  | TypeScript                                       |

---

## Requisitos previos

- **Node.js** 22 o superior
- **PostgreSQL** 16 o superior
- **npm** (incluido con Node.js)

## Inicio rapido

### Backend

```bash
cd back
cp .env.example .env      # Configurar las variables de entorno (host, puerto, usuario, contraseña, base de datos)
npm install
npm run migration:run     # Ejecutar las migraciones
npm run seed              # Poblar la base de datos con datos iniciales
npm run dev               # Levantar el servidor en modo desarrollo
```

La API queda disponible en `http://localhost:3000`.

### Frontend

```bash
cd front
npm install
npm run dev
```

---

## Progreso del desarrollo

### Sprint 1 — Configuracion base y CRUD de Propiedades

**Persistencia y base de datos**
- Configuracion completa de **PostgreSQL** como motor de base de datos.
- Creacion y ejecucion de **migraciones** con TypeORM (migracion inicial del esquema + migracion de renombramiento de columna `etiquetas` a `amenities` por claridad semantica).
- Armado del **seed** con datos iniciales de prueba (inmobiliarias y propiedades de ejemplo).

**Arquitectura del backend**
- Creacion de **repositorios** para las entidades `Propiedad` e `Inmobiliaria`.
- Implementacion del **service** de Propiedad (logica de negocio).
- Definicion del **DTO** de Propiedad (validacion de datos de entrada con `class-validator`).
- Manejo centralizado de **errores** (`NotFoundError` y middleware `errorHandler`).
- Implementacion del **controller** de Propiedad.
- Definicion de las **routes** de Propiedad (CRUD completo).
- Express se levanta **despues de conectar exitosamente** con PostgreSQL.

**Endpoints disponibles — Propiedades**

| Metodo   | Ruta                   | Descripcion                      |
|----------|------------------------|----------------------------------|
| `GET`    | `/propiedades`         | Listar todas las propiedades     |
| `GET`    | `/propiedades/:id`     | Obtener una propiedad por ID     |
| `POST`   | `/propiedades`         | Crear una nueva propiedad        |
| `PATCH`  | `/propiedades/:id`     | Actualizar una propiedad         |
| `DELETE` | `/propiedades/:id`     | Eliminar una propiedad           |

**Estado:** API probada y funcional — devuelve correctamente todas las propiedades.

---

## Scripts disponibles (backend)

| Script                  | Descripcion                                  |
|-------------------------|----------------------------------------------|
| `npm run dev`           | Servidor en modo desarrollo (hot reload)     |
| `npm run build`         | Compilar TypeScript a JavaScript             |
| `npm start`             | Ejecutar la version compilada                |
| `npm run migration:run` | Ejecutar migraciones pendientes              |
| `npm run migration:revert` | Revertir la ultima migracion              |
| `npm run seed`          | Poblar la base de datos con datos de prueba  |

---

## Equipo

- Ivanec, Mora Amalia
- Peralta Perez, Luka Andrés
