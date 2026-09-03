# ShipNow API — Módulo 1 y 2: Estructura profesional + Mocking

API de ShipNow refactorizada desde un modelo monolítico hacia una
arquitectura por capas (**Controller → Service → Repository**), con
configuración de entorno validada al arranque (Módulo 1) y un módulo de
mocking para generar datos de prueba (Módulo 2).

## Estructura del proyecto

```
src/
├── config/
│   └── env.config.js         # única fuente de verdad para process.env, validado
├── constants/
│   └── index.js               # roles, estados, prioridades y colecciones mockeables
├── models/
│   ├── product.model.js       # solo esquema Mongoose
│   ├── user.model.js          # solo esquema Mongoose (ADMIN, USER, REPARTIDOR)
│   ├── order.model.js         # Pedido: items, total, status, priority, customer (ref User)
│   └── delivery.model.js      # Entrega: order (ref Order), courier (ref User), status
├── repositories/
│   ├── product.repository.js  # único lugar que conoce Mongoose para Products
│   ├── user.repository.js
│   └── mock.repository.js     # único lugar que conoce Mongoose para el mocking
├── services/
│   ├── product.service.js     # lógica de negocio
│   ├── user.service.js
│   └── mock.service.js        # arma y guarda datos simulados, resuelve relaciones
├── controllers/
│   ├── product.controller.js  # única puerta de entrada HTTP
│   ├── user.controller.js
│   └── mock.controller.js
├── routes/
│   ├── product.routes.js      # mínimas: path -> método del Controller
│   ├── user.routes.js
│   ├── mock.routes.js         # /api/mocks
│   └── index.js
├── utils/
│   └── mock-data.factory.js   # construye objetos falsos con faker + constantes
├── app.js                     # configuración de Express y middlewares
└── server.js                  # arranque: valida env, conecta DB, levanta server
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
| GET    | `/api/mocks/:coleccion`      | Genera datos simulados sin guardarlos (`usuarios`, `repartidores`, `pedidos`, `entregas`) |
| POST   | `/api/mocks/seed/:coleccion` | Inserta datos simulados en MongoDB, resolviendo relaciones |

## Módulo de mocking (`/api/mocks`)

Genera datos de prueba (usuarios, repartidores, pedidos y entregas)
respetando la arquitectura por capas y las constantes del proyecto
(`ROLES`, `ORDER_STATUS`, `ORDER_PRIORITY`, `DELIVERY_STATUS`). Las
colecciones válidas están definidas en `MOCK_COLLECTIONS`:
`usuarios`, `repartidores`, `pedidos`, `entregas`.

### 1. Preview: generar datos simulados sin guardarlos

```
GET /api/mocks/:coleccion?qty=N
```

- `qty` es opcional (por defecto 5, máximo 100).
- No toca la base de datos: solo arma objetos en memoria con
  [`@faker-js/faker`](https://www.npmjs.com/package/@faker-js/faker) y
  los devuelve tal cual.
- En `pedidos` y `entregas`, la relación con el usuario/repartidor se
  ve embebida en el JSON (porque todavía no existe ningún documento
  real en la base).

Ejemplo:

```bash
curl "http://localhost:3000/api/mocks/usuarios?qty=2"
```

```json
[
  { "name": "Ana Pérez", "email": "ana.perez@test.com", "password": "x7Hq2pLm", "role": "USER" },
  { "name": "Luis Gómez", "email": "luis.gomez@test.com", "password": "aP9wVn3k", "role": "USER" }
]
```

```bash
curl "http://localhost:3000/api/mocks/entregas?qty=1"
```

```json
[
  {
    "status": "IN_PROGRESS",
    "estimatedDeliveryDate": "2026-09-01T03:57:18.184Z",
    "order": {
      "items": [{ "name": "Recycled Steel Chips", "quantity": 4, "price": 61.49 }],
      "total": 245.96,
      "status": "CANCELLED",
      "priority": "LOW",
      "customer": { "name": "Patrick Moore", "email": "clement50@yahoo.com", "role": "USER" }
    },
    "courier": { "name": "Johnathon Kuphal", "email": "favian_padberg13@hotmail.com", "role": "REPARTIDOR" }
  }
]
```

### 2. Seed: insertar datos simulados en MongoDB

```
POST /api/mocks/seed/:coleccion?qty=N
```

- Inserta `N` documentos reales en la base para la colección pedida.
- **Resuelve relaciones automáticamente**: si pedís `pedidos` y no hay
  suficientes usuarios (`ROLES.USER`) en la base, primero crea los
  que faltan y recién después crea los pedidos apuntando a ellos con
  su `_id` real. Lo mismo pasa con `entregas`: si faltan repartidores
  o pedidos, los crea antes de vincular la entrega.
- Responde con la cantidad insertada y el nombre de la colección.

Ejemplo:

```bash
curl -X POST "http://localhost:3000/api/mocks/seed/usuarios?qty=10"
```

```json
{ "insertados": 10, "coleccion": "usuarios" }
```

```bash
# Si la base está vacía, esto crea automáticamente los repartidores
# y pedidos necesarios antes de insertar las entregas.
curl -X POST "http://localhost:3000/api/mocks/seed/entregas?qty=4"
```

```json
{ "insertados": 4, "coleccion": "entregas" }
```

### Orden sugerido para probar

Podés sembrar en cualquier orden (las relaciones se resuelven solas),
pero para ver el flujo completo:

```bash
curl -X POST "http://localhost:3000/api/mocks/seed/usuarios?qty=5"
curl -X POST "http://localhost:3000/api/mocks/seed/repartidores?qty=3"
curl -X POST "http://localhost:3000/api/mocks/seed/pedidos?qty=8"
curl -X POST "http://localhost:3000/api/mocks/seed/entregas?qty=5"
```

### Errores manejados

- Colección inválida (por ejemplo `/api/mocks/facturas`) → `400` con
  el listado de colecciones válidas.
- `qty` no numérico, cero, negativo o mayor a 100 → `400` con un
  mensaje descriptivo.

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
- **`src/utils/mock-data.factory.js`** solo construye objetos falsos
  con `faker` y las constantes del dominio; no sabe nada de Mongoose
  ni decide relaciones. Esa decisión (a qué usuario real le
  corresponde un pedido, por ejemplo) vive en `mock.service.js`.
- **`mock.service.js`** es el único lugar que decide relaciones y que
  "asegura" datos faltantes (si pedís entregas sin tener repartidores
  o pedidos, los crea primero). El `mock.repository.js` solo sabe
  insertar y buscar; no decide nada de negocio.
