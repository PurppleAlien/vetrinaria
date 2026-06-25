<div align="center">
  <h1>🐾 Vetrinaria</h1>
  <p><strong>Sistema integral de gestión para clínicas veterinarias</strong></p>
  <p>Next.js 15 · Turborepo · PostgreSQL · Drizzle ORM · TypeScript</p>

  <a href="#-caracteristicas">Características</a> •
  <a href="#-tecnologias">Tecnologías</a> •
  <a href="#-comenzar">Comenzar</a> •
  <a href="#-capturas">Capturas</a>
</div>

---

## ✨ Características

| Módulo | Descripción |
|---|---|
| **Autenticación** | NextAuth v5 con JWT, 5 roles (super_admin, admin, veterinarian, technician, receptionist) |
| **Clientes** | CRUD completo con búsqueda, notificaciones automáticas |
| **Pacientes** | Mascotas con especie, raza, historial de peso (JSONB) |
| **Citas** | Agenda diaria, máquina de 7 estados, selectores dependientes |
| **Historial Clínico** | Formato SOAP con signos vitales |
| **Facturación** | IVA 16%, partidas dinámicas, **descarga de PDF** generado con pdfkit |
| **Inventario** | Productos con stock, punto de reorden, tipos (medication, supply, food, service) |
| **Proveedores** | Gestión con tarjetas responsivas |
| **Vacunación** | Catálogo por especie, registro con 2 modos de consulta (cached) |
| **Odontograma** | Sistema Triadan (42/30 dientes), 12 estados dentales, JSONB |
| **Dashboard** | 8 consultas paralelas en Server Component con React cache() |
| **Notificaciones** | Polling 15s, 5 tipos, inserción masiva |
| **Backups** | pg_dump/pg_restore via server-only utility |
| **Multi-Tenant** | Aislamiento por filas (clinicId) |
| **6 Temas de color** | Claro, oscuro, verde, azul, violeta, naranja |

## 🛠️ Tecnologías

| Tecnología | Versión | Propósito |
|---|---|---|
| Next.js | 15.3.0 | Framework full-stack (App Router) |
| TypeScript | 5.8 | Lenguaje tipado |
| TailwindCSS | 4.0.0 | Estilos utility-first |
| PostgreSQL | 16 | Base de datos relacional |
| Drizzle ORM | 0.41.0 | ORM tipo-safe |
| NextAuth | 5.0.0-beta.31 | Autenticación JWT |
| Framer Motion | 12.41.0 | Animaciones |
| pdfkit | 0.19.1 | Generación de PDF |
| Docker | latest | Contenedores producción |

## 🚀 Comenzar

### Requisitos

- Node.js 22+
- pnpm 11+
- PostgreSQL 16 (o Docker)
- Docker Compose (opcional)

### Desarrollo local

```bash
# Clonar
git clone https://github.com/PurppleAlien/vetrinaria.git
cd vetrinaria

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp apps/web/.env.example apps/web/.env

# Iniciar base de datos con Docker
docker compose up -d db

# Ejecutar migraciones y seed
pnpm --filter @vetrinaria/db db:migrate
pnpm --filter @vetrinaria/db db:seed

# Iniciar servidor de desarrollo
pnpm dev
```

### Despliegue con Docker

```bash
docker compose -f docker-compose.prod.yml up -d
```

### Credenciales de prueba (seed)

| Email | Contraseña | Rol |
|---|---|---|
| admin@vetrinaria.app | admin123 | super_admin |
| maria@vetrinaria.app | admin123 | veterinarian |
| carlos@vetrinaria.app | admin123 | veterinarian |
| laura@vetrinaria.app | admin123 | receptionist |
| javier@vetrinaria.app | admin123 | technician |

## 📸 Capturas de pantalla

<div align="center">

### Login
<img src="documentacion%20tecnica/img/vet-login.png" alt="Login" width="700"/>

### Dashboard
<img src="documentacion%20tecnica/img/vet-dashboard.png" alt="Dashboard" width="700"/>

### Clientes
<img src="documentacion%20tecnica/img/vet-clients.png" alt="Clientes" width="700"/>

### Pacientes
<img src="documentacion%20tecnica/img/vet-patients.png" alt="Pacientes" width="700"/>

### Agenda
<img src="documentacion%20tecnica/img/vet-appointments.png" alt="Citas" width="700"/>

### Facturación
<img src="documentacion%20tecnica/img/vet-invoices.png" alt="Facturas" width="700"/>

### Detalle de Factura con PDF
<img src="documentacion%20tecnica/img/vet-invoice-detail.png" alt="Detalle factura" width="700"/>

### Vacunación
<img src="documentacion%20tecnica/img/vet-vaccinations.png" alt="Vacunación" width="700"/>

### Productos
<img src="documentacion%20tecnica/img/vet-products.png" alt="Productos" width="700"/>

### Odontograma
<img src="documentacion%20tecnica/img/vet-odontogram.png" alt="Odontograma" width="700"/>

</div>

## 📁 Estructura del proyecto

```
vetrinaria/
├── apps/
│   └── web/                    # Aplicación Next.js
│       └── src/
│           ├── app/            # App Router (dashboard, auth, api)
│           ├── components/     # Componentes React (ui, forms)
│           ├── lib/
│           │   ├── actions/    # Server Actions
│           │   └── auth.ts     # NextAuth configuración
│           └── middleware.ts   # Protección de rutas
├── packages/
│   ├── db/                     # Drizzle ORM (schema, migrations, seed)
│   ├── shared/                 # Tipos y constantes compartidas
│   └── config/                 # ESLint, TypeScript config
├── scripts/                    # Backup, testing, seed
├── tests/                      # Tests end-to-end
├── docs/                       # Documentación LaTeX (sprints)
├── documentacion tecnica/      # Documentación técnica completa (132 páginas)
├── docker-compose.yml          # Desarrollo
└── docker-compose.prod.yml     # Producción
```

## 📄 Documentación

La documentación técnica completa se encuentra en la carpeta [`documentacion tecnica/`](documentacion%20tecnica/) (132 páginas, LaTeX) cubriendo cada módulo con diagramas, esquemas de base de datos, código fuente y decisiones arquitectónicas.

---

<div align="center">
  <p>Desarrollado con ❤️ para clínicas veterinarias</p>
</div>
