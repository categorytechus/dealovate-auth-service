export const CustomError = (fieldName: string, errors: any) => {
  errors.forEach((err) => {
    switch (err.code) {
      case 'any.empty':
        err.message = `${fieldName} should not be empty!`;
        break;
      case 'string.min':
        err.message = `${fieldName} should have at least ${err.local.limit} characters!`;
        break;
      case 'string.max':
        err.message = `${fieldName} should have at most ${err.local.limit} characters!`;
        break;
      case 'string.pattern.base':
        err.message = `${fieldName} should have at least one uppercase letter, one lowercase letter, one digit, one special character and no space!`;
        break;
      default:
        break;
    }
  });
  return errors;
};
