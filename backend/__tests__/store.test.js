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
let idOwner;

beforeAll((done) => {
  request(app)
    .post("/api/auth/login")
    .send({
      email: "owner@gmail.com",
      password: "leduchuy123",
    })
    .end((err, response) => {
      token = response.body.token;
      done();
    });
});

describe("Test store API by owner", () => {
  it("should be show list products by category", async () => {
    const res = await request(app)
      .get("/api/store")
      .query({ catName: "Đồ ăn", address: "Hà Nội" })
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
  });
  it("should be show list products in city", async () => {
    const res = await request(app)
      .get("/api/store/city")
      .query({ city: "Đồ ăn" })
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
  });
});
