import { test, expect } from '@playwright/test';
import { randomCode, randomID, randomName } from './random';
export async function updateStatus(request, id, updatedStatus) {
    await test.step(`Should be abble to update status to ${updatedStatus}`, async () => {
        const updateStatus = await request.put(`/trucks/${id}`, {
            data: {
                status: updatedStatus,
            },
        });
        // expect(updateStatus.ok()).toBeTruthy();
        if (!updateStatus.ok()) {
            throw new Error(
                `Expected truck with ID ${id} to update status to ${updatedStatus}, but got status ${updateStatus.status()}`
            );
        }

        const updatedTruck = await updateStatus.json();
        expect(updatedTruck.status).toBe(updatedStatus);

        console.log(await updateStatus.json());
    });
}

export async function updateStatusFail(request, id, updatedStatus) {
    await test.step(`Should not be abble to update status to ${updatedStatus}`, async () => {
        const updateStatus = await request.put(`/trucks/${id}`, {
            data: {
                status: updatedStatus,
            },
        });
        expect(updateStatus.ok()).toBeFalsy();
        console.log(await updateStatus.json());
    });
}

export async function testStatusUpdate(request, initialStatus, updatedStatus) {
    const id = randomID();
    const code = randomCode();
    const name = randomName();

    const creationOfTruck = await request.post(`/trucks`, {
        data: {
            id: id,
            code: code,
            name: name,
            status: initialStatus,
            description: 'description',
        },
    });
    if (!creationOfTruck.ok()) {
        throw new Error(
            `Expected truck with ID ${id} to be created, but got status ${creationOfTruck.status()}`
        );
    }
    await updateStatus(request, id, updatedStatus);
    await updateStatus(request, id, initialStatus);
}
