import * as mocha from "mocha";
import * as chai from "chai";
import chaiHttp = require("chai-http");

import app from "../../src/app";

chai.use(chaiHttp);
const expect = chai.expect;

describe("indexRoute", () => {
  it("should be redirecting to Swagger UI", () => {
    return chai.request(app).get("/").then(res => {
      expect(res.type).to.eql("text/html");
    });
  });
});
