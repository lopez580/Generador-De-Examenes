# Propuesta del Proyecto — Generador de Exámenes

Este directorio contiene la propuesta inicial del sistema: pantallas diseñadas (wireframes/stitch), modelo de base de datos y propuesta de la API REST.

---

## Pantallas (Stitch / Wireframes)

A continuación se describen las pantallas principales de la aplicación. Las imágenes de los wireframes se encuentran en esta misma carpeta (`/propuesta`).

### 1. Pantalla de Login
**Archivo:** `pantalla-login.png`

Formulario de inicio de sesión con campos de correo electrónico y contraseña. Incluye un botón para registrarse como nuevo usuario. Es el punto de entrada a la aplicación.

---

### 2. Dashboard / Menú principal
**Archivo:** `pantalla-dashboard.png`

Pantalla principal del usuario autenticado. Muestra el nombre del usuario, su puntaje acumulado y las opciones disponibles: generar nuevo examen, ver historial de exámenes y administrar el banco de preguntas.

---

### 3. Generador de Examen
**Archivo:** `pantalla-generador.png`

El usuario selecciona el área de interés (por ejemplo: Historia, Matemáticas, Programación) y el número de preguntas deseadas. Al confirmar, se hace la llamada a la API de Google Gemini y se muestra el examen generado.

---

### 4. Resolución de Examen
**Archivo:** `pantalla-examen.png`

Muestra las preguntas una a una o en lista. El usuario selecciona sus respuestas y al finalizar se calcula y guarda su puntaje en la base de datos.

---

### 5. Administración de Preguntas
**Archivo:** `pantalla-crud-preguntas.png`

Panel para gestionar el banco de preguntas. Permite crear, editar y eliminar preguntas manualmente, además de visualizar las generadas por la IA.

---

## Modelo de Base de Datos

Se utiliza **MongoDB** (base de datos no relacional orientada a documentos).

### Colección: `usuarios`

```json
{
  "_id": "ObjectId",
  "nombre": "string",
  "correo": "string",
  "password": "string (hash)",
  "puntaje_total": "number",
  "fecha_registro": "Date",
  "examenes_realizados": ["ObjectId"]
}
```

Almacena los datos de cada usuario registrado en el sistema, incluyendo su puntaje acumulado y referencia a los exámenes que ha realizado.

---

### Colección: `preguntas`

```json
{
  "_id": "ObjectId",
  "texto": "string",
  "opciones": ["string"],
  "respuesta_correcta": "string",
  "area": "string",
  "origen": "manual | gemini",
  "fecha_creacion": "Date"
}
```

Contiene el banco de preguntas. El campo `origen` indica si la pregunta fue creada manualmente o generada por la API de Gemini.

---

### Colección: `examenes`

```json
{
  "_id": "ObjectId",
  "usuario_id": "ObjectId",
  "area": "string",
  "preguntas": ["ObjectId"],
  "respuestas_usuario": ["string"],
  "puntaje": "number",
  "fecha": "Date"
}
```

Registra cada examen realizado, las respuestas del usuario y el puntaje obtenido.

---

## Propuesta de API REST

La API está construida con **Next.js API Routes** y expone los siguientes endpoints:

### Módulo: Preguntas

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/preguntas` | Obtener todas las preguntas (filtrable por área) |
| GET | `/api/preguntas/:id` | Obtener una pregunta por ID |
| POST | `/api/preguntas` | Crear una nueva pregunta manualmente |
| PUT | `/api/preguntas/:id` | Actualizar texto u opciones de una pregunta |
| DELETE | `/api/preguntas/:id` | Eliminar una pregunta del banco |
| POST | `/api/preguntas/generar` | Generar preguntas con Google Gemini y guardarlas |

---

### Módulo: Usuarios

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/usuarios` | Listar todos los usuarios |
| GET | `/api/usuarios/:id` | Obtener datos de un usuario |
| POST | `/api/usuarios` | Registrar nuevo usuario |
| POST | `/api/usuarios/login` | Validar usuario y contraseña (login) |
| PUT | `/api/usuarios/:id` | Actualizar datos o puntaje de usuario |
| DELETE | `/api/usuarios/:id` | Eliminar un usuario |

---

### Módulo: Exámenes

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/examenes` | Guardar resultado de un examen |
| GET | `/api/examenes/:usuario_id` | Ver historial de exámenes de un usuario |

---

> **Nota:** El login valida el correo y contraseña del usuario contra la base de datos. Si coinciden, se permite el acceso a la aplicación.