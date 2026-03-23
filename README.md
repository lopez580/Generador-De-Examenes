# Generador de Exámenes

Aplicación web que permite generar exámenes personalizados usando inteligencia artificial. Los usuarios pueden seleccionar un área de interés y obtener preguntas y respuestas generadas automáticamente, guardarlas en una base de datos y llevar un registro de su puntaje.

---

## Características principales

- Generación automática de preguntas y respuestas usando la API de **Google Gemini**
- Banco de preguntas almacenado en base de datos (**MongoDB**)
- API REST con CRUD completo de preguntas, usuarios y exámenes
- Sistema de registro de puntajes por usuario y ranking
- Autenticación con páginas de **Login** y **Registro**
- Contraseñas almacenadas de forma segura con hash (`scrypt`)
- Interfaz moderna construida con **Next.js**

---

## Tecnologías utilizadas

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js (React) |
| Backend / API | Next.js API Routes |
| Base de datos | MongoDB |
| ORM | Prisma |
| IA generativa | Google Gemini API |
| Autenticación | Validación de usuario y contraseña hasheada (`scrypt`) |
| Pruebas | Playwright (E2E, API y unitarias) |

---

## Estructura del repositorio

```
/
├── app/                  # Páginas, layouts y rutas API de Next.js
│   ├── (auth)/           # Login y registro
│   ├── (main)/           # Dashboard, generar, examenes, ranking
│   └── api/              # Endpoints REST (CRUD)
├── components/           # Componentes reutilizables de UI
├── lib/                  # Conexión a BD y utilidades
├── prisma/               # Modelo de base de datos
├── tests/                # Pruebas E2E, API y unitarias
├── propuesta/            # Pantallas, modelo de BD y propuesta de API
│   └── README.md
├── API.md                # Documentación detallada de endpoints
├── .env.example          # Variables de entorno necesarias
└── README.md             # Este archivo
```

---

## Instalación y configuración

### Prerrequisitos

- Node.js 18+
- Cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas) o MongoDB local
- API Key de [Google Gemini](https://aistudio.google.com/)

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd Generador-De-Examenes

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 4. Generar cliente de Prisma
npx prisma generate

# 5. Ejecutar en modo desarrollo
npm run dev
```

### Variables de entorno requeridas

```env
DATABASE_URL=mongodb+srv://...
GEMINI_API_KEY=...
```

---

## Endpoints de la API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/preguntas` | Listar preguntas (opcional `?area=`) |
| GET | `/api/preguntas/:id` | Obtener una pregunta por ID |
| POST | `/api/preguntas` | Crear pregunta |
| POST | `/api/preguntas/generar` | Generar preguntas con Gemini |
| POST | `/api/preguntas/porids` | Obtener preguntas por lista de IDs |
| PUT | `/api/preguntas/:id` | Actualizar pregunta |
| DELETE | `/api/preguntas/:id` | Eliminar pregunta |
| GET | `/api/usuarios` | Listar usuarios |
| GET | `/api/usuarios/:id` | Obtener usuario por ID |
| POST | `/api/usuarios` | Crear usuario (password hasheada) |
| POST | `/api/usuarios/login` | Iniciar sesión |
| PUT | `/api/usuarios/:id` | Actualizar usuario / puntaje |
| DELETE | `/api/usuarios/:id` | Eliminar usuario |
| POST | `/api/examenes` | Crear/guardar examen |
| DELETE | `/api/examenes?id=...` | Eliminar examen |
| GET | `/api/examenes/:usuario_id` | Historial de exámenes de un usuario |
| GET | `/api/examenes/detalle/:id` | Obtener detalle de examen |
| PUT | `/api/examenes/detalle/:id` | Actualizar respuestas y puntaje |

> Documentación detallada y ejemplos `curl` en [`API.md`](./API.md).

---

## Pruebas

```bash
# E2E y API
npm run test:e2e

# UI de Playwright
npm run test:e2e:ui

# Unitarias
npm run test:unit
```

---

## Autores
- Lopez Hernandez Giovanni
- Matias Santiago Joel Geovanny
