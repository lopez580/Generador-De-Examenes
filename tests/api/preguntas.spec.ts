import { test, expect } from '@playwright/test';

let preguntaId: string;

test.describe.serial('API — Preguntas', () => {

    test.beforeAll(async ({ request }) => {
        // Crear pregunta de prueba para usar en los tests
        const res = await request.post('http://localhost:3000/api/preguntas', {
            data: {
                texto: '¿Cuál es la capital de Francia?',
                opciones: ['Madrid', 'París', 'Roma', 'Berlín'],
                respuesta_correcta: 'París',
                area: 'Geografía'
            }
        });
        const pregunta = await res.json();
        preguntaId = pregunta.id;
    });

    test.afterAll(async ({ request }) => {
        // Limpiar la pregunta de prueba
        if (preguntaId) {
            await request.delete(`http://localhost:3000/api/preguntas/${preguntaId}`);
        }
    });

    test('GET /api/preguntas/:id — obtiene una pregunta por su ID', async ({ request }) => {
        const res = await request.get(`http://localhost:3000/api/preguntas/${preguntaId}`);

        expect(res.status()).toBe(200);
        const pregunta = await res.json();
        expect(pregunta.id).toBe(preguntaId);
        expect(pregunta.texto).toBe('¿Cuál es la capital de Francia?');
        expect(pregunta.respuesta_correcta).toBe('París');
    });

    test('GET /api/preguntas/:id — devuelve 404 si el ID no existe', async ({ request }) => {
        const idInexistente =
            preguntaId.slice(0, -1) + (preguntaId.slice(-1) === 'a' ? 'b' : 'a');
        const res = await request.get(`http://localhost:3000/api/preguntas/${idInexistente}`);

        expect(res.status()).toBe(404);
    });

    test('POST /api/preguntas/porids — obtiene múltiples preguntas por sus IDs', async ({ request }) => {
        const res = await request.post('http://localhost:3000/api/preguntas/porids', {
            data: { ids: [preguntaId] }
        });

        expect(res.status()).toBe(200);
        const preguntas = await res.json();
        expect(Array.isArray(preguntas)).toBe(true);
        expect(preguntas.length).toBe(1);
        expect(preguntas[0].id).toBe(preguntaId);
    });

    test('POST /api/preguntas/porids — devuelve array vacío si no hay IDs', async ({ request }) => {
        const res = await request.post('http://localhost:3000/api/preguntas/porids', {
            data: { ids: [] }
        });

        expect(res.status()).toBe(200);
        const preguntas = await res.json();
        expect(preguntas).toEqual([]);
    });

});
