describe("signup", () => {
  it("register", () => {
    cy.clearLocalStorage();
    window.sessionStorage.clear();

    cy.visit("/");

    cy.contains("Create one now!").click();

    cy.url().should("include", "/register");

    cy.get('input[placeholder="Choose a Username"]').type("testregister");
    cy.get('input[placeholder="Choose a Password"]').type("testpassword");
    cy.get('input[placeholder="Repeat your Password"]').type("testpassword");
    cy.contains("Create your Account").click();

    cy.url().should("eq", "http://localhost:3000/");
    cy.contains("Hey testregister").should("exist");
  });

  it("logout", () => {
    cy.contains("Logout").click();
    cy.url().should("include", "/login");
  });

  it("login again", () => {
    cy.get('input[placeholder="Your Username"]').type("testregister");
    cy.get('input[placeholder="Your Password"]').type("testpassword");
    cy.contains("Login").click();

    cy.url().should("eq", "http://localhost:3000/");
    cy.contains("Hey testregister").should("exist");
  });
});
