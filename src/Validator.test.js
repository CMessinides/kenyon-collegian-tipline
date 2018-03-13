import Validator, { createValidatorFn } from "./Validator";

describe("createValidatorFn()", () => {
  it("should require a function", () => {
    expect(createValidatorFn).toThrow(TypeError);
  });

  it("should return a function", () => {
    const mockFn = jest.fn();
    const actual = createValidatorFn(mockFn);

    expect(actual).toEqual(expect.any(Function));
  });

  describe("returned function", () => {
    it("should call the given function", () => {
      const mockFn = jest.fn();
      createValidatorFn(mockFn)();

      expect(mockFn).toHaveBeenCalled();
    });

    it("should return null if the input is valid", () => {
      const mockFn = jest.fn();
      mockFn.mockReturnValue(true);
      const actual = createValidatorFn(mockFn)();

      expect(actual).toBe(null);
    });

    it("should return an error if the input is invalid", () => {
      const mockFn = jest.fn();
      mockFn.mockReturnValue(false);
      const msg = "Error message";
      const actual = createValidatorFn(mockFn, msg)();

      expect(actual).toBeInstanceOf(Error);
      expect(actual.message).toBe(msg);
    });
  });
});

describe("Validator", () => {
  describe("validate()", () => {
    describe("given valid input", () => {
      const mockFns = [jest.fn(), jest.fn()];
      mockFns.forEach(fn => fn.mockReturnValue(null));
      const v = new Validator(mockFns);
      const input = "input";

      it("should return null", () => {
        const expected = null;
        const actual = v.validate(input);

        expect(actual).toBe(expected);
      });

      it("should call all validator functions", () => {
        v.validate(input);

        mockFns.forEach(fn => {
          expect(fn).toHaveBeenCalledWith(input);
        });
      });
    });

    describe("given invalid input", () => {
      const mockFns = [jest.fn(), jest.fn()];
      const error = Error("input is invalid");
      mockFns[0].mockReturnValue(error);
      const v = new Validator(mockFns);
      const input = "input";

      it("should return the first error encountered", () => {
        const expected = error;
        const actual = v.validate(input);

        expect(actual).toBe(expected);
      });

      it('should short circuit after the first error', () => {
        v.validate(input);

        expect(mockFns[0]).toHaveBeenCalledWith("input");
        expect(mockFns[1]).not.toHaveBeenCalled();
      });
    });
  });
});
