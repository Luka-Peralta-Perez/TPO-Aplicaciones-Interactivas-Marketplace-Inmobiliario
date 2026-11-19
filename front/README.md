# Frontend — Marketplace Inmobiliario

Frontend del Trabajo Práctico Obligatorio de **Aplicaciones Interactivas**.

La aplicación está desarrollada con **React, TypeScript y Vite** y consume la API REST ubicada en la carpeta `back/`.

## Convención de estilos

El frontend utiliza estilos globales para la base de la aplicación, CSS Modules para los estilos específicos de páginas y componentes, y estilos inline únicamente para valores calculados dinámicamente durante el render.

## Requisitos

- Node.js
- npm
- Backend del proyecto levantado

## Instalación

Desde la raíz del repositorio:

```bash
cd front
npm install
```

## Variables de entorno

Crear un archivo `.env` en la carpeta `front` tomando como referencia `.env.example`.

```env
VITE_API_URL=http://localhost:3000
```

`VITE_API_URL` indica la URL base de la API utilizada por el frontend.

## Ejecutar el frontend

Con el backend funcionando en `http://localhost:3000`:

```bash
npm run dev
```

La aplicación queda disponible en:

```text
http://localhost:5173
```

## Compilar

Para verificar que TypeScript y Vite compilan correctamente:

```bash
npm run build
```

La versión compilada se genera en:

```text
dist/
```

## Estructura principal

```text
src/
├── auth/          Autenticación y contexto de sesión
├── components/    Componentes reutilizables
├── hooks/         Custom hooks y lógica reutilizable
├── pages/         Pantallas de la aplicación
├── services/      Comunicación con la API
├── comun/         Configuración y utilidades compartidas
└── types/         Tipos de TypeScript
```

La aplicación utiliza **CSS Modules** para encapsular los estilos de páginas y componentes.

## Funcionalidades principales

El frontend permite:

- buscar, filtrar y ordenar propiedades publicadas;
- ver el detalle de una propiedad;
- consultar el sitio público de una inmobiliaria;
- enviar consultas y solicitudes de visita;
- dejar reseñas;
- registrar e iniciar sesión como vendedor;
- administrar propiedades propias;
- crear y editar publicaciones;
- cambiar el estado de las propiedades y consultar su historial;
- responder consultas;
- gestionar solicitudes de visita;
- editar los datos de la inmobiliaria;
- consultar actividad y reportes del vendedor.

## Backend

La API debe estar levantada antes de utilizar las funcionalidades que dependen de datos.

Para la configuración completa del proyecto consultar:

- [`../README.md`](../README.md)
- [`../back/README.md`](../back/README.md)