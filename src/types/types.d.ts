import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string; // Make it optional as not all requests will have this property
  }
}