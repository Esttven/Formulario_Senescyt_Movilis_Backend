# Integración con Angular

## 1. Preparar PostgreSQL

Si PostgreSQL 16 ya está instalado en Windows, asegúrate de que el servicio esté iniciado:

```powershell
Get-Service postgresql-x64-16
```

Desde `backend/` crea el archivo de entorno:

```powershell
Copy-Item .env.example .env
```

Aplica el schema y los catálogos:

```powershell
npm install
npm run db:generate
npm run db:migrate:deploy
npm run db:seed
npm run db:check
```

También existe `docker-compose.yml` para usar PostgreSQL en Docker:

```powershell
docker compose up -d postgres
```

## 2. Iniciar el backend

En una terminal:

```powershell
cd backend
npm run start:dev
```

URLs:

- API: `http://localhost:3008/api`
- Swagger: `http://localhost:3008/docs`
- Health: `http://localhost:3008/api/health`
- Archivos locales: `http://localhost:3008/uploads/...`

## 3. Iniciar el frontend

En otra terminal, desde la raíz Angular:

```powershell
npm start
```

El frontend usa `apiUrl: '/api'` en `src/environments/environment.ts`. El archivo raíz `proxy.conf.json` redirige `/api` hacia `http://localhost:3008` y elimina el prefijo `/api`.

Por eso las llamadas Angular como:

```text
/api/estudiantes/enums
/api/estudiantes/guardar-paso
```

llegan al backend como:

```text
http://localhost:3008/estudiantes/enums
http://localhost:3008/estudiantes/guardar-paso
```

No cambies el `apiUrl` del frontend a `http://localhost:3008/api` mientras uses el proxy, porque duplicaría el prefijo.

## 4. Flujo de documentos

El frontend puede subir un archivo solo con el campo multipart `archivo`:

```typescript
const formData = new FormData();
formData.append('archivo', file, file.name);
```

El backend devuelve:

```json
{ "url": "http://localhost:3008/uploads/titulo/uuid.pdf" }
```

La URL debe guardarse en el payload posterior del estudiante. También se puede asociar inmediatamente usando `?estudianteId=123`.

## 5. Comprobación rápida

```powershell
Invoke-RestMethod http://localhost:3008/api/health
Invoke-RestMethod http://localhost:3008/api/estudiantes/enums
Invoke-RestMethod http://localhost:3008/api/paises
```

Si falla la carga de catálogos, verifica primero PostgreSQL, `DATABASE_URL`, el proceso NestJS y el proxy Angular.
