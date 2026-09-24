# TPO Aplicaciones Interactivas - Backend

API REST para un marketplace inmobiliario desarrollada con **Node.js, Express 5, TypeScript, TypeORM y PostgreSQL**.

El proyecto permite gestionar vendedores, inmobiliarias, propiedades, comentarios, solicitudes de visita, reseñas, historial de estados y un feed de actividad.

## Requisitos

Antes de ejecutar el proyecto es necesario tener instalado:

- Node.js
- npm
- PostgreSQL
- Git

También se recomienda tener **pgAdmin** para administrar la base de datos y la extensión **REST Client** de Visual Studio Code para ejecutar el archivo `requests.http`.

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/Luka-Peralta-Perez/TPO-Aplicaciones-Interactivas-Marketplace-Inmobiliario.git
```

Ingresar a la carpeta del backend:

```bash
cd back
```

Instalar las dependencias:

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env` en la raíz de la carpeta `back` tomando como referencia `.env.example`.

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

### Variables utilizadas

| Variable | Descripción |
| --- | --- |
| `PORT` | Puerto donde se ejecuta la API. Por defecto `3000`. |
| `DB_HOST` | Host de PostgreSQL. Por defecto `localhost`. |
| `DB_PORT` | Puerto de PostgreSQL. Por defecto `5432`. |
| `DB_USER` | Usuario de PostgreSQL. |
| `DB_PASSWORD` | Contraseña del usuario de PostgreSQL. |
| `DB_NAME` | Nombre de la base de datos. |
| `JWT_SECRET` | Clave utilizada para firmar y verificar los tokens JWT. |

## Crear la base de datos

Crear en PostgreSQL una base vacía llamada:

```text
tpo_inmobiliario
```

### Desde pgAdmin

1. Abrir pgAdmin.
2. Desplegar el servidor de PostgreSQL.
3. Hacer clic derecho sobre `Databases`.
4. Seleccionar `Create > Database`.
5. Ingresar `tpo_inmobiliario` como nombre.
6. Guardar.

No es necesario crear las tablas manualmente. La estructura se crea mediante migraciones de TypeORM.

## Ejecutar las migraciones

Con PostgreSQL funcionando, la base creada y el archivo `.env` configurado:

```bash
npm run migration:run
```

Este comando crea las tablas, relaciones y restricciones necesarias.

El proyecto utiliza:

```text
synchronize: false
```

por lo que los cambios de estructura de la base de datos se administran mediante migraciones.

## Cargar datos de prueba

Una vez ejecutadas las migraciones:

```bash
npm run seed
```

El seed carga datos de ejemplo para poder probar la aplicación sin tener que crear todo manualmente.

Actualmente carga:

- 2 vendedores;
- 2 inmobiliarias;
- 9 propiedades en distintos estados;
- historial de estados;
- comentarios;
- solicitudes de visita;
- reseñas;
- actividades leídas y no leídas.

### Credenciales de prueba

#### Juan - Pinamar Propiedades

```text
Email: juan@pinamarpropiedades.com
Contraseña: Clave123!
Inmobiliaria ID: 1
```

#### María - Costa Inmuebles

```text
Email: maria@costainmuebles.com
Contraseña: Clave123!
Inmobiliaria ID: 2
```

Los dos usuarios permiten probar tanto operaciones autorizadas como casos en los que un vendedor intenta acceder a recursos pertenecientes a otra inmobiliaria.

## Ejecutar el proyecto

Para levantar el servidor en modo desarrollo:

```bash
npm run dev
```

Si no se modifica `PORT`, la API queda disponible en:

```text
http://localhost:3000
```

## Verificar que la API funciona

Con el servidor levantado:

```http
GET http://localhost:3000/health
```

## Compilar el proyecto

Para comprobar que TypeScript compila correctamente:

```bash
npm run build
```

El código compilado se genera en la carpeta `dist`.

Para ejecutar la versión compilada:

```bash
npm start
```

> Antes de usar `npm start` debe haberse ejecutado `npm run build`.

## Ejecutar tests

Para ejecutar las pruebas automáticas:

```bash
npm test
```

Actualmente se incluye una prueba automática que verifica la generación de actividades cuando se crean:

- comentarios;
- solicitudes de visita;
- reseñas.

## Probar los endpoints

En la raíz del backend se incluye:

```text
requests.http
```

Este archivo permite ejecutar requests directamente desde Visual Studio Code utilizando la extensión **REST Client**.

### Cómo usarlo

1. Levantar la API con `npm run dev`.
2. Abrir `requests.http` en Visual Studio Code.
3. Presionar `Send Request` sobre la request que se quiera ejecutar.

Para las rutas protegidas primero se debe iniciar sesión.

## Funcionalidades principales

La API incluye las siguientes funcionalidades:

- registro e inicio de sesión de vendedores;
- autenticación mediante JWT;
- gestión de inmobiliarias;
- creación, consulta y actualización de propiedades;
- búsqueda, filtros, ordenamiento y paginación de propiedades publicadas;
- control de propiedad de los recursos por vendedor;
- ciclo de vida y cambio de estado de propiedades;
- historial de cambios de estado;
- comentarios y respuestas;
- solicitudes de visita y cambio de estado;
- reseñas de inmobiliarias;
- feed de actividad;
- contador de actividades no leídas;
- validación de datos con `class-validator`;
- manejo centralizado de errores.

## Arquitectura

El backend está organizado por capas para separar responsabilidades.

```text
src/
├── config/         Configuración de TypeORM y PostgreSQL
├── controllers/    Entrada y salida HTTP y validación de datos
├── entities/       Entidades y relaciones persistidas
├── errors/         Errores personalizados
├── middlewares/    Autenticación y manejo centralizado de errores
├── migrations/     Cambios versionados de la base de datos
├── repositories/   Acceso y consultas a PostgreSQL
├── routes/         Definición de endpoints
├── seeds/          Datos iniciales de prueba
├── services/       Reglas de negocio
├── tests/          Pruebas automáticas
├── types/          Extensiones de tipos de TypeScript
└── utils/          Funciones auxiliares reutilizables
```

## Orden recomendado para levantar el proyecto desde cero

Clonar el proyecto e instalar las dependencias:

```bash
git clone https://github.com/Luka-Peralta-Perez/TPO-Aplicaciones-Interactivas-Marketplace-Inmobiliario.git
cd back
npm install
```

Después:

1. Crear y configurar el archivo `.env`.
2. Crear la base de datos `tpo_inmobiliario` en PostgreSQL.
3. Ejecutar:

```bash
npm run migration:run
npm run seed
npm run dev
```

4. Verificar:

```http
GET http://localhost:3000/health
```

Si responde:

```json
{
  "status": "ok"
}
```

el backend quedó correctamente configurado y listo para probarse con `requests.http`.