import { test, expect } from '@playwright/test';

const correoRanking = `ranking_${Date.now()}@ejemplo.com`;

test.describe.serial('Página de ranking', () => {

    test.beforeAll(async ({ request }) => {
        // Crear usuario de prueba para el ranking
        await request.post('http://localhost:3000/api/usuarios', {
            data: { nombre: 'Usuario Ranking Test', correo: correoRanking, password: '123456' }
        });
    });

    test('La página muestra la lista de usuarios ordenada por puntaje', async ({ page }) => {
        await page.goto('/ranking');

        await expect(page.getByText('Ranking de Usuarios')).toBeVisible();
        await expect(page.getByText('Usuario Ranking Test')).toBeVisible();
    });

    test('Editar el puntaje de un usuario', async ({ page }) => {
        await page.goto('/ranking');
        await page.waitForSelector('text=Usuario Ranking Test');

        // Encontrar la fila del usuario de prueba y hacer clic en el botón de editar (lápiz)
        const fila = page.locator('div.rounded-lg').filter({ hasText: 'Usuario Ranking Test' });
        await fila.locator('button').first().click();

        // Cambiar el puntaje y guardar
        const inputPuntaje = fila.locator('input[type="number"]');
        await inputPuntaje.fill('500');
        await fila.getByRole('button', { name: 'Guardar' }).click();

        await expect(fila.getByText('500 pts')).toBeVisible();
    });

    test('Eliminar un usuario del ranking', async ({ page }) => {
        await page.goto('/ranking');
        await page.waitForSelector('text=Usuario Ranking Test');

        // Aceptar el diálogo de confirmación automáticamente
        page.on('dialog', dialog => dialog.accept());

        const fila = page.locator('div.rounded-lg').filter({ hasText: 'Usuario Ranking Test' });
        await fila.locator('button').last().click();

        await expect(page.getByText('Usuario Ranking Test')).not.toBeVisible();
    });

});
