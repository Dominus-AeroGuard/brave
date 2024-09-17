import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { ApplicationAnalisys } from './application-analisys.entity';
import { ApplicationNotificationStatusEnum } from '../enums/application-notification-status.enum';
import {
  AlertLevelEnum,
  AlertLevelEnumDescription,
} from '../enums/alert-level.enum';

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

export class ApplicationNotificationAlertLevel {
  @ApiProperty({
    description: 'Nível de alerta para priorização da notificação',
    example: AlertLevelEnum.GRAVE,
  })
  level: AlertLevelEnum;

  @ApiProperty()
  description: string;
}

export class ApplicationNotification {
  @ApiProperty()
  id: string;

  @ApiProperty({ description: 'Fiscal responsável' })
  fiscal: User;

  @ApiProperty({ description: 'Aplicação que gerou a notificação' })
  application: Partial<{
    id: string;
  }>;

  @ApiProperty()
  status: ApplicationNotificationStatus;

  @ApiProperty()
  alertLevel: ApplicationNotificationAlertLevel;

  @ApiProperty({
    description: 'Lista das analises realizadas na aplicação',
    type: [ApplicationAnalisys],
  })
  analisys: Array<ApplicationAnalisys>;

  constructor(
    id: bigint,
    user: User,
    applicationId: bigint,
    status: ApplicationNotificationStatus,
    alertLevel: string,
    analisys: ApplicationAnalisys[],
  ) {
    this.id = id.toString();
    this.fiscal = user;
    this.application = { id: applicationId.toString() };
    this.alertLevel = {
      level: alertLevel as AlertLevelEnum,
      description: AlertLevelEnumDescription[alertLevel],
    };
    this.status = status;
    this.analisys = analisys;
  }
}
