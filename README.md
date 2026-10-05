# Forms Senescyt Backend

API REST modular para el frontend Angular de Forms Senescyt.

## Requisitos

- Node.js 20 o superior
- npm
- Docker Desktop para PostgreSQL local

## Instalación

```powershell
npm install
Copy-Item .env.example .env
```

## PostgreSQL local

```powershell
docker compose up -d postgres
```

La base de datos usa PostgreSQL. No se utiliza SQLite.

## Prisma

```powershell
npm run db:generate
npm run db:migrate:deploy
npm run db:seed
npm run db:check
```

El modelo Prisma incluye estudiantes, catálogos geográficos, colegios, composición familiar, ingresos familiares y documentos, según `../CONTRACT.md`.
La migración inicial está en `prisma/migrations/20261005000000_init`.

## Desarrollo

```powershell
npm run start:dev
```

Rutas disponibles:

- API: `http://localhost:3008/api`
- Comprobación de estado: `http://localhost:3008/api/health`
- Swagger: `http://localhost:3008/docs`

El frontend Angular debe usar el proxy configurado para enviar `/api` a `http://localhost:3008`.

Consulta la guía completa en [ANGULAR_INTEGRATION.md](ANGULAR_INTEGRATION.md) y ejemplos HTTP en [http/forms-senecyt.http](http/forms-senecyt.http).

## Configuración de entorno

`.env.example` contiene valores de ejemplo de producción para Docker Compose:

```env
NODE_ENV=production
PORT=3008
CORS_ORIGINS=https://admin.example.com,https://forms.example.com
POSTGRES_DB=senescyt
POSTGRES_USER=senescyt
POSTGRES_PASSWORD=REPLACE_WITH_RANDOM_HEX_PASSWORD
DATABASE_URL=postgresql://senescyt:REPLACE_WITH_RANDOM_HEX_PASSWORD@postgres:5432/senescyt?schema=public
STORAGE_DRIVER=local
STORAGE_ROOT=storage
PUBLIC_BASE_URL=https://api.example.com
SWAGGER_ENABLED=false
```

En Compose, el nombre de host de PostgreSQL debe ser `postgres`. Para ejecutar NestJS directamente en el equipo anfitrión, cambia el nombre de host de `DATABASE_URL` a `localhost` y configura `NODE_ENV=development`. Nunca uses `localhost` desde el contenedor del backend.

## Flujo de migración reproducible

```powershell
npm install
Copy-Item .env.example .env
npm run db:generate
npm run db:migrate:deploy
npm run db:seed
npm run db:check
```

Para crear una migración durante desarrollo después de cambiar `schema.prisma`:

```powershell
npm run db:migrate -- --name nombre_del_cambio
npm run db:generate
```

## Swagger

Con el backend iniciado, abre `http://localhost:3008/docs`. Swagger documenta la comprobación de estado, los catálogos, las enumeraciones, las operaciones CRUD de estudiantes, el guardado por pasos y las rutas multipart para documentos.

## Pruebas

Las pruebas e2e cubren:

- Comprobación de estado, enumeraciones y catálogos.
- Operaciones CRUD y búsqueda de estudiantes.
- Guardado parcial y estados de fase.
- Composición e ingresos familiares.
- Carga y eliminación de documentos.
- Validación de archivos y protección de URLs.

## Validación

```powershell
npm run build
npm test
npm run test:e2e
npm run lint
npm run format:check
```

## Scripts disponibles

- `npm run start:dev`: servidor con recarga.
- `npm run build`: compilación TypeScript.
- `npm run test`: pruebas unitarias.
- `npm run test:e2e`: pruebas e2e.
- `npm run db:migrate`: migración de desarrollo.
- `npm run db:migrate:deploy`: aplicar migraciones existentes.
- `npm run db:generate`: generar cliente Prisma.
- `npm run db:studio`: abrir Prisma Studio.
- `npm run db:seed`: cargar los datos semilla.
- `npm run db:check`: comprobar la conexión a PostgreSQL con `SELECT 1`.

## Producción con Docker

Este backend se despliega como un proyecto Compose independiente. Copia `.env.example` a `.env`, configura los dominios reales y sustituye la contraseña de ejemplo por un secreto aleatorio. En `DATABASE_URL`, usa el nombre de host `postgres` (nunca `localhost` desde un contenedor) y mantén el usuario, la contraseña y la base de datos iguales a `POSTGRES_USER`, `POSTGRES_PASSWORD` y `POSTGRES_DB`. No subas `.env` a GitHub.

```sh
docker compose build
docker compose up -d
docker compose ps
docker compose logs -f backend
```

Compose espera a que PostgreSQL pase `pg_isready`, aplica las migraciones existentes con Prisma en un servicio de una sola ejecución y después inicia la API con un usuario sin privilegios de administrador. PostgreSQL no publica ningún puerto en el equipo anfitrión. Los volúmenes `senescyt-postgres-data` y `senescyt-uploads` conservan la base de datos y los archivos subidos. `docker compose down` conserva los volúmenes; `docker compose down -v` los elimina permanentemente.

En una base de datos nueva y vacía, inicializa los catálogos requeridos antes de abrir el sitio a usuarios con `docker compose run --rm migrate npm run db:seed`. El proceso de carga semilla elimina identificadores de catálogos ausentes de sus datos fuente; haz una copia de seguridad y revisa sus cambios antes de ejecutarlo contra una base existente. No se ejecuta automáticamente al reiniciar.

Configura `CORS_ORIGINS` con los dos orígenes exactos de producción, separados por comas, y `PUBLIC_BASE_URL` con el origen HTTPS público de la API. Swagger se desactiva por defecto en producción. Para información operativa, migraciones, proxy TLS y resolución de problemas, consulta [PROXMOX_DEPLOYMENT.md](PROXMOX_DEPLOYMENT.md).

**Seguridad pendiente antes de exposición pública:** los controladores actuales no implementan autenticación ni autorización. CORS no protege frente a clientes que no sean navegadores. Debido a los datos personales gestionados por la API, no la expongas a Internet hasta implementar una política de autenticación/autorización o limitar su acceso a una VPN/red privada de confianza.
