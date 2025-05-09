import * as express from "express";
import * as jwt from "jsonwebtoken";
import { config } from '../config';

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  if (securityName === "jwt") {
    const token =
      request.body.token ||
      request.query.token ||
      request.headers["authorization"]?.split(' ')[1];

    return new Promise((resolve, reject) => {
      if (!token) {
        reject(new Error("No token provided"));
      }
      jwt.verify(
        token,
        config.jwtSecret,
        function (err: any, decoded: any) {
          if (err) {
            reject(err);
          } else {
            if (scopes !== undefined) {
              for (let scope of scopes) {
                if (!decoded.scopes.includes(scope)) {
                  reject(new Error("JWT does not contain required scope."));
                }
              }
            }
            resolve(decoded);
          }
        }
      );
    });
  } else {
    throw new Error("Only support JWT securityName");
  }
}
