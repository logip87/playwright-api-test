import { test, expect } from '@playwright/test';
import { randomCode, randomID, randomName } from '../../functions/random';
import { updateStatus, updateStatusFail } from '../../functions/update-status';

test('Test status change order', async ({ request }) => {
    const id = randomID();
    const code = randomCode();
    const name = randomName();

    const creationOfTruck = await request.post(`/trucks`, {
        data: {
            id: id,
            code: code,
            name: name,
            status: 'LOADING',
            description: 'description',
        },
    });
    expect(creationOfTruck.ok()).toBeTruthy();
    console.log(await creationOfTruck.json());

    await test.step(`Should only be able to update status to TO_JOB`, async () => {
        await updateStatusFail(request, id, 'AT_JOB');
        await updateStatusFail(request, id, 'RETURNING');
        await updateStatus(request, id, 'TO_JOB');
    });
    await test.step(`Should only be able to update status to AT_JOB`, async () => {
        await updateStatusFail(request, id, 'LOADING');
        await updateStatusFail(request, id, 'RETURNING');
        await updateStatus(request, id, 'AT_JOB');
    });
    await test.step(`Should only be able to update status to RETURNING`, async () => {
        await updateStatusFail(request, id, 'LOADING');
        await updateStatusFail(request, id, 'TO_JOB');
        await updateStatus(request, id, 'RETURNING');
    });
    await test.step(`Should only be able to update status to LOADING`, async () => {
        await updateStatusFail(request, id, 'TO_JOB');
        await updateStatusFail(request, id, 'AT_JOB');
        await updateStatus(request, id, 'LOADING');
    });
});
