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

describe("POST /api/v1/alerts/send", () => {
  it("should fail with req body validation", async () => {
    const response = await request(app)
      .post(v1Routes.alerts.send)
      .send({
        alertName: "Test",
        alertMessage: "Test",
        deliveryMethods: ["email"]
      });

    expect(response.status).toBe(400);
  });

  it("should send an email", async () => {
    const response = await request(app)
      .post(v1Routes.alerts.send)
      .send([{
        alertName: "Test",
        alertMessage: "Test",
        deliveryMethods: ["email"],
        alertLogs: [
          {
            alertDateTime: "2019-02-22T11:38:08.2867789-05:00",
            eventType: "Service Started",
            computerName: "DEVELOPER",
            userName: "N/A"
          }
        ],
        receivers: [
          {
            name: "Sai",
            email: "sai@gkaccess.com"
          }
        ]
      }]);

    expect(response.status).toBe(200);
  });
});
