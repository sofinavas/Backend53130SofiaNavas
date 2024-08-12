import mongoose from "mongoose";
import { expect } from "chai";
import request from "supertest";
import app from "../src/app.js";
import configObject from "../src/config/config.js";
import UserModel from "../src/models/user.model.js";

describe("User Model Test", () => {
  before(async () => {
    await mongoose.connect(configObject.mongoURL);
  });

  after(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  // Test para obtener todos los usuarios
  it("El get de user debe devolver un array", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });

  // Test para crear un nuevo usuario
  it("Debe crear un nuevo usuario", async () => {
    const newUser = {
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      age: 30,
      role: "user",
    };
    const res = await request(app).post("/api/users").send(newUser);
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("_id");
    expect(res.body.first_name).to.equal("John");
  });
});
