// @ts-check
import { chromium, defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests", // If it is "./tests", it will run all the tests from the tests folder
  timeout: 10 * 1000, // this timeout is applicable to every steps in the test
  expect: {
    timeout: 10 * 1000, // this timeout is exclusively for assertion validations
  },
  reporter: "html",
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    browserName: "chromium",
    headless: false, // If headless is true or no such property and you want to run in headed mode, you need to add --headed flag in the command line during execution
    screenshot: "on",
    trace: "retain-on-failure",
  },
});
