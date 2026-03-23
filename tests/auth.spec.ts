import { test, expect } from '@playwright/test';

test.describe.serial('Autenticación', () => {
    let correoTest: string;
    const passwordTest = '123456';
    const nombreTest = 'Usuario Test';

    test.beforeAll(async ({ browserName, request }) => {
        correoTest = `test_${browserName}_${Date.now()}@ejemplo.com`;

        // Crear usuario directo en la API sin navegador
        await request.post('http://localhost:3000/api/usuarios', {
            data: { nombre: nombreTest, correo: correoTest, password: passwordTest }
        });
    });

    test('Login con credenciales correctas', async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[type="email"]', correoTest);
        await page.fill('input[type="password"]', passwordTest);
        await page.click('button');
        await expect(page).toHaveURL('/dashboard');
    });

    test('Login con credenciales incorrectas', async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[type="email"]', correoTest);
        await page.fill('input[type="password"]', 'passwordmala');
        await page.click('button');
        await expect(page.getByText('Correo o contraseña incorrectos')).toBeVisible();
    });

    test('Logout', async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[type="email"]', correoTest);
        await page.fill('input[type="password"]', passwordTest);
        await page.click('button');
        await expect(page).toHaveURL('/dashboard');
        await page.click('button[title="Cerrar sesión"]');
        await expect(page).toHaveURL('/login');
    });

});