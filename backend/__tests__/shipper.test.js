const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index");
const path = require("path");

require("dotenv").config();
/* Connecting to the database before each test. */
beforeEach(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  jest.setTimeout(10000);
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

let token;

beforeAll((done) => {
  request(app)
    .post("/api/auth/login")
    .send({
      email: "shipper11@gmail.com",
      password: "leduchuy123",
    })
    .end((err, response) => {
      token = response.body.token;
      done();
    });
});

describe("Test for shipper API", () => {
  it("should successfully register the shipper when filling in valid information ", async () => {
    const frontImageCCCDPath = path.resolve(
      __dirname,
      "./images/frontImageCCCD.jpg"
    );
    const behindImageCCCDPath = path.resolve(
      __dirname,
      "./images/behindImageCCCD.jpg"
    );
    const licenseImagePath = path.resolve(
      __dirname,
      "./images/licenseImage.jpg"
    );

    const res = await request(app)
      .post("/api/shipper")
      .attach("frontImageCCCD", frontImageCCCDPath)
      .attach("behindImageCCCD", behindImageCCCDPath)
      .attach("licenseImage", licenseImagePath)
      .field("firstName", "Hong")
      .field("lastName", "Le")
      .field("email", "hachangehislife@gmail.com")
      .field("password", "leduchuy123")
      .field("passwordConfirm", "leduchuy123")
      .field("vehicleNumber", "4567")
      .field("vehicleType", "Sirius")
      .field("vehicleLicense", "123")
      .field("licenseNumber", "123")
      .field("phoneNumber", "1234567890");
    expect(res.statusCode).toEqual(200);
  });
  it("should failed register when filling in invalid information ", async () => {
    const res = await request(app)
      .post("/api/shipper")
      .field("firstName", "Hong")
      .field("lastName", "Le")
      .field("email", "hachangehislife@gmail.com")
      .field("password", "leduchuy123")
      .field("passwordConfirm", "leduchuy123")
      .field("vehicleNumber", "4567")
      .field("vehicleType", "Sirius")
      .field("vehicleLicense", "123")
      .field("licenseNumber", "123")
      .field("phoneNumber", "1234567890");
    expect(res.statusCode).toEqual(500);
  });
  it("should update information successfully if the correct ID and updated information are entered", async () => {
    const res = await request(app)
      .patch("/api/shipper/652cd97e64e2b4312ce5d333")
      .set("Authorization", `Bearer ${token}`)
      .field("phoneNumber", "1234567890");
    expect(res.statusCode).toEqual(200);
  });
  it("should get information successfully if the correct ID is entered", async () => {
    const res = await request(app)
      .get("/api/shipper/652cd97e64e2b4312ce5d333")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
  });
});

describe("test shipper API by admin", () => {});
