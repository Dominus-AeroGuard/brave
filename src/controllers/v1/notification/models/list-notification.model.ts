import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsInt, IsOptional } from 'class-validator';
import { ApplicationNotificationStatusEnum } from '../../../../domain/enums/application-notification-status.enum';
import { Transform, Type } from 'class-transformer';

export class ListNotificationRequest {
  @ApiProperty({
    type: BigInt,
    description: 'Id da aplicação',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @Type(() => BigInt)
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  applicationId?: bigint[];

  @ApiProperty({ description: 'Status da notificação', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsArray()
  @IsEnum(ApplicationNotificationStatusEnum, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  statusId?: number[];

  @ApiProperty({
    description: 'Fiscal atribuído a notificação',
    required: false,
  })
  @Type(() => Number)
  @IsInt({ each: true })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  fiscalId?: number[];

  @ApiProperty({ required: false, type: Number, example: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  page?: number = 1;

  @ApiProperty({ required: false, type: Number, example: 10 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  size?: number = 10;
}
