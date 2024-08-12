import supertest from "supertest";
import { expect } from "chai";
import configObject from "../src/config/config.js";

const requester = supertest(configObject.mongoURL);

describe("Testing de la web de la Pastelería", () => {
  describe("Test de usuarios: ", () => {
    it("Endpoint POST /api/users debe crear un nuevo usuario", async () => {
      const userMock = {
        first_name: "Rey",
        last_name: "Dotto",
        email: "rey@dotto.com",
        password: "1234",
        age: 5,
        role: "user",
      };
      const { statusCode, ok, _body } = await requester
        .post("/api/users")
        .send(userMock);

      console.log("statusCode:", statusCode);
      console.log("ok:", ok);
      console.log("_body:", _body);

      //Y ahora evaluamos:
      expect(_body.payload).to.have.property("_id");
    });
  });
});
