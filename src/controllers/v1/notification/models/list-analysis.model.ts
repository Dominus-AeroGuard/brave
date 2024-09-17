import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApplicationAnalisysTypeEnum } from '../../../../domain/enums/application-analisys-type.enum';
import { ApplicationAnalisysStatusEnum } from '../../../../domain/enums/application-analisys-status.enum';

export class ListAnalysisRequest {
  @ApiProperty({ description: 'Status da notificação', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsArray()
  @IsEnum(ApplicationAnalisysStatusEnum, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  status?: ApplicationAnalisysStatusEnum[];

  @ApiProperty({ description: 'Status da notificação', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsArray()
  @IsEnum(ApplicationAnalisysTypeEnum, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  type?: ApplicationAnalisysTypeEnum[];

  @ApiProperty({ required: false, type: Number, example: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  page?: number = 1;

  @ApiProperty({ required: false, type: Number, example: 10 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  size?: number = 10;
}
