const { test, expect, request } = require("@playwright/test");
const url = "https://rahulshettyacademy.com";
const loginPayload = {
  userEmail: "automationtesting7896@gmail.com",
  userPassword: "R@hul123",
};
let token;

test.beforeAll(async () => {
  const apiContext = await request.newContext();
  const loginResponse = await apiContext.post(`${url}/api/ecom/auth/login`, {
    data: loginPayload,
  });
  expect(loginResponse.ok()).toBeTruthy();
  const loginResponseJson = await loginResponse.json();
  token = await loginResponseJson.token;
  console.log("Token is: " + token);
});

test("Testing", async ({ page }) => {
  page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, token);
  await page.goto(`${url}/client`);
});
