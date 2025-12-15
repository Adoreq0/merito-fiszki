import { test, expect } from '@playwright/test';

test('Quiz flow', async ({ page }) => {
    // 1. Start the app
    await page.goto('http://localhost:3000');

    // 2. Verify Start Screen
    await expect(page.getByText(/Witaj na pokładzie/)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Rozpocznij quiz' })).toBeVisible();

    // 3. Start Quiz
    await page.getByRole('button', { name: 'Rozpocznij quiz' }).click();

    // 4. Verify Quiz Screen or Empty State
    const emptyState = page.getByText('Brak pytań w bazie danych.');
    if (await emptyState.isVisible()) {
        console.log('Database is empty. Skipping quiz flow verification.');
        return;
    }

    await expect(page.getByText('Pytanie 1/')).toBeVisible();

    // 5. Answer questions
    // Since we don't know the exact questions from API, we will just click the first answer and proceed.

    // Get total questions count from text "Pytanie 1/X"
    const questionText = await page.getByText(/Pytanie 1\/\d+/).textContent();
    const totalQuestions = parseInt(questionText?.split('/')[1] || '5');

    for (let i = 1; i <= totalQuestions; i++) {
        await expect(page.getByText(`Pytanie ${i}/${totalQuestions}`)).toBeVisible();

        // Click first answer
        await page.locator('button.bg-merito-blue').first().click();

        // Click Confirm
        await page.getByRole('button', { name: 'Zatwierdź' }).click();

        // Click Next or Finish
        if (i < totalQuestions) {
            await page.getByRole('button', { name: 'Następne pytanie' }).click();
        } else {
            await page.getByRole('button', { name: 'Zakończ quiz' }).click();
        }
    }

    // 6. Verify Result Screen
    await expect(page.getByText('Gratulacje udało Ci się ukończyć nasz quiz!')).toBeVisible();
    await expect(page.getByText('Poprawne odpowiedzi:')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Rozpocznij jeszcze raz' })).toBeVisible();
});
