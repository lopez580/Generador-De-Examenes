# API — Generador de Exámenes

Todos los ejemplos asumen que el servidor corre en `http://localhost:3000`.

## Preguntas

### GET `/api/preguntas`

Lista todas las preguntas.

```bash
curl -i http://localhost:3000/api/preguntas
```

### GET `/api/preguntas?area=Matemáticas`

Lista preguntas filtradas por área.

```bash
curl -i "http://localhost:3000/api/preguntas?area=Matemáticas"
```

### GET `/api/preguntas/:id`

Obtiene una pregunta por ID.

```bash
curl -i http://localhost:3000/api/preguntas/<pregunta_id>
```

Respuestas esperadas:
- `200` con la pregunta.
- `404` con `{ "error": "Pregunta no encontrada" }`.

### POST `/api/preguntas`

Crea una pregunta manual.

```bash
curl -i -X POST http://localhost:3000/api/preguntas \
  -H "Content-Type: application/json" \
  -d '{
    "texto": "¿Cuál es la capital de México?",
    "opciones": ["Guadalajara", "Monterrey", "Ciudad de México", "Puebla"],
    "respuesta_correcta": "Ciudad de México",
    "area": "Geografía"
  }'
```

### PUT `/api/preguntas/:id`

Actualiza una pregunta.

```bash
curl -i -X PUT http://localhost:3000/api/preguntas/<pregunta_id> \
  -H "Content-Type: application/json" \
  -d '{
    "texto": "¿Cuál es 3 + 3?",
    "respuesta_correcta": "6"
  }'
```

### DELETE `/api/preguntas/:id`

Elimina una pregunta.

```bash
curl -i -X DELETE http://localhost:3000/api/preguntas/<pregunta_id>
```

### POST `/api/preguntas/porids`

Obtiene múltiples preguntas por IDs.

```bash
curl -i -X POST http://localhost:3000/api/preguntas/porids \
  -H "Content-Type: application/json" \
  -d '{
    "ids": ["<id_1>", "<id_2>"]
  }'
```

### POST `/api/preguntas/generar`

Genera preguntas con Gemini y las guarda en DB.

```bash
curl -i -X POST http://localhost:3000/api/preguntas/generar \
  -H "Content-Type: application/json" \
  -d '{
    "area": "Historia Universal",
    "cantidad": 5
  }'
```

Respuesta esperada (`201`):

```json
{
  "message": "5 preguntas generadas",
  "count": 5
}
```

## Usuarios

### GET `/api/usuarios`

Lista todos los usuarios.

```bash
curl -i http://localhost:3000/api/usuarios
```

### GET `/api/usuarios/:id`

Obtiene un usuario por ID.

```bash
curl -i http://localhost:3000/api/usuarios/<usuario_id>
```

Respuestas esperadas:
- `200` con el usuario.
- `404` con `{ "error": "Usuario no encontrado" }`.

### POST `/api/usuarios`

Registra usuario. La contraseña se almacena hasheada con `scrypt`.

```bash
curl -i -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Usuario Demo",
    "correo": "demo@example.com",
    "password": "123456"
  }'
```

### POST `/api/usuarios/login`

Valida correo/contraseña.

```bash
curl -i -X POST http://localhost:3000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "demo@example.com",
    "password": "123456"
  }'
```

Respuesta exitosa (`200`):

```json
{
  "message": "Login exitoso",
  "usuario": {
    "id": "...",
    "nombre": "Usuario Demo",
    "correo": "demo@example.com",
    "puntaje_total": 0
  }
}
```

Respuesta inválida (`401`):

```json
{ "error": "Credenciales incorrectas" }
```

### PUT `/api/usuarios/:id`

Actualiza usuario o puntaje.

```bash
curl -i -X PUT http://localhost:3000/api/usuarios/<usuario_id> \
  -H "Content-Type: application/json" \
  -d '{
    "puntaje_total": 200
  }'
```

### DELETE `/api/usuarios/:id`

Elimina usuario.

```bash
curl -i -X DELETE http://localhost:3000/api/usuarios/<usuario_id>
```

## Exámenes

### POST `/api/examenes`

Guarda un examen.

```bash
curl -i -X POST http://localhost:3000/api/examenes \
  -H "Content-Type: application/json" \
  -d '{
    "usuario_id": "<usuario_id>",
    "area": "Matemáticas",
    "preguntas": ["<pregunta_id_1>", "<pregunta_id_2>"],
    "respuestas_usuario": [],
    "puntaje": 0
  }'
```

### DELETE `/api/examenes?id=<examen_id>`

Elimina un examen por query param.

```bash
curl -i -X DELETE "http://localhost:3000/api/examenes?id=<examen_id>"
```

### GET `/api/examenes/:usuario_id`

Obtiene historial de exámenes de un usuario.

```bash
curl -i http://localhost:3000/api/examenes/<usuario_id>
```

### GET `/api/examenes/detalle/:id`

Obtiene un examen por ID.

```bash
curl -i http://localhost:3000/api/examenes/detalle/<examen_id>
```

Respuestas esperadas:
- `200` con examen.
- `404` con `{ "error": "No encontrado" }`.

### PUT `/api/examenes/detalle/:id`

Actualiza un examen (por ejemplo, respuestas y puntaje).

```bash
curl -i -X PUT http://localhost:3000/api/examenes/detalle/<examen_id> \
  -H "Content-Type: application/json" \
  -d '{
    "respuestas_usuario": ["A", "C", "B"],
    "puntaje": 2
  }'
```
