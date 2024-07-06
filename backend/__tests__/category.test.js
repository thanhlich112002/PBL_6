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
      email: "owner@gmail.com",
      password: "leduchuy123",
    })
    .end((err, response) => {
      token = response.body.token;
      done();
    });
});

describe("Test for category API", () => {
  it("should successfully show all categories in your app ", async () => {
    const res = await request(app).get("/api/category");
    expect(res.statusCode).toEqual(200);
  });
  it("should successfully show all categories in store by store ID ", async () => {
    const res = await request(app)
      .get("/api/category/651d7093e1494e0d580de291")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
  });
});
describe("Test category API by owner", () => {
  it("should successfully add categoriy into your app ", async () => {
    const image = path.resolve(__dirname, "./images/category.jpg");
    const res = await request(app)
      .post("/api/category")
      .attach("photo", image)
      .field("catName", "Category test 2");
    expect(res.statusCode).toEqual(200);
  });
});
