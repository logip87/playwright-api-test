import { test, expect } from "@playwright/test";
import { testStatusUpdate } from "../../functions/update-status";

test("Check if status can OUT_OF_SERVICE be updated  to LOADING and back", async ({
  request,
}) => {
  await testStatusUpdate(request, "OUT_OF_SERVICE", "LOADING");
});

test("Check if status can OUT_OF_SERVICE be updated  to TO_JOB and back", async ({
  request,
}) => {
  await testStatusUpdate(request, "OUT_OF_SERVICE", "TO_JOB");
});

test("Check if status can OUT_OF_SERVICE be updated  to AT_JOB and back", async ({
  request,
}) => {
  await testStatusUpdate(request, "OUT_OF_SERVICE", "AT_JOB");
});

test("Check if status can OUT_OF_SERVICE be updated  to RETURNING and back", async ({
  request,
}) => {
  await testStatusUpdate(request, "OUT_OF_SERVICE", "RETURNING");
});
