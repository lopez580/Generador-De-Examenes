import { test, expect } from '@playwright/test';

let usuarioId: string;
const correoApiTest = `api_usuarios_${Date.now()}@ejemplo.com`;

test.describe.serial('API — Usuarios', () => {

    test.beforeAll(async ({ request }) => {
        // Crear usuario de prueba
        const res = await request.post('http://localhost:3000/api/usuarios', {
            data: { nombre: 'Usuario API Test', correo: correoApiTest, password: '123456' }
        });
        const usuario = await res.json();
        usuarioId = usuario.id;
    });

    test.afterAll(async ({ request }) => {
        // Limpiar el usuario de prueba
        if (usuarioId) {
            await request.delete(`http://localhost:3000/api/usuarios/${usuarioId}`);
        }
    });

    test('GET /api/usuarios — lista todos los usuarios', async ({ request }) => {
        const res = await request.get('http://localhost:3000/api/usuarios');

        expect(res.status()).toBe(200);
        const usuarios = await res.json();
        expect(Array.isArray(usuarios)).toBe(true);

        const encontrado = usuarios.find((u: { id: string }) => u.id === usuarioId);
        expect(encontrado).toBeDefined();
    });

    test('GET /api/usuarios/:id — obtiene un usuario por su ID', async ({ request }) => {
        const res = await request.get(`http://localhost:3000/api/usuarios/${usuarioId}`);

        expect(res.status()).toBe(200);
        const usuario = await res.json();
        expect(usuario.id).toBe(usuarioId);
        expect(usuario.nombre).toBe('Usuario API Test');
        expect(usuario.correo).toBe(correoApiTest);
    });

    test('GET /api/usuarios/:id — devuelve 404 si el ID no existe', async ({ request }) => {
        const idInexistente =
            usuarioId.slice(0, -1) + (usuarioId.slice(-1) === 'a' ? 'b' : 'a');
        const res = await request.get(`http://localhost:3000/api/usuarios/${idInexistente}`);

        expect(res.status()).toBe(404);
    });

    test('DELETE /api/usuarios/:id — elimina un usuario correctamente', async ({ request }) => {
        // Crear un usuario extra solo para eliminarlo
        const resCrear = await request.post('http://localhost:3000/api/usuarios', {
            data: { nombre: 'Usuario a Eliminar', correo: `eliminar_${Date.now()}@ejemplo.com`, password: '123456' }
        });
        const usuarioAEliminar = await resCrear.json();

        const resDel = await request.delete(`http://localhost:3000/api/usuarios/${usuarioAEliminar.id}`);
        expect(resDel.status()).toBe(200);

        // Verificar que ya no existe
        const resGet = await request.get(`http://localhost:3000/api/usuarios/${usuarioAEliminar.id}`);
        expect(resGet.status()).toBe(404);
    });

});
