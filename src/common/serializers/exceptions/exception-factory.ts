import { BadRequestException, ValidationError } from '@nestjs/common'

export const exceptionFactory = (errors: ValidationError[]): BadRequestException => {
  return new BadRequestException({
    error: 'Bad Request',
    message: 'Validation error',
    errors: errors.map(({ target, ...err }) => err),
    statusCode: 400,
  })
}
