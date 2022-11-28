describe("signup", () => {
  before(() => {
    cy.clearLocalStorage();
    window.sessionStorage.clear();
    cy.visit("/");

    cy.get('input[placeholder="Your Username"]').type("testuser");
    cy.get('input[placeholder="Your Password"]').type("testpassword");
    cy.contains("Login").click();

    cy.url().should("eq", "http://localhost:3000/");
    cy.contains("Hey testuser").should("exist");
  });

  it("create & read", () => {
    cy.get('input[placeholder="Title"]').should("be.enabled").type("test task 1");
    cy.contains("Save").click();

    cy.contains("Create a Task").click();
    cy.get('input[placeholder="Title"]')
      .should("be.enabled")
      .type("test task 2");
    cy.contains("Add a Description").click();
    cy.get('textarea[placeholder="Task Description"]').type("test description");
    cy.contains("Priority").parent().contains("3").click();
    cy.contains("Save").click().should("not.exist");

    cy.contains("test task").should("exist");
  });

  it("update", () => {
    cy.contains("test task 2").click();
    cy.contains("Edit").click();
    cy.get('input[placeholder="Title"]').should("be.enabled").clear().type("test task 2 updated");
    cy.contains("Save").click();

    cy.contains("test task 2 updated").should("exist");
    cy.contains(/^test task 2$/).should("not.exist");
  })

  it("delete", () => {
    cy.contains("test task 1").click();
    cy.contains("Delete").click();
    cy.contains("test task 1").should("not.exist");

    cy.contains("test task 2").parent().get("img[title='Delete']").first().click();
    cy.contains("test task 2").should("not.exist");

    cy.get('input[placeholder="Title"]').should("be.visible");
  });
});
