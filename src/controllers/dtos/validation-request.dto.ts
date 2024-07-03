import { ApiProperty } from '@nestjs/swagger';

export class ValidationError {
  @ApiProperty()
  property: string;

  @ApiProperty({ type: [String] })
  validations: string[];
}

export class ValidationRequestDto {
  @ApiProperty({ type: [ValidationError] })
  errors: ValidationError[];
}
