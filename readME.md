# Truck Management API E2E Testing

This repository contains End-to-End tests for the Truck Management API available at `http://qa-api-mock-3.eu-central-1.elasticbeanstalk.com/`. The tests are written using the Playwright framework.

## Requirements

-   **Truck**:
    -   Must have a unique alphanumeric code.
    -   Must have a name.
    -   Must have a status included in the following set: `Out Of Service`, `Loading`, `To Job`, `At Job`, `Returning`.
    -   The "Out Of Service" status can be set regardless of the current status of the Truck.
    -   Each status can be set if the current status of the Truck is "Out of service".
    -   The remaining statuses can only be changed in the following order: `Loading -> To Job -> At Job -> Returning`. When the Truck has the "Returning" status, it can start "Loading" again.
    -   May have a description.

## Installation

Ensure you have [Node.js](https://nodejs.org/) installed.

1. Clone the repository:

    ```
    git clone <repository-url>
    ```

2. Navigate to the project directory:

    ```
     cd <project-directory>
    ```

3. Install the dependencies:

    ```
    npm install
    ```

## Running the Tests

To run all the tests, execute the following command:

    npx playwright test

## Test Suites

1. **truck-OUT_OF_SERVICE.spec.ts**:

    - Tests if the status `OUT_OF_SERVICE` can be updated to any other statuses (`LOADING`, `TO_JOB`, `AT_JOB`, `RETURNING`) and back.

2. **truck-statuses-rotation.spec.ts**:

    - Validates the status rotation order: `Loading -> To Job -> At Job -> Returning -> Loading`.

3. **each-truck.spec.ts**:
    - Ensures that all trucks have unique codes.
    - Checks if all trucks have a name.
    - Verifies if all trucks have a valid status.
    - Validates that a truck may have a description.

## Utility Functions

-   `randomCode()`: Generates a random alphanumeric code.
-   `randomID()`: Generates a random ID.
-   `randomName()`: Generates a random name.
-   `updateStatus()`: Updates the status of a truck.
-   `updateStatusFail()`: Asserts that the status update fails.

## Code Formatting

This project uses [Prettier](https://prettier.io/) for code formatting. Before committing your code, ensure to format your changes:
