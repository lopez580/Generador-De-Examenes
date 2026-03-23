import { test, expect } from '@playwright/test';

const correoTest = `flujo_${Date.now()}@ejemplo.com`;
const passwordTest = '123456';
const nombreTest = 'Usuario Flujo';

test.beforeAll(async ({ request }) => {
    // Limpiar preguntas viejas
    const res = await request.get('http://localhost:3000/api/preguntas?area=Matem%C3%A1ticas');
    const preguntas = await res.json();
    console.log('Preguntas a eliminar:', preguntas.length);

    for (const p of preguntas) {
        const del = await request.delete(`http://localhost:3000/api/preguntas/${p.id}`);
        console.log(`Delete ${p.id}:`, del.status());
    }

    await request.post('http://localhost:3000/api/usuarios', {
        data: { nombre: nombreTest, correo: correoTest, password: passwordTest }
    });
});

test.afterAll(async ({ request }) => {
    const res = await request.get('http://localhost:3000/api/preguntas?area=Matem%C3%A1ticas');
    const preguntas = await res.json();
    for (const p of preguntas) {
        await request.delete(`http://localhost:3000/api/preguntas/${p.id}`);
    }
});

test.describe.serial('Flujo de examen', () => {

    test('Crear y guardar examen', async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[type="email"]', correoTest);
        await page.fill('input[type="password"]', passwordTest);
        await page.click('button');
        await expect(page).toHaveURL('/dashboard');

        await page.click('text=Generar Examen');
        await expect(page).toHaveURL('/generar');

        await page.click('[role="combobox"]');
        await page.click('text=Matemáticas');
        await page.fill('input[type="range"]', '5');

        // Quite el flujo de gemini y lo agrege manual para no tener error es cuando probems

        await page.getByRole('button', { name: 'Agregar pregunta' }).click();
        await page.fill('input[placeholder="Texto de la pregunta"]', '¿Cuánto es 2+2?');
        await page.fill('input[placeholder="Opción A"]', '3');
        await page.fill('input[placeholder="Opción B"]', '4');
        await page.fill('input[placeholder="Opción C"]', '5');
        await page.fill('input[placeholder="Opción D"]', '6');
        await page.selectOption('select', '4');
        await page.getByRole('button', { name: 'Agregar', exact: true }).click();
        await expect(page.getByText('¿Cuánto es 2+2?').first()).toBeVisible();

        const contenedor = page.getByText('¿Cuánto es 2+2?').last()
            .locator('xpath=ancestor::div[contains(@class,"rounded-lg")]');
        await contenedor.locator('button').first().click();
        await page.fill('input[placeholder="Texto de la pregunta"]', '¿Cuánto es 2+2? (editada)');
        await page.getByRole('button', { name: 'Actualizar', exact: true }).click();
        await expect(page.getByText('¿Cuánto es 2+2? (editada)').first()).toBeVisible();

        await page.click('text=Guardar Examen');
        await expect(page).toHaveURL('/examenes');
    });

    test('Resolver examen', async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[type="email"]', correoTest);
        await page.fill('input[type="password"]', passwordTest);
        await page.click('button');
        await expect(page).toHaveURL('/dashboard');

        await page.goto('/examenes');

        // Click en el botón resolver (ícono play) del primer examen
        await page.locator('button[title="Resolver"]').first().click();
        await expect(page).toHaveURL(/\/examenes\/.+/);

        // Obtener total de preguntas del heading
        const totalTexto = await page.locator('p:has-text("preguntas")').textContent();
        const total = parseInt(totalTexto || '0');
        console.log('Total preguntas:', total);

        // Cada pregunta tiene 4 botones, seleccionar el primero de cada grupo
        const todosLosBotones = page.locator('main button:not([disabled])');
        const totalBotones = await todosLosBotones.count();
        console.log('Total botones:', totalBotones);

        // Clickear cada 4 botones (primero de cada pregunta)
        for (let i = 0; i < totalBotones; i += 4) {
            await todosLosBotones.nth(i).click();
        }
        await page.getByRole('button', { name: 'Finalizar Examen' }).click();
        await expect(page.getByText('Resultado', { exact: true })).toBeVisible();
        await expect(page.getByText('% de aciertos')).toBeVisible();
    });

});
