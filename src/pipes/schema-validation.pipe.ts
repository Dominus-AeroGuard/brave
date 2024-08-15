/* eslint-disable @typescript-eslint/ban-types */
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ValidationError, validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class SchemaValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);

    const errors = await validate(object);

    if (errors.length > 0) {
      throw new BadRequestException({ errors: this.serializeErrors(errors) });
    }
    return object;
  }

  private serializeErrors(errors: ValidationError[]): any {
    const result = [];

    const serialize = (error: ValidationError, parentProperty?: string) => {
      const property = parentProperty
        ? `${parentProperty}.${error.property}`
        : error.property;

      if (error.constraints) {
        const validations = Object.values(error.constraints);
        result.push({ property, validations });
      }

      if (error.children && error.children.length > 0) {
        error.children.forEach((child) => serialize(child, property));
      }
    };

    errors.forEach((error) => serialize(error));

    return result;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
