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
      email: "user01@gmail.com",
      password: "leduchuy123",
    })
    .end((err, response) => {
      token = response.body.token;
      done();
    });
});

describe("Test for user API", () => {
  let idContact;
  it("should successfully register user when filling in valid information ", async () => {
    const res = await request(app)
      .post("/api/user")
      .send({
        firstName: "Anh",
        lastName: "Le",
        email: "user02@gmail.com",
        password: "leduchuy123",
        passwordConfirm: "leduchuy123",
        address: "Đà Nẵng",
        phoneNumber: "0112233444",
      });
    expect(res.statusCode).toEqual(200);
  });
  it("should failed register when filling in invalid information ", async () => {
    const res = await request(app)
      .post("/api/user")
      .send({
        firstName: "Anh",
        lastName: "Le",
        email: "user02@gmail.com",
        password: "leduchuy123",
        passwordConfirm: "leduchuy123",
        address: "Đà Nẵng",
        phoneNumber: "0112233444",
      });
    expect(res.statusCode).toEqual(500);
  });
  it("should update information successfully if the correct ID and updated information are entered", async () => {
    const res = await request(app)
      .patch("/api/user/653b7a0d77d2571e5885452a")
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstName: "Duc Huy",
        lastName: "Le",
        address: "Hà Nội",
        phoneNumber: "0123123123",
      });
    expect(res.statusCode).toEqual(200);
  });
  it("should get information successfully if the correct ID is entered", async () => {
    const res = await request(app)
      .get("/api/user/653b7a0d77d2571e5885452a")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
  });
  it("should change the password successfully if the old password is entered correctly and the new password is valid", async () => {
    const res = await request(app)
      .get("/api/user/653b7a0d77d2571e5885452a")
      .set("Authorization", `Bearer ${token}`)
      .send({
        oldPass: "leduchuy123",
        newPass: "leduchuy123",
        confirmedPass: "leduchuy123",
      });
    expect(res.statusCode).toEqual(200);
  });
  it("should change the password successfully if the old password is entered correctly and the new password is valid", async () => {
    const res = await request(app)
      .get("/api/user/653b7a0d77d2571e5885452a")
      .set("Authorization", `Bearer ${token}`)
      .send({
        oldPass: "leduchuy1234",
        newPass: "leduchuy123",
        confirmedPass: "leduchuy123",
      });
    expect(res.statusCode).toEqual(200);
  });
  it("should add contact successfully if the correct user ID is entered", async () => {
    const res = await request(app)
      .put("/api/user/add-contact/653b7a0d77d2571e5885452a")
      .set("Authorization", `Bearer ${token}`)
      .send({
        address: "Quảng Nam",
        phoneNumber: "1231231231",
      });
    expect(res.statusCode).toEqual(200);
  });
  it("should set default contact successfully if the correct user ID is entered", async () => {
    const res = await request(app)
      .post(
        "/api/user/set-default-contact/653b7a0d77d2571e5885452a/653b850cca576537f0829dca"
      )
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.defaultContact).toEqual("653b850cca576537f0829dca");
    idContact = res.body.contact[res.body.contact.length - 1]._id;
  });
  it("should get default contact successfully if the correct user ID is entered", async () => {
    const res = await request(app)
      .get("/api/user/get-default-contact/653b7a0d77d2571e5885452a")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
  });
  it("should delete contact successfully if the correct user ID and the correct contact ID are entered", async () => {
    const res = await request(app)
      .delete(`/api/user/del-contact/653b7a0d77d2571e5885452a/${idContact}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
  });
});
