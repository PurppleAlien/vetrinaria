# Sistema de Gestión Veterinaria — Arquitectura y Plan de Desarrollo

---

## 1. ARQUITECTURA DEL SISTEMA

### 1.1 Diagrama de Arquitectura General

```
┌──────────────────────────────────────────────────────────────────────┐
│                        CLIENTES (Frontend)                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────────┐ │
│  │ Web App  │  │ Mobile   │  │ Portal  │  │ Widget Embebido   │ │
│  │ (Admin/  │  │ App      │  │ Cliente │  │ Reserva Online    │ │
│  │  Staff)  │  │ (Staff)  │  │ (Dueño) │  │ (iframe/API)      │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └─────────┬──────────┘ │
└───────┼──────────────┼──────────────┼──────────────────┼───────────┘
        │              │              │                  │
        │              │              │                  │
┌───────┴──────────────┴──────────────┴──────────────────┴───────────┐
│                       CAPA DE PRESENTACIÓN                          │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              Next.js 15 (App Router)                        │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │  │
│  │  │ Server   │  │ Client   │  │ React    │  │ Layouts  │   │  │
│  │  │Components│  │Components│  │ Server   │  │ Templ.   │   │  │
│  │  └──────────┘  └──────────┘  │ Actions  │  └──────────┘   │  │
│  │                              └──────────┘                  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  UI: shadcn/ui + Radix UI + TailwindCSS + Framer Motion             │
│  Forms: React Hook Form + Zod                                       │
│  Calendar: FullCalendar                                             │
│  Charts: Recharts / Chart.js                                        │
└─────────────────────────────────────────────────────────────────────┘
        │              │              │                  │
        │        ┌─────┘              └──────┐           │
        │        │         HTTP/REST         │           │
        ▼        ▼                           ▼           ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    CAPA DE API (Backend)                            │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │            Next.js API Routes + tRPC (opcional REST)         │  │
│  │  ┌────────┐┌────────┐┌────────┐┌────────┐┌────────┐        │  │
│  │  │ Auth   ││Patients││Clients ││Appoint.││Billing │  ...    │  │
│  │  │Router  ││Router  ││Router  ││Router  ││Router  │        │  │
│  │  └────────┘└────────┘└────────┘└────────┘└────────┘        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  Zod Validation → Role-based Access Control → Rate Limiting         │
│  Webhooks → API Keys (scoped) → Audit Logging                       │
└─────────────────────────────────────────────────────────────────────┘
        │                        │                        │
        ▼                        ▼                        ▼
┌───────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│  PostgreSQL   │  │  Redis (Upstash)     │  │  S3-compatible      │
│  + Drizzle ORM │  │  - Rate Limiting     │  │  (MinIO/Supabase)   │
│               │  │  - Cache             │  │  - Fotos mascotas   │
│  - RLS (multi  │  │  - Sesiones          │  │  - Documentos       │
│    tenant)     │  └──────────────────────┘  │  - Lab results img  │
│  - Migrations  │                           └──────────────────────┘
│  - Seed data   │
└───────┬───────┘
        │
        ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    SERVICIOS EXTERNOS                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────────┐ │
│  │ Stripe   │  │ Twilio   │  │ Resend   │  │ IDEXX / Antech    │ │
│  │ Pagos    │  │ SMS/Whats│  │ Emails   │  │ Lab Integrations  │ │
│  └──────────┘  └──────────┘  └──────────┘  └────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

### 1.2 Stack Tecnológico Detallado

| Capa | Tecnología | Versión | Propósito |
|---|---|---|---|
| **Frontend** | Next.js | 15 (App Router) | Framework React SSR + API |
| **Lenguaje** | TypeScript | 5.x | Tipado estático |
| **UI** | shadcn/ui + Radix UI | Latest | Componentes accesibles |
| **Estilos** | Tailwind CSS | 4.x | Utility-first CSS |
| **Formularios** | React Hook Form + Zod | Latest | Form + validación |
| **Calendario** | FullCalendar | Latest | Agenda de citas |
| **Gráficos** | Recharts | Latest | Dashboard/reportes |
| **Animaciones** | Framer Motion | Latest | Transiciones UI |
| **Base de Datos** | PostgreSQL | 16 | BD relacional |
| **ORM** | Drizzle ORM | Latest | Type-safe SQL |
| **Autenticación** | NextAuth.js | 5 | Auth + RBAC |
| **API** | tRPC | Latest | API type-safe |
| **Tiempo real** | WebSockets | - | Tablero whiteboard |
| **Cache/Rate Limiting** | Upstash Redis | Latest | Sesiones, límites |
| **Pagos** | Stripe | Latest | Facturación online |
| **SMS/WhatsApp** | Twilio | Latest | Recordatorios |
| **Emails** | Resend + React Email | Latest | Notificaciones |
| **Almacenamiento** | MinIO (self-host) / Supabase Storage | Latest | Archivos |
| **Monorepo** | Turborepo + pnpm | Latest | Gestión proyecto |
| **Testing** | Vitest + Playwright | Latest | Unit + E2E |
| **Despliegue** | Docker Compose + Vercel | Latest | Cloud + self-host |

### 1.3 Modelo de Datos (Entidades Principales)

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐
│    User      │     │     Client       │     │    Patient       │
├──────────────┤     ├──────────────────┤     ├──────────────────┤
│ id           │     │ id               │     │ id               │
│ email        │     │ name             │     │ name             │
│ password_hash│────→│ phone            │     │ species          │
│ role (enum)  │     │ email            │────→│ breed            │
│ first_name   │     │ address          │     │ birth_date       │
│ last_name    │     │ emergency_contact│     │ gender           │
│ phone        │     │ payment_info     │     │ weight (array)   │
│ active       │     │ notes            │     │ color            │
│ created_at   │     │ created_at       │     │ microchip        │
│ updated_at   │     └──────────────────┘     │ photo_url        │
└──────────────┘                              │ allergies        │
       │                                      │ client_id (FK)   │
       │                                      │ created_at        │
       ▼                                      └────────┬─────────┘
┌──────────────────┐                                  │
│  Appointment     │                                  │
├──────────────────┤                                  │
│ id               │                                  │
│ patient_id (FK)  │──────────────────────────────────┘
│ client_id (FK)   │
│ vet_id (FK)      │          ┌──────────────────┐
│ date             │          │  MedicalRecord   │
│ start_time       │          │ (SOAP Note)      │
│ end_time         │          ├──────────────────┤
│ type             │          │ id               │
│ status (enum)*   │◄─────────│ appointment_id(FK)│
│ notes            │          │ subjective       │
│ room             │          │ objective        │
│ created_by (FK)  │          │ assessment       │
│ created_at       │          │ plan             │
│ updated_at       │          │ vitals (JSON)    │
└──────────────────┘          │ diagnosis        │
       │                      │ created_by (FK)  │
       │                      │ created_at       │
       ▼                      └──────────────────┘
┌──────────────────┐
│   Invoice        │
├──────────────────┤
│ id               │
│ appointment_id   │
│ client_id (FK)   │
│ items (JSON)     │
│ subtotal         │
│ tax              │
│ total            │
│ status (enum)**  │
│ payment_method   │
│ paid_at          │
│ created_at       │
└──────────────────┘

┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   Product        │    │ InventoryBatch   │    │   Supplier       │
│ (Inventory)      │    ├──────────────────┤    ├──────────────────┤
├──────────────────┤    │ id               │    │ id               │
│ id               │    │ product_id (FK)  │    │ name             │
│ name             │    │ batch_number     │────→│ contact          │
│ description      │    │ expiration_date  │    │ email            │
│ type (enum)***   │    │ quantity         │    │ phone            │
│ price            │    │ purchase_price   │    │ address          │
│ cost_price       │    │ supplier_id (FK) │    │ active           │
│ stock_quantity   │    │ created_at       │    │ created_at       │
│ reorder_point    │    └──────────────────┘    └──────────────────┘
│ sku              │
│ active           │    ┌──────────────────┐
│ created_at       │    │  Vaccination     │
│ updated_at       │    ├──────────────────┤
└──────────────────┘    │ id               │
       │                 │ patient_id (FK)  │
       ▼                 │ vaccine_name     │
┌──────────────────┐    │ batch_number     │
│ Prescription     │    │ date_administered│
├──────────────────┤    │ next_due_date    │
│ id               │    │ administered_by  │
│ patient_id (FK)  │    │ certificate_url  │
│ medical_record_id│    │ notes            │
│ product_id (FK)  │    │ created_at       │
│ dosage           │    └──────────────────┘
│ frequency        │
│ duration         │    ┌──────────────────┐
│ quantity         │    │   LabResult      │
│ refills_remaining│    ├──────────────────┤
│ status (enum)    │    │ id               │
│ valid_until      │    │ patient_id (FK)  │
│ created_by (FK)  │    │ test_type        │
│ created_at       │    │ result_data(JSON)│
│ updated_at       │    │ reference_range  │
└──────────────────┘    │ status (enum)    │
                        │ file_url         │
┌──────────────────┐    │ interpreted_by   │
│   Communication  │    │ interpretation   │
├──────────────────┤    │ created_at       │
│ id               │    └──────────────────┘
│ client_id (FK)   │
│ type (enum)****  │    * status: scheduled | confirmed | checked_in |
│ direction        │      in_exam | checked_out | cancelled | no_show
│ content          │    ** status: draft | sent | paid | partial | overdue
│ sent_at          │    *** type: medication | supply | food | service
│ status           │    **** type: sms | email | whatsapp | portal_message
│ created_by       │
│ created_at       │
└──────────────────┘
```

### 1.4 Principios Arquitectónicos

1. **API-First**: Cada acción de UI se ejecuta a través de la misma API pública. Esto permite que integraciones externas (IA, asistentes de voz, apps móviles) tengan acceso completo de lectura/escritura.

2. **Type-Safety**: Zod + tRPC + TypeScript garantizan que los tipos sean consistentes desde la BD hasta la UI. Los errores de validación se detectan en compilación.

3. **Modular por Módulos de Negocio**: Cada módulo (patients, appointments, billing, inventory) es independiente con sus propios routers, esquemas y componentes.

4. **Multi-tenant Ready**: Arquitectura preparada para que múltiples clínicas usen la misma instancia con aislamiento de datos por tenant (PostgreSQL RLS o tenant_id column).

5. **Self-hostable + Cloud**: Docker Compose para despliegue on-premise, Vercel para cloud. Sin vendor lock-in.

6. **Offline-first (futuro)**: La capa de datos permite que en futuras fases se implemente un modo offline con sincronización.

---

## 2. PLAN DE DESARROLLO

### 2.1 Metodología: Agile Scrum

- **Sprints**: 2 semanas cada uno
- **Daily standups**: 15 min
- **Sprint review**: Demo al final de cada sprint
- **Retrospective**: Al final de cada sprint
- **Tecnología**: Gestión con GitHub Projects / Linear

### 2.2 Roadmap General

```
FASE 0 ─── FASE 1 ─── FASE 2 ─── FASE 3 ─── FASE 4 ─── FASE 5
Sem 1-2   Sem 3-8    Sem 9-14   Sem 15-20  Sem 21-26  Sem 27-30
          Fundación  Clínica    Negocio    Comunicac.  Avanzado
```

### 2.3 Fase 0 — Setup del Proyecto (Semana 1-2)

| Sprint | Actividades | Entregables |
|---|---|---|
| **Sprint 0** (sem 1) | Setup monorepo (Turborepo + pnpm), Configurar Next.js 15 + TypeScript, Configurar PostgreSQL + Drizzle ORM, Configurar Docker Compose, CI/CD inicial (GitHub Actions), ESLint + Prettier + Husky | Repositorio funcional, Pipeline CI, Entorno dev local con Docker |
| **Sprint 1** (sem 2) | Setup shadcn/ui + Tailwind, Componentes base (Button, Input, Card, Dialog, Table), Layouts (Sidebar, Navbar), Tema claro/oscuro, Sistema de roles y tipos base (TypeScript) | Design system base, Layout responsivo funcional |

### 2.4 Fase 1 — Fundación (Semanas 3-8)

**Objetivo**: Core del sistema operativo — autenticación, clientes, pacientes, citas.

| Sprint | Módulo | Historias de Usuario / Tareas |
|---|---|---|
| **Sprint 2** (sem 3) | **Auth** | - Como administrador, quiero registrar usuarios con roles (admin, vet, recep) para controlar acceso<br>- Como usuario, quiero iniciar sesión con email y contraseña<br>- Como usuario, quiero recuperar mi contraseña<br>- Como admin, quiero gestionar roles y permisos |
| **Sprint 3** (sem 4) | **Clientes** | - Como recepcionista, quiero registrar un nuevo cliente con sus datos de contacto<br>- Como recepcionista, quiero buscar clientes por nombre, email o teléfono<br>- Como staff, quiero editar datos de un cliente existente<br>- Como staff, quiero ver el historial completo de un cliente (mascotas, citas, facturas) |
| **Sprint 4** (sem 5) | **Pacientes** | - Como recepcionista, quiero registrar una mascota vinculada a un cliente<br>- Como staff, quiero buscar mascotas por nombre, especie o microchip<br>- Como staff, quiero registrar el peso y foto de la mascota<br>- Como staff, quiero ver la lista de problemas y alergias del paciente |
| **Sprint 5** (sem 6) | **Agenda** | - Como recepcionista, quiero crear una cita seleccionando cliente, mascota, doctor y horario<br>- Como recepcionista, quiero ver el calendario en vista día/semana/mes<br>- Como staff, quiero cambiar el estado de la cita (programada → confirmada → check-in → consulta → checkout)<br>- Como staff, quiero cancelar o reagendar una cita |
| **Sprint 6** (sem 7-8) | **Agenda Avanzada** | - Como recepcionista, quiero que el sistema evite dobles reservas para un mismo doctor<br>- Como veterinario, quiero configurar mi disponibilidad horaria<br>- Como admin, quiero configurar tipos de cita con duración y color<br>- Como staff, quiero agendar citas recurrentes (ej. curas semanales) |

### 2.5 Fase 2 — Módulo Clínico (Semanas 9-14)

**Objetivo**: Historias clínicas electrónicas, SOAP, prescripciones, vacunación, laboratorio.

| Sprint | Módulo | Historias de Usuario / Tareas |
|---|---|---|
| **Sprint 7** (sem 9) | **SOAP Notes** | - Como veterinario, quiero crear notas SOAP para una consulta<br>- Como veterinario, quiero registrar signos vitales (peso, temp, FC, FR)<br>- Como veterinario, quiero usar plantillas de SOAP configuradas por especie<br>- Como veterinario, quiero ver el histórico de SOAP del paciente |
| **Sprint 8** (sem 10) | **Diagnóstico y Problemas** | - Como veterinario, quiero registrar diagnósticos primarios y diferenciales<br>- Como veterinario, quiero mantener una lista de problemas activos/resueltos/crónicos<br>- Como veterinario, quiero adjuntar imágenes y documentos a la historia clínica |
| **Sprint 9** (sem 11) | **Prescripciones** | - Como veterinario, quiero prescribir medicamentos con dosis, frecuencia y duración<br>- Como veterinario, quiero que la prescripción descuente automáticamente del inventario<br>- Como staff, quiero gestionar refills de recetas |
| **Sprint 10** (sem 12) | **Vacunación** | - Como veterinario, quiero registrar vacunas administradas con lote y próxima dosis<br>- Como staff, quiero generar certificados de vacunación en PDF<br>- Como sistema, quiero enviar recordatorios de vacunas próximas a vencer |
| **Sprint 11** (sem 13-14) | **Laboratorio** | - Como veterinario, quiero solicitar exámenes de laboratorio<br>- Como técnico, quiero ingresar resultados con rangos de referencia<br>- Como veterinario, quiero ver tendencias de valores (ALT, creatinina, etc.) en gráficos<br>- Como sistema, quiero marcar valores fuera de rango |

### 2.6 Fase 3 — Módulo de Negocio (Semanas 15-20)

**Objetivo**: Facturación, inventario, pagos, reportes financieros.

| Sprint | Módulo | Historias de Usuario / Tareas |
|---|---|---|
| **Sprint 12** (sem 15) | **Facturación Básica** | - Como recepcionista, quiero generar una factura con los servicios y productos de la consulta<br>- Como recepcionista, quiero que los tratamientos se carguen automáticamente desde el registro médico (charge capture)<br>- Como recepcionista, quiero generar presupuestos y convertirlos en facturas |
| **Sprint 13** (sem 16) | **Pagos** | - Como recepcionista, quiero registrar pagos en efectivo, tarjeta o transferencia<br>- Como recepcionista, quiero dividir un pago en múltiples métodos (split tendering)<br>- Como cliente, quiero pagar desde el portal online (Stripe)<br>- Como staff, quiero ver el saldo pendiente de un cliente |
| **Sprint 14** (sem 17) | **Inventario** | - Como staff, quiero registrar productos con precio, costo, SKU y punto de reorden<br>- Como staff, quiero gestionar lotes con fechas de vencimiento<br>- Como sistema, quiero descontar stock automáticamente al dispensar<br>- Como staff, quiero recibir alertas de stock bajo y productos vencidos |
| **Sprint 15** (sem 18) | **Órdenes de Compra** | - Como admin, quiero gestionar proveedores<br>- Como staff, quiero crear órdenes de compra<br>- Como staff, quiero recibir mercancía y actualizar inventario<br>- Como sistema, quiero generar órdenes de compra sugeridas según puntos de reorden |
| **Sprint 16** (sem 19-20) | **Reportes y Dashboard** | - Como admin, quiero ver un dashboard con KPIs: ingresos hoy/semana/mes, citas, pacientes nuevos<br>- Como admin, quiero reportes de ingresos por doctor, servicio y período<br>- Como admin, quiero ver estadísticas de ocupación de agenda<br>- Como admin, quiero exportar reportes a CSV/PDF |

### 2.7 Fase 4 — Comunicación y Portal (Semanas 21-26)

**Objetivo**: Portal del cliente, comunicación bidireccional, recordatorios automatizados.

| Sprint | Módulo | Historias de Usuario / Tareas |
|---|---|---|
| **Sprint 17** (sem 21) | **Portal Cliente (API)** | - Como cliente, quiero registrarme en el portal<br>- Como cliente, quiero ver mis mascotas y su historial médico<br>- Como cliente, quiero descargar certificados de vacunación |
| **Sprint 18** (sem 22) | **Portal Cliente (UI)** | - Como cliente, quiero agendar y cancelar citas desde el portal<br>- Como cliente, quiero ver mis facturas y pagar online<br>- Como cliente, quiero chatear con la clínica |
| **Sprint 19** (sem 23) | **Recordatorios Automáticos** | - Como sistema, quiero enviar recordatorios de citas 24h antes (SMS/Email/WhatsApp)<br>- Como sistema, quiero enviar recordatorios de vacunas y controles pendientes<br>- Como staff, quiero personalizar los mensajes de recordatorio |
| **Sprint 20** (sem 24) | **Comunicación Bidireccional** | - Como staff, quiero enviar y recibir mensajes SMS/WhatsApp desde el sistema<br>- Como staff, quiero enviar campañas de mensajería masiva (ej. promociones)<br>- Como staff, quiero ver el historial completo de comunicación con el cliente |
| **Sprint 21** (sem 25-26) | **Online Booking Widget** | - Como cliente, quiero reservar citas desde el sitio web de la clínica<br>- Como admin, quiero configurar qué tipos de cita permiten auto-reserva<br>- Como sistema, quiero sincronizar el widget con la agenda en tiempo real |

### 2.8 Fase 5 — Avanzado (Semanas 27-30)

**Objetivo**: Características avanzadas y pulido.

| Sprint | Módulo | Historias de Usuario / Tareas |
|---|---|---|
| **Sprint 22** (sem 27) | **Sustancias Controladas** | - Como veterinario, quiero registrar cada dispensación de sustancias controladas con paciente, doctor, fecha, cantidad y saldo<br>- Como admin, quiero generar el log de auditoría para DEA<br>- Como sistema, quiero mantener un registro inmutable y exportable a PDF |
| **Sprint 23** (sem 28) | **Whiteboard en Tiempo Real** | - Como staff, quiero ver un tablero en tiempo real con el estado de cada paciente (nombre, doctor, sala, estado, tiempo)<br>- Como staff, quiero actualizar el estado desde el tablero |
| **Sprint 24** (sem 29) | **Multi-sucursal** | - Como admin, quiero gestionar múltiples sucursales desde una misma instalación<br>- Como staff, quiero ver solo los datos de mi sucursal<br>- Como admin, quiero reportes consolidados de todas las sucursales |
| **Sprint 25** (sem 30) | **Testing Integral y Documentación** | - Pruebas E2E con Playwright (flujos críticos)<br>- Pruebas de carga/rendimiento<br>- Documentación técnica (README, API docs)<br>- Documentación de usuario (manual)<br>- Despliegue en producción |

### 2.9 Estimación de Tiempo y Recursos

| Fase | Sprints | Semanas | Esfuerzo (horas) | Equipo sugerido |
|---|---|---|---|---|
| Fase 0 — Setup | 2 | 2 | 80h | 1 dev full-stack |
| Fase 1 — Fundación | 5 | 6 | 240h | 2 devs + 1 diseñador |
| Fase 2 — Clínica | 5 | 6 | 300h | 2 devs + 1 vet advisor |
| Fase 3 — Negocio | 5 | 6 | 280h | 2 devs |
| Fase 4 — Comunicación | 5 | 6 | 280h | 2 devs |
| Fase 5 — Avanzado | 4 | 4 | 200h | 2 devs + QA |
| **Total** | **26** | **30** | **~1380h** | |

### 2.10 Priorización MVP (Mínimo Producto Viable)

Si se requiere un MVP en **8 semanas** (Fase 1 completa):

```
Sem 1-2: Setup + Auth + UI base
Sem 3-4: Clientes + Pacientes (CRUD completo)
Sem 5-6: Agenda (calendario + creación de citas + estados)
Sem 7-8: SOAP básico + facturación simple
```

El MVP cubre: registro de clientes y mascotas, agendamiento de citas, notas SOAP básicas y emisión de facturas.

---

## 3. INFRAESTRUCTURA Y DESPLIEGUE

### 3.1 Entornos

| Entorno | URL | Propósito |
|---|---|---|
| `development` | localhost:3000 | Desarrollo local con Docker |
| `staging` | staging.vetrinaria.app | QA y pruebas de integración |
| `production` | app.vetrinaria.app | Producción |

### 3.2 Docker Compose (Desarrollo Local)

```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: vetrinaria
      POSTGRES_USER: vet
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  minio:
    image: minio/minio
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - miniodata:/data
    command: server /data --console-address ":9001"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - minio
      - redis
    environment:
      DATABASE_URL: postgresql://vet:secret@postgres:5432/vetrinaria
      NEXTAUTH_SECRET: secret
      ...

volumes:
  pgdata:
  miniodata:
```

### 3.3 CI/CD Pipeline (GitHub Actions)

```
Push / PR a main → Lint + Type Check → Test (Vitest) → Build → 
  → Deploy Staging → E2E Tests (Playwright) → Deploy Production
```

---

## 4. RIESGOS Y MITIGACIÓN

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Scope creep (alcance creciente) | Alta | Alto | MVP claro, backlog priorizado, cambios a nueva fase |
| Integración con laboratorios (IDEXX) | Media | Alto | Investigar APIs disponibles en Fase 0, mockear integración |
| Cumplimiento regulatorio (datos médicos) | Media | Alto | Cifrado, backups, auditoría, consultar marco legal local |
| Adopción del personal de clínica | Alta | Medio | UI intuitiva, capacitación temprana, feedback continuo |
| Performance con muchos datos | Baja | Medio | Índices en BD, paginación, caché Redis, load testing |

---

## 5. HERRAMIENTAS RECOMENDADAS

| Propósito | Herramienta |
|---|---|
| Gestión de proyecto | GitHub Projects / Linear |
| Repositorio | GitHub (monorepo) |
| Diseño UI/UX | Figma |
| Base de datos | PostgreSQL + Drizzle Studio |
| Testing | Vitest + Playwright |
| Monitoreo | Sentry |
| Documentación API | Swagger (trpc-openapi) |
| Comunicación equipo | Slack / Discord |
| Diagramas | Mermaid / Excalidraw / draw.io |
