import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ErrorRequestDto {
  @ApiProperty({
    enum: HttpStatus,
    description: 'HTTP status code',
    example: 500,
  })
  statusCode: HttpStatus;

  @ApiProperty({
    description: 'Timestamp of the error',
    example: '2021-09-22T14:33:00.000',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Path of the request that caused the error',
    example: '/applications',
  })
  path: string;

  @ApiProperty({
    description: 'Error message',
    example: 'Internal server error',
  })
  message: string;

  @ApiProperty({
    description: 'Error details',
  })
  detail: object | string;
}
