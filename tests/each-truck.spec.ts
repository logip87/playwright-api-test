import { test, expect } from "@playwright/test";
import { randomCode, randomID, randomName } from "../functions/random";

test("Basic test to check if all of the trucks have unique code", async ({
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

test("Test to check if all of the trucks have unique code, with id specification", async ({
  request,
}) => {
  const req = await request.get(`/trucks`);
  expect(req.ok()).toBeTruthy();
  const trucks = await req.json();
  console.log(trucks);

  const codeToIdsMap: { [code: string]: number } = {};
  const errors: string[] = [];

  for (let truck of trucks) {
    await test.step(`Check truck with id : ${truck.id}`, async () => {
      if (codeToIdsMap[truck.code]) {
        errors.push(
          `Truck with ID ${truck.id} has a duplicate code: ${truck.code}`,
        );
      } else {
        codeToIdsMap[truck.code] = truck.id;
      }
    });
  }

  if (errors.length > 0) {
    console.error(errors.join("\n"));
    throw new Error("Some trucks have duplicate codes.");
  }
});
test("Test to check if all of the trucks have a name", async ({ request }) => {
  const req = await request.get(`/trucks`);
  expect(req.ok()).toBeTruthy();
  const trucks = await req.json();

  const errors: string[] = [];

  for (let truck of trucks) {
    await test.step(`Check name for truck with id : ${truck.id}`, async () => {
      if (!truck.name || truck.name.trim() === "") {
        errors.push(`Truck with ID ${truck.id} does not have a name.`);
      }
    });
  }

  if (errors.length > 0) {
    console.error(errors.join("\n"));
    throw new Error("Some trucks do not have a name.");
  }
});
test("Test to check if all of the trucks have a valid status", async ({
  request,
}) => {
  const req = await request.get(`/trucks`);
  expect(req.ok()).toBeTruthy();
  const trucks = await req.json();

  const validStatuses = [
    "OUT_OF_SERVICE",
    "LOADING",
    "TO_JOB",
    "AT_JOB",
    "RETURNING",
  ];
  const errors: string[] = [];

  for (let truck of trucks) {
    await test.step(`Check status for truck with ${truck.id}`, async () => {
      if (!validStatuses.includes(truck.status)) {
        errors.push(
          `Truck with ID ${truck.id} has an invalid status: ${truck.status}`,
        );
      }
    });
  }

  // At the end, check if there were any errors
  if (errors.length > 0) {
    console.error(errors.join("\n"));
    throw new Error("Some trucks have invalid statuses.");
  }
});

test("Test to check if a truck may have a description", async ({ request }) => {
  const id = randomID();
  const code = randomCode();
  const name = randomName();

  const creationResponse = await request.post(`/trucks`, {
    data: {
      id: id,
      code: code,
      name: name,
      status: "LOADING",
      description: "truck description",
    },
  });
  expect(creationResponse.ok()).toBeTruthy();

  const fetchResponse = await request.get(`/trucks/${id}`);
  expect(fetchResponse.ok()).toBeTruthy();
  const truck = await fetchResponse.json();

  expect(truck.description).toBe("truck description");
});
