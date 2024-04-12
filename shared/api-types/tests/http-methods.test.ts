import { httpMethods } from '../src/index';

// Predefine stuff
const EXPECT = {
  GET: true,
  HEAD: true,
  OPTIONS: true,
  POST: true,
  PUT: true,
  DELETE: true,
  PATCH: true,
  CONNECT: true,
  TRACE: true,
  Ddddd: false,
  Eeeee: false,
  Fffff: false,
  sgeruiqw3: false,
};

describe('Http Method Checking', () => {
  describe('isHttpMethod', () => {
    it('should return true if the method is a http method', () => {
      Object.entries(EXPECT).forEach(([method, expected]) => {
        expect(httpMethods.isHttpMethod(method)).toBe(expected);
      });
    });
  });
});
