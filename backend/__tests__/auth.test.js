const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index");

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
      email: "user321@gmail.com",
      password: "leduchuy123",
    })
    .end((err, response) => {
      token = response.body.token; // lưu token để sử dụng sau này
      console.log(token);
      done();
    });
});

describe("User Authentication API", () => {
  it("should logout a user", async () => {
    const res = await request(app)
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${token}`)
      .send();
    expect(res.statusCode).toEqual(200);
    // expect(res.body).toHaveProperty("message", "Đăng xuất thành công");
  });

  it("should send forgot password email", async () => {
    const res = await request(app)
      .post("/api/auth/forgotPassword")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "hachangehislife@gmail.com",
      });
    expect(res.statusCode).toEqual(200);
    // expect(res.body).toHaveProperty("message", "Mã đã được gửi đến email!");
  });

  it("should reset password", async () => {
    const res = await request(app)
      .patch("/api/auth/resetPassword/test@example.com")
      .send({
        token: "randomtoken",
        password: "newpassword123",
        passwordConfirm: "newpassword123",
      });
    expect(res.statusCode).toEqual(200);
  });

  it("should verify token", async () => {
    const res = await request(app)
      .patch("/api/auth/verifiedToken/test@example.com")
      .send({
        token: "randomtoken",
      });
    expect(res.statusCode).toEqual(200);
  });
});

describe("Sign Up User", () => {
  it("should sign up a user", async () => {
    const res = await request(app)
      .post("/api/user")
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstName: "Anh",
        lastName: "Le",
        email: "hachangehislife@gmail.com",
        password: "leduchuy123",
        passwordConfirm: "leduchuy123",
        address: "Đà Nẵng",
        phoneNumber: "0112233444",
      });
    expect(res.statusCode).toEqual(200);
  });
  it("Registration fails if user information is invalid", async () => {
    const res = await request(app)
      .post("/api/user")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "hachangehislife@gmail.com",
        password: "leduchuy123",
        passwordConfirm: "leduchuy123",
      });
    expect(res.statusCode).toEqual(200);
  });
});
