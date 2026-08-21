# ShipNow API — Módulo 1: Estructura profesional

API de ShipNow refactorizada desde un modelo monolítico hacia una
arquitectura por capas (**Controller → Service → Repository**), con
configuración de entorno validada al arranque.

## Estructura del proyecto

```
src/
├── config/
│   └── env.config.js       # única fuente de verdad para process.env, validado
├── constants/
│   └── index.js             # roles y estados, con Object.freeze
├── models/
│   ├── product.model.js     # solo esquema Mongoose
│   └── user.model.js        # solo esquema Mongoose
├── repositories/
│   ├── product.repository.js  # único lugar que conoce Mongoose
│   └── user.repository.js
├── services/
│   ├── product.service.js   # lógica de negocio
│   └── user.service.js
├── controllers/
│   ├── product.controller.js  # única puerta de entrada HTTP
│   └── user.controller.js
├── routes/
│   ├── product.routes.js    # mínimas: path -> método del Controller
│   ├── user.routes.js
│   └── index.js
├── app.js                   # configuración de Express y middlewares
└── server.js                # arranque: valida env, conecta DB, levanta server
```

Flujo de dependencias: **Controller → Service → Repository**. El
Controller nunca importa Mongoose directamente.

## Instrucciones para correr el proyecto localmente

1. Cloná el repositorio e instalá dependencias:

   ```bash
   npm install
   ```

2. Copiá `.env.example` a `.env` y completá los valores reales:

   ```bash
   cp .env.example .env
   ```

3. Levantá el servidor:

   ```bash
   npm run dev   # con nodemon, recarga en caliente
   # o
   npm start
   ```

4. Verificá que está vivo:

   ```bash
   curl http://localhost:3000/health
   ```

Si falta una variable crítica (por ejemplo `MONGODB_URI`) en `.env`,
la app **no arranca** y muestra un error descriptivo indicando
exactamente qué variable falta.

## Endpoints principales

| Método | Ruta               | Descripción            |
|--------|---------------------|-------------------------|
| GET    | `/api/products`     | Lista productos         |
| GET    | `/api/products/:id` | Obtiene un producto     |
| POST   | `/api/products`     | Crea un producto        |
| PUT    | `/api/products/:id` | Actualiza un producto   |
| DELETE | `/api/products/:id` | Elimina un producto     |
| GET    | `/api/users`        | Lista usuarios          |
| GET    | `/api/users/:id`    | Obtiene un usuario      |
| POST   | `/api/users`        | Crea un usuario         |
| PUT    | `/api/users/:id`    | Actualiza un usuario    |
| DELETE | `/api/users/:id`    | Elimina un usuario      |

## Por qué se separó la lógica entre Service y Repository

El **Repository** es el único módulo que conoce Mongoose: se encarga
exclusivamente de leer y escribir datos, incluyendo detalles de bajo
nivel como proyecciones (`select`) y filtros por defecto. No decide
nada sobre reglas de negocio — así, si mañana cambiamos MongoDB por
otra base de datos, solo hay que tocar esta capa.

El **Service** concentra las reglas de negocio: qué significa que un
producto esté "disponible", si un email ya está en uso antes de crear
un usuario, qué rol le corresponde a alguien por defecto, etc. Esta
separación permite testear la lógica de negocio sin necesidad de una
base de datos real (mockeando el Repository), y evita que el
Controller o el Repository terminen acumulando responsabilidades que
no les corresponden.

El **Controller**, por su parte, solo traduce HTTP: lee `req`, llama
al Service y devuelve el status code apropiado. No sabe nada de
Mongoose ni de reglas de negocio.

## Notas de diseño

- **`src/config/env.config.js`** centraliza `dotenv` y valida
  `PORT`, `MONGODB_URI` y `NODE_ENV` al arrancar. Ningún otro archivo
  lee `process.env` directamente.
- **`src/constants/index.js`** define `ROLES` y `PRODUCT_STATUS` con
  `Object.freeze`, para no tener strings mágicos repartidos por el
  código.
- Los **Repositories** no son "pasamanos": aplican proyecciones
  (`select('-__v')`) y filtros por defecto en vez de un simple
  `Model.find()`.
