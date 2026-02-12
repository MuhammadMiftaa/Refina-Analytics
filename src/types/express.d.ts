import { JwtPayload } from "../helper";

//$ Extend Express Request to include custom user property
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
