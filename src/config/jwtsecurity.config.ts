import * as jwt from "jsonwebtoken";

import config from "./config";

class JwtSecurity {
  constructor() {}

  static jwtSecurity = function(req, resp, next) {
    if (
      req.headers.authorization &&
      (<string>req.headers.authorization).trim().split(" ")[0] === "Bearer"
    ) {
      let token = (<string>req.headers.authorization).trim().split(" ")[1];
      jwt.verify(token, config.JWT_SECRET, function(err, decoded) {
        if (err) {
          return resp.status(401).send({
            message: "Expired or Invalid token"
          });
        } else {
          req.user = decoded;
          next();
        }
      });
    } else {
      return resp.status(401).send({ message: "No Token Provided" });
    }
  };
}

export default JwtSecurity.jwtSecurity;
