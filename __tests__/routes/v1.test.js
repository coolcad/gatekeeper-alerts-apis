const request = require("supertest");
const app = require("../../src/app");

const v1Routes = {
  alerts: {
    send: `/api/v1/alerts/send`
  }
};

describe("Application is responsive", () => {
  it("GET /", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });
});
describe("POST /alerts/send", () => {
  it("should send an email", async () => {
    const response = await request(app)
      .post(v1Routes.alerts.send)
      .send({
        alertName: "Test",
        alertMessage: "Test",
        deliveryMethods: ["email"],
        receivers: [
          {
            name: "Sai",
            email: "sai@gkaccess.com"
          }
        ]
      });

    expect(response.status).toBe(200);
  });
});
