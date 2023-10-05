import { test, expect } from '@playwright/test';
import { randomCode, randomID, randomName } from '../functions/random';

interface Truck {
    id: number;
    code: string;
}

test('Basic test to check if all of the trucks have unique code', async ({
    request,
}) => {
    const req = await request.get(`/trucks`);
    expect(req.ok()).toBeTruthy();
    const trucks = await req.json();
    console.log(trucks);
    const truckCodes = trucks.map((truck: { code: any }) => truck.code);
    const uniqueCodes = [...new Set(truckCodes)];
    expect(truckCodes.length).toBe(uniqueCodes.length);
});

test('Test to check if all of the trucks have unique code, with id specification', async ({ request }) => {
    let page = 1;
    let allTrucks: Truck[] = [];
    let morePages = true;

    while (morePages) {
        const req = await request.get(`/trucks?page=${page}`);
        expect(req.ok()).toBeTruthy();
        const trucks: Truck[] = await req.json();

        if (trucks.length === 0) {
            morePages = false;
        } else {
            allTrucks = allTrucks.concat(trucks);
            page += 1;
        }
    }

    console.log(allTrucks);

    const codeToIdsMap: { [code: string]: number } = {};
    const errors: string[] = [];

    for (let truck of allTrucks) {
        await test.step(`Check truck with id : ${truck.id}`, async () => {
            if (codeToIdsMap[truck.code]) {
                errors.push(
                    `Truck with ID ${truck.id} has a duplicate code: ${truck.code} previously seen with ID ${codeToIdsMap[truck.code]}`
                );
            } else {
                codeToIdsMap[truck.code] = truck.id;
            }
        });
    }

    if (errors.length > 0) {
        console.error(errors.join('\n'));
        throw new Error('Some trucks have duplicate codes.');
    }
});

test('Test to check if all of the trucks have a name', async ({ request }) => {
    const req = await request.get(`/trucks`);
    expect(req.ok()).toBeTruthy();
    const trucks = await req.json();

    const errors: string[] = [];

    for (let truck of trucks) {
        await test.step(`Check name for truck with id : ${truck.id}`, async () => {
            if (!truck.name || truck.name.trim() === '') {
                errors.push(`Truck with ID ${truck.id} does not have a name.`);
            }
        });
    }

    if (errors.length > 0) {
        console.error(errors.join('\n'));
        throw new Error('Some trucks do not have a name.');
    }
});
test('Test to check if all of the trucks have a valid status', async ({
    request,
}) => {
    const req = await request.get(`/trucks`);
    expect(req.ok()).toBeTruthy();
    const trucks = await req.json();

    const validStatuses = [
        'OUT_OF_SERVICE',
        'LOADING',
        'TO_JOB',
        'AT_JOB',
        'RETURNING',
    ];
    const errors: string[] = [];

    for (let truck of trucks) {
        await test.step(`Check status for truck with ${truck.id}`, async () => {
            if (!validStatuses.includes(truck.status)) {
                errors.push(
                    `Truck with ID ${truck.id} has an invalid status: ${truck.status}`
                );
            }
        });
    }

    // At the end, check if there were any errors
    if (errors.length > 0) {
        console.error(errors.join('\n'));
        throw new Error('Some trucks have invalid statuses.');
    }
});

test('Test to check if a truck may have a description', async ({ request }) => {
    const id = randomID();
    const code = randomCode();
    const name = randomName();

    const creationResponse = await request.post(`/trucks`, {
        data: {
            id: id,
            code: code,
            name: name,
            status: 'LOADING',
            description: 'truck description',
        },
    });
    expect(creationResponse.ok()).toBeTruthy();

    const fetchResponse = await request.get(`/trucks/${id}`);
    expect(fetchResponse.ok()).toBeTruthy();
    const truck = await fetchResponse.json();

    expect(truck.description).toBe('truck description');
});

test('Test Check mandatory unique code', async ({ request }) => {
    const id = randomID();
    const code = randomCode();
    const name = randomName();
    const id2 = randomID();
    const name1 = randomName();

    const creationResponse1 = await request.post(`/trucks`, {
        data: {
            id: id,
            code: code,
            name: name,
            status: 'LOADING',
            description: 'truck description',
        },
    });
    expect(creationResponse1.ok()).toBeTruthy();

    const creationResponse2 = await request.post(`/trucks`, {
        data: {
            id: id2,
            code: code,
            name: name1,
            status: 'LOADING',
            description: 'truck description',
        },
    });
    expect(creationResponse2.ok()).toBeFalsy();
});

test('Test Check mandatory name field', async ({ request }) => {
    const id = randomID();
    const code = randomCode();

    const creationResponse = await request.post(`/trucks`, {
        data: {
            id: id,
            code: code,
            name: '',
            status: 'LOADING',
            description: 'truck description',
        },
    });
    expect(creationResponse.ok()).toBeFalsy();
});
