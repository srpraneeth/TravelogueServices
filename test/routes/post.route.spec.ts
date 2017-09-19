import * as mocha from "mocha";
import * as chai from "chai";
import chaiHttp = require("chai-http");

import * as jwt from "jsonwebtoken";

import { ObjectId } from "mongodb";

import app from "../../src/app";
import config from "../../src/config/config";

chai.use(chaiHttp);
const expect = chai.expect;

let token = jwt.sign(
  {
    id: "1234567890",
    name: "John Doe"
  },
  config.JWT_SECRET
);

describe("postRoute", () => {
  it("Create post should return post document id", () => {
    return chai
      .request(app)
      .post("/")
      .set("content-type", "application/json")
      .set("Authorization", "Bearer " + token)
      .send({ head: "XYZ Post", content: "Test Content" })
      .then(res => {
        expect(res.type).to.eql("application/json");
        chai.assert.isTrue(
          ObjectId.isValid(res.body._id),
          "_id is not valid Document Id"
        );
      });
  });
});
