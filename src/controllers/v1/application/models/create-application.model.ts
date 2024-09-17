import {
  IsISO8601,
  IsInt,
  IsNotEmpty,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DateTime } from 'luxon';
import {
  IsDateLessThan,
  MinDateCustom,
} from '../../../../resources/utils/validators/class-validator.validators';
import { Type } from 'class-transformer';

export class CreateApplicationPilot {
  @ApiProperty({
    example: 1,
    description: 'Piloto que irá realizar a aplicação',
  })
  @IsNotEmpty()
  @IsInt()
  id: number;
}

export class CreateApplicationRequest {
  @ApiProperty({
    example: 'brave',
    description: 'Nome do veículo que será utilizado na aplicação',
  })
  @IsNotEmpty()
  @MinLength(3)
  vehicle: string;

  @ApiProperty({
    example: DateTime.now().plus({ hour: 2 }).toISO(),
    description: 'Data de inicio da aplicação',
    type: 'date-time',
  })
  @IsISO8601({ strict: true, strictSeparator: true })
  @MinDateCustom(DateTime.now().plus({ hour: 2 }).toISO(), {
    message: 'startDate must be at least 2 hours from now',
  })
  startDate: string;

  @ApiProperty({
    example: DateTime.now().plus({ hour: 3 }).toISO(),
    description: 'Data de fim da aplicação',
    type: 'date-time',
  })
  @IsISO8601()
  @IsDateLessThan('startDate', {
    message: 'endDate must be at least 1 hours from startDate',
  })
  endDate: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CreateApplicationPilot)
  pilot: CreateApplicationPilot;
}
