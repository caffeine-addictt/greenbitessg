import { httpCodes } from '../src/index';

// Predefine stuff
const SHOULD_BE_CODE = {
  100: true,
  102: true,
  103: false,
  200: true,
  203: true,
  209: false,
  226: true,
  300: true,
  301: true,
  309: false,
  400: true,
  419: false,
  420: false,
  500: true,
  508: true,
  509: false,
};

describe('Http Status Code checking', () => {
  describe('isStatusCode', () => {
    it('should return a boolean value matching the value in SHOULD_BE_CODE', () => {
      Object.entries(SHOULD_BE_CODE).forEach(([code, should_be_code]) => {
        expect(httpCodes.isStatusCode(Number(code))).toBe(should_be_code);
      });
    });
  });

  describe('isInformationalStatusCode', () => {
    it('should return true if the status code is in the range 100-199', () => {
      Object.entries(SHOULD_BE_CODE).forEach(([code, should_be_code]) => {
        const codeNum = Number(code);
        expect(httpCodes.isInformationalStatusCode(codeNum)).toBe(
          codeNum >= 100 && codeNum <= 199 ? should_be_code : false,
        );
      });
    });
  });

  describe('isSuccessfulStatusCode', () => {
    it('should return true if the status code is in the range 200-299', () => {
      Object.entries(SHOULD_BE_CODE).forEach(([code, should_be_code]) => {
        const codeNum = Number(code);
        expect(httpCodes.isSuccessfulStatusCode(codeNum)).toBe(
          codeNum >= 200 && codeNum <= 299 ? should_be_code : false,
        );
      });
    });
  });

  describe('isRedirectionStatusCode', () => {
    it('should return true if the status code is in the range 300-399', () => {
      Object.entries(SHOULD_BE_CODE).forEach(([code, should_be_code]) => {
        const codeNum = Number(code);
        expect(httpCodes.isRedirectionStatusCode(codeNum)).toBe(
          codeNum >= 300 && codeNum <= 399 ? should_be_code : false,
        );
      });
    });
  });

  describe('isClientErrorStatusCode', () => {
    it('should return true if the status code is in the range 400-499', () => {
      Object.entries(SHOULD_BE_CODE).forEach(([code, should_be_code]) => {
        const codeNum = Number(code);
        expect(httpCodes.isClientErrorStatusCode(codeNum)).toBe(
          codeNum >= 400 && codeNum <= 499 ? should_be_code : false,
        );
      });
    });
  });

  describe('isServerErrorStatusCode', () => {
    it('should return true if the status code is in the range 500-599', () => {
      Object.entries(SHOULD_BE_CODE).forEach(([code, should_be_code]) => {
        const codeNum = Number(code);
        expect(httpCodes.isServerErrorStatusCode(codeNum)).toBe(
          codeNum >= 500 && codeNum <= 599 ? should_be_code : false,
        );
      });
    });
  });

  describe('isOkStatusCode', () => {
    it('should return true if the status code is in the range 100-299', () => {
      Object.entries(SHOULD_BE_CODE).forEach(([code, should_be_code]) => {
        const codeNum = Number(code);
        expect(httpCodes.isOkStatusCode(codeNum)).toBe(
          codeNum >= 100 && codeNum <= 299 ? should_be_code : false,
        );
      });
    });
  });

  describe('isNonErrorCode', () => {
    it('should return true if the status code is not in the range 400-599', () => {
      Object.entries(SHOULD_BE_CODE).forEach(([code, should_be_code]) => {
        const codeNum = Number(code);
        expect(httpCodes.isNonErrorCode(codeNum)).toBe(
          codeNum < 400 || codeNum > 599 ? should_be_code : false,
        );
      });
    });
  });

  describe('isErrorCode', () => {
    it('should return true if the status code is in the range 400-599', () => {
      Object.entries(SHOULD_BE_CODE).forEach(([code, should_be_code]) => {
        const codeNum = Number(code);
        expect(httpCodes.isErrorCode(codeNum)).toBe(
          codeNum >= 400 && codeNum <= 599 ? should_be_code : false,
        );
      });
    });
  });
});
