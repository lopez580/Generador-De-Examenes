# Generador de Exámenes

Aplicación web que permite generar exámenes personalizados usando inteligencia artificial. Los usuarios pueden seleccionar un área de interés y obtener preguntas y respuestas generadas automáticamente, guardarlas en una base de datos y llevar un registro de su puntaje.

---

## Características principales

- Generación automática de preguntas y respuestas usando la API de **Google Gemini**
- Banco de preguntas almacenado en base de datos (**MongoDB**)
- API REST con CRUD completo de preguntas, respuestas y usuarios
- Sistema de registro de puntajes por usuario
- Autenticación con página de **Login**
- Interfaz moderna construida con **Next.js**

---

## Tecnologías utilizadas

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js (React) |
| Backend / API | Next.js API Routes |
| Base de datos | MongoDB |
| IA generativa | Google Gemini API |
| Autenticación | Validación de usuario y contraseña |

---

## Estructura del repositorio

```
/
├── app/                  # Páginas y rutas de Next.js
│   ├── login/            # Página de inicio de sesión
│   ├── dashboard/        # Panel principal del usuario
│   └── examen/           # Generación y resolución de exámenes
├── components/           # Componentes reutilizables de UI
├── lib/                  # Conexión a BD y utilidades
├── pages/api/            # Endpoints REST (CRUD)
│   ├── preguntas/        # CRUD de preguntas y respuestas
│   └── usuarios/         # CRUD de usuarios y puntajes
├── propuesta/            # Pantallas, modelo de BD y propuesta de API
│   └── README.md
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
git clone https://github.com/tu-usuario/generador-examenes.git
cd generador-examenes

# 2. Instalar dependencias
npm install
npm install prisma --save-dev
npm install @prisma/client

# 3. Configurar variables de entorno
cp .env.example .env.local
npx prisma init --datasource-provider mongodb
# Editar .env.local con tus credenciales

# 4. Ejecutar en modo desarrollo
npm run dev
```

### Variables de entorno requeridas

```env
MONGODB_URI=mongodb+srv://...
GEMINI_API_KEY=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
```

---

## Endpoints de la API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/preguntas` | Listar preguntas |
| POST | `/api/preguntas` | Crear pregunta |
| PUT | `/api/preguntas/:id` | Actualizar pregunta |
| DELETE | `/api/preguntas/:id` | Eliminar pregunta |
| GET | `/api/usuarios` | Listar usuarios |
| POST | `/api/usuarios` | Crear usuario |
| PUT | `/api/usuarios/:id` | Actualizar usuario / puntaje |
| DELETE | `/api/usuarios/:id` | Eliminar usuario |

---

## Autores
- Lopez Hernandez Giovanni
- Matias Santiago Joel Geovanny