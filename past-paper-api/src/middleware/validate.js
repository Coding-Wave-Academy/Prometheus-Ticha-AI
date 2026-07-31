import { errorResponse } from '../utils/response.js';

export function validate(schema, source = 'query') {
  return (req, res, next) => {
    const dataToValidate = req[source];
    const result = schema.safeParse(dataToValidate);

    if (!result.success) {
      const formattedErrors = result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return errorResponse(
        res,
        'Validation error',
        400,
        'VALIDATION_ERROR',
        formattedErrors
      );
    }

    req[`validated_${source}`] = result.data;
    next();
  };
}
