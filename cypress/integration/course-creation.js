import { userLogin } from './Utils';

const adminEmail = "adarsh@cloudyuga.guru";
const studentEmail = "nilam2267@gmail.com";

describe("Login to the staging setup", () => {
  it("logs in as an admin", () => {
    userLogin(adminEmail);
  });

  it("logs in as a student", () => {
    userLogin(studentEmail);
  });
});

describe("Create a new course with all the course parameters modified", () => {
  before(() => userLogin(adminEmail));

  beforeEach(() => {
    Cypress.Cookies.preserveOnce("_cloudyuga_session");
  });

  it("creates a new course", () => {
    cy.contains("Create New Course").click();
    console.log("HELLO WORLD");
  });

  it("adds a basic info for the course", () => {
    const courseName = "Test Cypress 1";

    cy.get('input[name="basicInfo.title"]')
      .type(courseName)
      .should("have.value", courseName);

    cy.get('input[name="basicInfo.shortDescription"]')
      .type(courseName)
      .should("have.value", courseName);

    cy.get('div[data-placeholder="Enter long description"]').type(courseName);

    cy.get('input[name="basicInfo.courseIdSymlink"]')
      .clear({ force: true })
      .type(courseName)
      .should("have.value", courseName);
  });

  it("ticks two authors if found", () => {
    let i = 1;
    cy.contains("Author Information").click({ force: true });

    cy.get('input[name="authorInfo.assignedAuthorIds"]').each((author) => {
      author.click();

      // Select only the first two authors
      if (++i == 3) {
        return false;
      }
    });
  });

  it("adds different pricing and validity", () => {
    cy.contains("Pricing and Validity").click({ force: true });

    cy.scrollTo("center").wait(1000);

    cy.get('select[name="pricingAndValidityInfo.priceCurrency"]').select("INR");

    cy.get('input[name="pricingAndValidityInfo.price"]').clear().type("10");

    cy.get('input[name="pricingAndValidityInfo.strikedPrice"]')
      .clear()
      .type("20");

    cy.get('select[name="pricingAndValidityInfo.trialPeriodInDays"]').select(
      "24 Hours"
    );
  });

  it("modifies switch in the configurable parameters", () => {
    cy.contains("Configurable Parameters").click({ force: true });

    cy.get('input[name="configurableParameters.active"]').click({
      force: true,
    });
  });

  it("fills the course show page information", () => {});

  it("adds few tags", () => {
    cy.contains("Tags").click({ force: true });

    cy.scrollTo("bottom").wait(1000);

    cy.get('input[name="tags.tagList"]').type(
      "testing, cypress, hello-world-app"
    );
  });

  it("checks for feature flags", () => {
    cy.contains("Feature Flags").click({ force: true });

    cy.scrollTo("bottom").wait(1000);

    cy.get('input[value="requires_container"]').click();
  });

  it("saves the course", () => {
    cy.scrollTo("bottom").wait(1000);

    cy.contains("Save").click().wait(2000);

    cy.url().should("include", "/backstage/courses");
  });
});

// describe("Check how describe block works", () => {
//   console.log("NEw describe");
//   Try using .type('{enter}') to simulate pressing enter key
// });
