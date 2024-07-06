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
      idOwner = response.body.data.user._id;
      done();
    });
});
let idProduct;
describe("Test product API by owner", () => {
  it("should successfully add product into store by store id ", async () => {
    const food1 = path.resolve(__dirname, "./images/food1.jpg");
    const food2 = path.resolve(__dirname, "./images/food2.jpg");
    const food3 = path.resolve(__dirname, "./images/food3.jpg");
    const res = await request(app)
      .post("/api/product/store/653233e16d8d513510d93744")
      .set("Authorization", `Bearer ${token}`)
      .attach("images", food1)
      .attach("images", food2)
      .attach("images", food3)
      .field("catName", "Đồ ăn")
      .field("name", "Product test")
      .field("price", 100000)
      .field("description", "Product test");
    idProduct = res.body.data._id;
    expect(res.statusCode).toEqual(201);
  });
  it("should be show product by product id", async () => {
    const res = await request(app)
      .get(`/api/product/${idProduct}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
  });

  it("should be show list products by category", async () => {
    const res = await request(app)
      .get("/api/product")
      .query({ catName: "Đồ ăn" })
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
  });

  it("should delete a product if it exists", async () => {
    const res = await request(app)
      .delete(`/api/product/${idProduct}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
  });
  it("should be show all products by owner id", async () => {
    const res = await request(app)
      .get(`/api/product/store/${idOwner}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
  });
});
