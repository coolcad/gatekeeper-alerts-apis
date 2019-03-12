require("dotenv").config();
const request = require("supertest");
const mongoose = require("mongoose");
const config = require("../../src/config/config");
const app = require("../../src/app");

const v1Routes = {
  alerts: {
    send: `/api/v1/alerts/send`
  }
};

describe("Application is responsive", () => {
  it("GET /", async done => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    done();
  });
});

describe("Invalid Route is 404", () => {
  it("GET /doesnotexist", async done => {
    const response = await request(app).get("/doesnotexist");
    expect(response.statusCode).toBe(404);
    done();
  });
});

describe("POST /api/v1/alerts/send", () => {
  beforeAll(async done => {
    await mongoose.connect(config.databaseUri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      socketTimeoutMS: 30000,
      keepAlive: true,
      reconnectTries: 30000,
      poolSize: 10
    });
    done();
  });
  afterAll(async done => {
    await mongoose.connection.close();

    done();
  });
  it("should fail with req body validation", async done => {
    const response = await request(app)
      .post(v1Routes.alerts.send)
      .send({
        alertName: "Test",
        alertMessage: "Test",
        deliveryMethods: ["email"]
      });

    expect(response.status).toBe(400);
    done();
  });

  it.only("should throw error for wrong Authorization header", async done => {
    const response = await request(app)
      .post(v1Routes.alerts.send)
      .set("Authorization", "c3eba8b4-4dde-49fa-9c4b-e138118f5a8a") // Its a wrong externalLicenseId
      .send([
        {
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
        }
      ]);

    expect(response.status).toBe(400);
    done();
  });

  it.skip("should send an email", async done => {
    const response = await request(app)
      .post(v1Routes.alerts.send)
      .set("Authorization", "c3eba8b4-4dde-49fa-9c4b-e138118f5a8d")
      .send([
        {
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
        }
      ]);

    expect(response.status).toBe(200);
    done();
  });

  it.skip("should send an sms", async done => {
    const response = await request(app)
      .post(v1Routes.alerts.send)
      .set("Authorization", "c3eba8b4-4dde-49fa-9c4b-e138118f5a8d")
      .send([
        {
          alertName: "Test",
          alertMessage: "Test",
          deliveryMethods: ["sms"],
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
              email: "sai@gkaccess.com",
              phoneNumber: "+16824722966"
            }
          ]
        }
      ]);

    expect(response.status).toBe(200);
    done();
  });
});
