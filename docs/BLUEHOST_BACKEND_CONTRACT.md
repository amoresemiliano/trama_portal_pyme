# TRAMA — Contrato de Arquitectura Backend (Bluehost + PHP + MySQL)

Este documento detalla la arquitectura preparada para conectar el frontend de **TRAMA** (desplegado en **Vercel**) con un backend independiente en **Bluehost (PHP + MySQL)** sin introducir servicios cloud ni bases de datos de terceros.

> **Estado actual del MVP**: El aplicativo funciona en **Modo Demo Persistente** (`VITE_DATA_MODE="demo"`), utilizando `localStorage` mediante la abstracción `src/repositories/tramaRepository.ts`. Ninguna credencial ni integración activa de base de datos ha sido configurada todavía.

---

## 1. Requisitos a verificar en Bluehost antes de implementar el backend

Antes de escribir y desplegar los scripts PHP en Bluehost, el equipo técnico debe confirmar en cPanel / soporte de Bluehost:

1. **Versión de PHP**: Confirmar disponibilidad de PHP 8.2+ con extensiones `pdo_mysql`, `mbstring`, `json`, `openssl`, `fileinfo`.
2. **Base de datos MySQL**: Verificar versión (MySQL 8.0+ o MariaDB 10.6+), límites de conexiones simultáneas y soporte `utf8mb4_unicode_ci`.
3. **Subdominio y HTTPS/SSL**: Confirmar subdominio dedicado (por ejemplo `api.tudominio.com.ar`) con certificado SSL activo para permitir CORS con credenciales desde el dominio de Vercel.
4. **Rutas de despliegue y estructura segura**: Verificar carpeta fuera de `public_html` para archivos `.env` / configuración de credenciales de base de datos, evitando exposición pública.
5. **Restricciones de métodos HTTP y `.htaccess`**: Confirmar soporte para `mod_rewrite`, encabezados `Authorization`, y métodos `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`.
6. **Límites de subida de archivos y almacenamiento**: Confirmar `upload_max_filesize`, `post_max_size` y permisos de escritura en carpeta de carga de imágenes (validando MIME real, renombrado seguro y límite de peso).
7. **Envío de correos transaccionales**: Verificar límites SMTP / SPF / DKIM para emails de verificación y notificaciones de match.

---

## 2. Contrato REST API (`VITE_API_BASE_URL`)

El frontend se comunicará con la URL definida en `VITE_API_BASE_URL` usando JSON:

- **Autenticación y sesión**
  - `POST /auth/register` — Registro con hash `password_hash(..., PASSWORD_ARGON2ID)` o `PASSWORD_BCRYPT`.
  - `POST /auth/login` — Validación server-side y emisión de sesión segura (cookie `HttpOnly`, `Secure`, `SameSite=None` + token CSRF).
  - `POST /auth/logout` — Revocación de sesión.
  - `GET /auth/me` — Usuario autenticado, roles y membresías de empresas.
- **Empresas y membresías**
  - `GET /companies` — Búsqueda y filtros paginados (país, provincia, ciudad, sector, tamaño, exportación, verificación).
  - `GET /companies/{slug}` — Detalle público del perfil.
  - `POST /companies` — Creación de empresa + membresía `owner`.
  - `PUT /companies/{id}` — Actualización (validando membresía y rol).
- **Match B2B y conexiones**
  - `GET /matches/candidates?companyId=...` — Candidatas rankeadas.
  - `POST /matches/decision` — Registra `interested | passed | saved`; si es mutuo crea registro en `connections` y `conversations`.
  - `GET /connections` — Conexiones activas de la empresa.
- **Mensajería**
  - `GET /conversations` y `GET /conversations/{id}/messages`
  - `POST /conversations/{id}/messages`
- **Oportunidades comerciales**
  - `GET /opportunities`, `POST /opportunities`, `PUT /opportunities/{id}`, `POST /opportunities/{id}/interest`
- **Eventos, Capacitación, Recursos y Organizaciones**
  - `GET /events`, `POST /events/{id}/register`
  - `GET /courses`, `POST /courses/{id}/enroll`
  - `GET /resources`, `GET /organizations`, `GET /communities`
- **Administración (requiere rol `admin`)**
  - `PATCH /admin/companies/{id}/verification`
  - `GET /admin/moderation`, `PATCH /admin/moderation/{id}`
  - `GET /admin/analytics`, `GET /admin/audit-logs`

---

## 3. Esquema relacional MySQL normalizado (compatible con expansión LATAM)

Tablas principales mapeadas 1:1 con `src/types/domain.ts`:

- `countries (id, iso_code, name)`
- `provinces (id, country_id, name, region_name)`
- `cities (id, province_id, name)`
- `users (id, full_name, email UNIQUE, password_hash, role, status, created_at)`
- `companies (id, slug UNIQUE, name, legal_name, industry_id, subindustry, country_id, province_id, city_id, size, operation_type, commercial_model, export_readiness, verification_status, plan_tier, featured, status, created_at)`
- `company_memberships (id, user_id, company_id, member_role, joined_at)`
- `taxonomy_terms (id, type ENUM('industry','capability','need','tag','certification'), label)`
- `company_taxonomy (company_id, term_id, relation_type ENUM('offering','need','capability','tag','certification'))`
- `opportunities (id, company_id, title, description, category, sector, province_id, budget, deadline, status, is_corporate_procurement, created_at)`
- `opportunity_interests (opportunity_id, company_id, created_at)`
- `match_decisions (id, from_company_id, to_company_id, action, created_at)`
- `connections (id, company_a_id, company_b_id, compatibility_score, status, created_at)`
- `conversations (id, company_a_id, company_b_id, context_label, updated_at)`
- `messages (id, conversation_id, sender_company_id, sender_user_id, body, is_read, created_at)`
- `events`, `courses`, `resources`, `organizations`, `communities`
- `moderation_items` y `audit_logs`

---

## 4. Controles de seguridad obligatorios para producción

- Consultas parametrizadas estrictas con PDO (`$stmt->prepare` / `execute`), nunca concatenación SQL.
- Validación y sanitización de inputs server-side (longitudes, tipos, listas permitidas).
- Contraseñas hasheadas con Argon2id/Bcrypt y rate limiting por IP/cuenta en `/auth/login` y `/auth/register`.
- Verificación estricta de autorización basada en `company_memberships` y `users.role` en cada endpoint.
- Encabezados CORS acotados únicamente al dominio de Vercel + protección CSRF.
- Nunca almacenar ni exponer secretos en el frontend.
