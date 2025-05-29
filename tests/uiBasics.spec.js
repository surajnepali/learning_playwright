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

test("This is the playwright test for test login with invalid credentials", async ({
  browser,
}) => {
  const context = await browser.newContext(); // Creates a new fresh browser, we can inject cookies in the future
  const page = await context.newPage(); // await means wait until this line of code is executed successfully
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  console.log(await page.title());

  // Initially, there were two methods to fill the fields: `fill` and `type`, but new the newer version of Playwright `type` method is deprecated so `fill` has to be used
  await page.locator("#username").fill("rahulshetty");
  await page.locator("[name='password']").fill("learning");
  await page.locator("#signInBtn").click();

  // Get the text from the location
  console.log(await page.locator("[style*='block']").textContent());

  // Assertions using expect method to check the substring
  await expect(page.locator("[style*='block']")).toContainText("Incorrect");
});

test("should login with valid login credentials", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  await page.locator("#username").fill("rahulshettyacademy");
  await page.locator("[name='password']").fill("learning");

  // Select option from dropdown if the tag of the dropdown is select
  await page.locator("select.form-control").selectOption("student");

  // action is a method which is used to perform actions on the page
  await page.locator("input[type='checkbox']").check();
  await expect(page.locator("input[type='checkbox']")).toBeChecked(); // inside expect we have passed locator and actual action is done outside expect by using .toBeChecked()

  expect(
    await page.locator("input[type='checkbox']").isChecked()
  ).toBeChecked(); // but here we have used isChecked() method to check whether the checkbox is checked or not that is why await is inside the expect but not outside

  expect(page.locator("[href*='documents-request']")).toHaveAttribute(
    "class",
    "blinkingText"
  );

  await page.locator("#signInBtn").click();

  // This .first() is to get the first item
  const textOfFirstItem = await page
    .locator(".card-body a")
    .first()
    .textContent();
  console.log("First Item " + textOfFirstItem);

  // This .nth(n) is to get the nth item
  const textOfSecondItem = await page
    .locator(".card-body a")
    .nth(1)
    .textContent();
  console.log("Second Item " + textOfSecondItem);

  // This .allTextContents() is to get all the items
  const allItems = await page.locator(".card-body a").allTextContents();
  console.log(allItems);
});

test.only("should verify all text contents without having call to first and second items", async ({
  page,
}) => {
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  await page.locator("#username").fill("rahulshettyacademy");
  await page.locator("[name='password']").fill("learning");
  await page.locator("#signInBtn").click();

  // If we want to get all the items without using first and second items, then it will fail because it does not wait until the actual data is loaded that is why we are adding following line in the code
  await page.locator(".card-body a").first().waitFor();

  // You can check playwright.dev/docs/actionability
  const allItems = await page.locator(".card-body a").allTextContents(); // allTextContents() does not support automatic wait
  console.log(allItems);
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
