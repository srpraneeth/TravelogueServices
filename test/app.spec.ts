import * as mocha from "mocha";
import * as chai from "chai";
import chaiHttp = require("chai-http");

import app from "../src/app";

chai.use(chaiHttp);
const expect = chai.expect;

before(function(done) {
  this.timeout(9000);
  setTimeout(done, 5000);
});

describe("docsRoutes", () => {
  it("should get json swagger docs", () => {
    chai.request(app).get("/api-docs").then(res => {
      expect(res.status).to.eql(200);
      expect(res.type).to.eql("application/json");
    });
  });
});

describe("swagger-ui route", () => {
  it("should bring up Swagger UI", () => {
    return chai.request(app).get("/").then(res => {
      expect(res.type).to.eql("text/html");
    });
  });
});
