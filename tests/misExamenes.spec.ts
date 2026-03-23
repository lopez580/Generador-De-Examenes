import { test, expect } from '@playwright/test';

const correoTest = `examenes_${Date.now()}@ejemplo.com`;
const passwordTest = '123456';

test.describe.serial('Gestión de mis exámenes', () => {

    test.beforeAll(async ({ request }) => {
        // Crear usuario y un examen de prueba directamente en la API
        const resUsuario = await request.post('http://localhost:3000/api/usuarios', {
            data: { nombre: 'Usuario MisExamenes', correo: correoTest, password: passwordTest }
        });
        const usuario = await resUsuario.json();

        await request.post('http://localhost:3000/api/examenes', {
            data: {
                usuario_id: usuario.id,
                area: 'Historia Universal',
                preguntas: [],
                respuestas_usuario: [],
                puntaje: 0
            }
        });
    });

    test('La página de mis exámenes muestra los exámenes del usuario', async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[type="email"]', correoTest);
        await page.fill('input[type="password"]', passwordTest);
        await page.click('button');
        await expect(page).toHaveURL('/dashboard');

        await page.goto('/examenes');
        await expect(page.getByText('Mis Exámenes')).toBeVisible();
        await expect(page.getByText('Historia Universal')).toBeVisible();
    });

    test('Eliminar un examen de la lista', async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[type="email"]', correoTest);
        await page.fill('input[type="password"]', passwordTest);
        await page.click('button');
        await expect(page).toHaveURL('/dashboard');

        await page.goto('/examenes');
        await page.waitForSelector('text=Historia Universal');

        // Aceptar el diálogo de confirmación automáticamente
        page.on('dialog', dialog => dialog.accept());
        await page.locator('button[title="Eliminar"]').first().click();

        await expect(page.getByText('Historia Universal')).not.toBeVisible();
    });

});
