const { test, expect } = require("@playwright/test");

/** What is the meaning of the async and await
 * async means the function to be executed asynchronously
 * await means to wait for the each line of code to be executed
 */

// By default, playwright code runs in the headless mode

/**
 * Difference between Cypress and Playwright
 * Cypress uses external package called mocha for assertions where as everyhting comes inside the playwright package only
 *
 */

test("This is the playwright test", async ({ browser }) => {
  const context = await browser.newContext(); // Creates a new fresh browser, we can inject cookies in the future
  const page = await context.newPage(); // await means wait until this line of code is executed successfully
  await page.goto("https://surajnepali.com.np");
  console.log(await page.title());
});

test("Test without having browser", async ({ page }) => {
  // page fixture
  /** When we call page fixture, what the system understands
   * - We do not have anything special (Cookie/Proxy) to inject in that browser
   *
   */
  await page.goto("https://google.com");
  console.log(await page.title());
  //   expect(await page.title()).toBe("Google");
  await expect(page).toHaveTitle("Google");
});
