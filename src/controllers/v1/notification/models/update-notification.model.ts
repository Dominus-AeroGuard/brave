import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApplicationNotificationStatusEnum } from '../../../../domain/enums/application-notification-status.enum';

export class UpdateNotificationStatus {
  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  @IsEnum(ApplicationNotificationStatusEnum)
  id: number;
}

export class UpdateNotificationRequest {
  @ApiProperty()
  @ValidateNested()
  @Type(() => UpdateNotificationStatus)
  status: UpdateNotificationStatus;
}
