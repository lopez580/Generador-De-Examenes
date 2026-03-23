import { test, expect } from '@playwright/test';

test.describe('Registro de usuario', () => {

    test('La página de registro muestra todos los campos', async ({ page }) => {
        await page.goto('/registro');

        await expect(page.locator('input[type="text"]')).toBeVisible();
        await expect(page.locator('input[type="email"]')).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Registrarse' })).toBeVisible();
    });

    test('Registro exitoso redirige al login', async ({ page }) => {
        const correo = `registro_${Date.now()}@ejemplo.com`;

        await page.goto('/registro');
        await page.fill('input[type="text"]', 'Usuario Nuevo');
        await page.fill('input[type="email"]', correo);
        await page.fill('input[type="password"]', '123456');
        await page.getByRole('button', { name: 'Registrarse' }).click();

        await expect(page).toHaveURL('/login');
    });

    test('El link de iniciar sesión navega al login', async ({ page }) => {
        await page.goto('/registro');
        await page.getByRole('link', { name: 'Iniciar Sesion' }).click();

        await expect(page).toHaveURL('/login');
    });

});
