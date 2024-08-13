import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { ApplicationAnalisys } from './application-analisys.entity';
import { ApplicationNotificationStatusEnum } from '../enums/application-notification-status.enum';

export class ApplicationNotificationStatus {
  @ApiProperty()
  id: ApplicationNotificationStatusEnum;

  @ApiProperty({ description: 'Descritivo do status' })
  description: string;

  constructor(id: number, description: string) {
    this.id = id;
    this.description = description;
  }
}

export class ApplicationNotification {
  @ApiProperty({ description: 'Fiscal responsável' })
  fiscal: User;

  @ApiProperty({ description: 'Aplicação que gerou a notificação' })
  application: Partial<{
    id: bigint;
  }>;

  @ApiProperty()
  status: ApplicationNotificationStatus;

  @ApiProperty({ description: 'Lista das analises realizadas na aplicação' })
  analisys: ApplicationAnalisys[];

  constructor(
    user: User,
    applicationId: bigint,
    status: ApplicationNotificationStatus,
    analisys: ApplicationAnalisys[],
  ) {
    this.fiscal = user;
    this.application.id = applicationId;
    this.status = status;
    this.analisys = analisys;
  }
}
