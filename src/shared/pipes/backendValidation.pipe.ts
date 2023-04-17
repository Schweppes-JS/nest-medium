import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';

export class BackendValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const object = plainToInstance(metadata.metatype, value);
    const errors = await validate(object);
    console.log(object, errors);
    // if (value instanceof HttpException) {
    //   throw value;
    // }
    if (errors.length === 0) return value;
    else
      throw new HttpException(
        { errors: this.formatErrors(errors) },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
  }

  formatErrors(errors: ValidationError[]) {
    return errors.reduce((acc, error) => {
      acc[error.property] = Object.values(error.constraints);
      return acc;
    }, {});
  }
}
