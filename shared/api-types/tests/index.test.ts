import * as index from '../src/index';

// Predefine stuff
type apiResponses = {
  expect: 'success' | 'error' | 'invalid';
  payload: unknown;
};
const apiResponses: apiResponses[] = [
  {
    expect: 'success',
    payload: {
      status: 200,
      data: 'hihi',
    } satisfies index.SuccessResponse<string>,
  },
  {
    expect: 'error',
    payload: {
      status: 400,
      errors: [{ message: 'oh no' }],
    } satisfies index.ErrorResponse,
  },
  {
    expect: 'invalid',
    payload: {},
  },
  {
    expect: 'invalid',
    payload: 'hi',
  },
];

describe('API Response checking', () => {
  describe('isAPIResponse', () => {
    it('should return true if the given value is an API response', () => {
      apiResponses.map((a) => {
        expect(index.isAPIResponse(a.payload)).toBe(
          ['error', 'success'].includes(a.expect),
        );
      });
    });
  });

  describe('isSuccessResponse', () => {
    it('should return true if the given value is a success response', () => {
      apiResponses.map((a) => {
        expect(index.isSuccessResponse(a.payload)).toBe(a.expect === 'success');
      });
    });
  });

  describe('isErrorResponse', () => {
    it('should return true if the given value is an error response', () => {
      apiResponses.map((a) => {
        expect(index.isErrorResponse(a.payload)).toBe(a.expect === 'error');
      });
    });
  });
});
