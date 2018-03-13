/**
 * @typedef {function(string): ?Error} ValidatorFunction - Validates a string input
 */

/**
 * Create a validator function that determines the validity of a string input,
 * which can be supplied to the Validator() constructor.
 * @param {function(string): boolean} isValid - Determines the validity of the input
 * @param {string} [errorMsg="Input is invalid"] - Assigned to the returned error if the input is invalid
 * @returns {ValidatorFunction} The resulting validator function
 */
export function createValidatorFn(isValid, errorMsg = "Input is invalid") {
  // If isValid is not a function, throw an error
  try {
    isValid();
  } catch (e) {
    if (e instanceof TypeError)
      throw TypeError(`Invalid argument: ${isValid} is not a function.`);
    throw e;
  }

  return input => (isValid(input) ? null : Error(errorMsg));
}

/**
 * Validates a string input with a given set of validator functions
 */
class Validator {
  /**
   * Create a validator
   * @param {ValidatorFunction[]} [validators=[]]
   */
  constructor(validators = []) {
    this.validators = validators;
  }

  /**
   * Validate a string
   * @param {string} input
   * @returns {?Error}
   */
  validate(input) {
    for (let i = 0; i < this.validators.length; i++) {
      const v = this.validators[i];
      const error = v(input);
      if (error !== null) {
        return error;
      }
    }
    return null;
  }
}

export default Validator;
