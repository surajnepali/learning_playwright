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
  /**
   * In order to debug the code using Playwright Inspector
   * We can enter the following command in the terminal
   * npx playwright test test/filename.spec.js --debug
   * Upon running this command, Playwright Inspector will open along with browser
   * Then we can debug the code
   */

  /**
   * We can just record and playback the automation using codegen
   * In order to do that, we can enter the following command in the terminal
   * npx playwright codegen https://google.com
   * Upon running this command, it will open a browser and a Playwright Inspector
   * It will generate code and record on our every action in the website
   */
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

test("should verify all text contents without having call to first and second items", async ({
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

test("Handling Child Windows and Tabs", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const documentLink = page.locator("[href*='documents-request']");
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  // context.waitForEvent("page"); // This method is called before clicking the document link because it has to listen before the action is made to open the link
  // await documentLink.click();

  /*Basically Promise has three states: Pending, Fulfilled and Rejected
   *When an element is found and the code is searching for it then its Pending
   * When an element is found and the code is searching for it then its Fulfilled
   * When an element is not found after a certain time then its Rejected
   */

  /**
   * Promise.all is used to execute multiple promises at the same time
   * It will come out of this array only after all the promises are resolved
   * If one of the promises is rejected, the promise will be rejected/failed
   * The expectation of this array is that it has to return fulfilled promises into an index
   */
  const [newPage] = await Promise.all([
    context.waitForEvent("page"), // It returns a new page
    documentLink.click(), // It doesnot return anything, its just a click action
  ]);

  const text = await newPage.locator(".red").textContent();
  console.log("Extracted text is: " + text);

  // To come from newPage to page, you do not need to do anything, just use page
});

test("Full Checkout Process", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/client/");

  // Login From the Login page
  const loginEmail = "automationtesting7896@gmail.com";
  const emailField = page.locator("#userEmail");
  const passwordField = page.locator("#userPassword");
  const loginButton = page.locator("#login");
  const productToCheckout = "ADIDAS ORIGINAL";

  await emailField.fill(loginEmail);
  await passwordField.fill("R@hul123");
  await loginButton.click();

  // Add a product from dashboard dynamically using the product name you want to add
  const productsContainer = page.locator("section#products");

  await productsContainer.locator(".card").first().waitFor();
  const products = await productsContainer.locator(".card").all();
  for (const product of products) {
    const productNameText = await product.locator("h5 b").textContent();
    if (productNameText === productToCheckout) {
      await product.locator("text= Add To Cart").click();
      await expect(page.locator("#toast-container")).toHaveText(
        "Product Added To Cart"
      );
      break;
    }
  }

  // After successfully clicking Add to cart button, click Cart button from Navbar
  const cartButton = page.locator("button[routerlink='/dashboard/cart']");
  await cartButton.click();

  // Verify that right product is added in the cart and click Checkout button
  const productsInCart = page.locator("div.cart").locator("li");
  await productsInCart.first().waitFor();
  const firstProductInCartName = await productsInCart
    .nth(0)
    .locator("h3")
    .textContent();
  expect(firstProductInCartName).toBe(productToCheckout);

  // Click Checkout button
  await page.locator("div.subtotal button").click();

  // In the Checkout page, verify the right product is available
  const productInCheckout = await page
    .locator("div.details__item")
    .locator("div.item__title")
    .textContent();
  expect(productInCheckout.trim()).toBe(productToCheckout);

  // Fill the Credit Card fields in the Personal Information Container
  const rowsInPersonalInfoContainer = page
    .locator("div.form__cc")
    .locator("div.row");
  await rowsInPersonalInfoContainer.nth(1).locator("input").fill("666");
  await rowsInPersonalInfoContainer
    .nth(2)
    .locator("input")
    .fill("Rohit Shetty");
  await page
    .locator("div.form__cc")
    .locator("input[name='coupon']")
    .fill("rahulshettyacademy");
  // await page.locator("div.form__cc").locator("button[type='submit']").click();

  // const appliedCouponTextSelector = page.locator("div.form__cc").locator("p");
  // await appliedCouponTextSelector.first().waitFor();
  // expect(await appliedCouponTextSelector.textContent().trim()).toBe(
  //   "Coupon Applied"
  // );

  const myCountry = "Nep";
  await page
    .locator("input[placeholder='Select Country']")
    .pressSequentially(myCountry);
  const dropdown = page.locator(".ta-results");
  await dropdown.waitFor();
  const optionCount = await dropdown.locator("button").count();
  for (let i = 0; i < optionCount; i++) {
    const text = await dropdown.locator("button").nth(i).textContent();
    if (text.trim() === "Nepal") {
      await dropdown.locator("button").nth(i).click();
      break;
    }
  }

  // Verify that an email field of Shipping Information container contains the logged in user email
  await expect(page.locator("div.user__name input.ng-valid")).toHaveValue(
    loginEmail
  );

  // Click PLACE ORDER button
  const placeOrderButton = page.locator("div.actions a");
  await placeOrderButton.click();

  const orderConfirmationContainer = page.locator("table#htmlData");
  await orderConfirmationContainer.waitFor();

  const thankYouText = await orderConfirmationContainer
    .locator("h1.hero-primary")
    .textContent();
  expect(thankYouText).toBe(" Thankyou for the order. ");
  const orderId = await orderConfirmationContainer
    .locator("label.ng-star-inserted")
    .textContent();
  const orderHistoryPage = orderConfirmationContainer.locator(
    '[routerlink="/dashboard/myorders"]'
  );
  await orderHistoryPage.click();

  const table = page.locator(".table");
  await table.waitFor();
  const rowsCount = await table.locator("tbody").locator("tr").count();
  for (let i = 0; i < rowsCount; i++) {
    const row = table.locator("tbody").locator("tr").nth(i);
    const expectedColumnId = await row.locator("th").textContent();
    if (
      expectedColumnId.trim() === orderId.split("| ")[1].split(" |")[0].trim()
    ) {
      const expectedProductName = await row.locator("td").nth(1).textContent();
      expect(expectedProductName.trim()).toBe(productToCheckout);
      const viewButton = row.locator(".btn-primary");
      await viewButton.click();
      break;
    }
  }

  const orderIdInOrderSummary = await page
    .locator("div.email-container div.col-text.-main")
    .textContent();
  expect(orderId.includes(orderIdInOrderSummary.trim())).toBeTruthy();
});

test("Playwright Special Locators", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/angularpractice/");
  await page.getByLabel("Check me out if you Love Icecreams!").click();
  await page.getByLabel("Employed").check();
  await page.getByLabel("Gender").selectOption("Male");
  await page.getByPlaceholder("Password").fill("R@hul123");
  await page.getByRole("button", { name: "Submit" }).click();
  await page
    .getByText("Success! The Form has been submitted successfully!.")
    .click();

  await page.getByRole("link", { name: "Shop" }).click();
  await page
    .locator("app-card")
    .filter({ hasText: "Nokia Edge" })
    .getByRole("button")
    .click();

  // Like Cypress if we want to use Test Runner, we can use the following command
  // npx playwright test --ui

  // What kind of html code the .getByLabel() works for edit box?
  /**
   * It works for:
   * 1. <label> label_name <input> </label>
   * 2. <label for="userEmail"> label_name </label> <input id="userEmail">
   *
   * But it won't work for:
   * 1. <label> </label>
   * 2. <label for="userEmail"> label_name </label>  <input id="email">
   */
});
