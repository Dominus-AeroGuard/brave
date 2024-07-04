import * as Prisma from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Organization } from './organization.entity';
import { Pilot } from './pilot.entity';
import { User } from './user.entity';
import { ApplicationStatus as ApplicationStatusEnum } from '../enums/application-status.enum';

class ApplicationStatus {
  @ApiProperty({ type: Number, enum: ApplicationStatusEnum })
  public id: number;

  @ApiProperty({
    description: 'Descrição do status da aplicação',
    enum: Object.values(ApplicationStatusEnum),
  })
  public description: string;

  constructor(status: Prisma.ApplicationStatus) {
    this.id = status.application_status_id;
    this.description = status.description;
  }
}

export class Application {
  @ApiProperty({ type: BigInt })
  id: string;

  @ApiProperty({
    description: 'Veículo utilizado na aplicação',
    example: 'brave',
  })
  vehicle: string;

  @ApiProperty({
    description: 'Data de início da aplicação',
    example: '2021-09-01T00:00:00.000Z',
  })
  startDate: Date;

  @ApiProperty({
    description: 'Data de fim da aplicação',
    example: '2021-09-01T00:00:00.000Z',
  })
  endDate: Date;

  @ApiProperty({ description: 'Usuário que criou a aplicação', example: '1' })
  createdBy: string;

  @ApiProperty({ description: 'Usuário que criou a aplicação' })
  user: User;

  @ApiProperty({ description: 'Organização que criou a aplicação' })
  organization: Organization;

  @ApiProperty({ description: 'Piloto que irá realizar a aplicação' })
  pilot: Pilot;

  @ApiProperty({ description: 'Status da aplicação' })
  status: ApplicationStatus;

  @ApiProperty({ description: 'Data de atualização da aplicação' })
  updatedAt: Date;

  @ApiProperty({ description: 'Data de criação da aplicação' })
  createdAt: Date;

  constructor(
    application: Prisma.Application,
    lastEvent: Prisma.ApplicationEvent,
    user: Prisma.User,
    organization: Prisma.Organization,
    pilot: Prisma.Pilot,
    status: Prisma.ApplicationStatus,
  ) {
    this.id = application.application_id.toString();
    this.vehicle = application.vehicle;
    this.startDate = application.start_date;
    this.endDate = application.end_date;
    this.user = new User(user);
    this.organization = new Organization(organization);
    this.pilot = new Pilot(pilot);
    this.status = new ApplicationStatus(status);
    this.createdBy = application.created_by;
    this.createdAt = application.created_at;
    this.updatedAt = lastEvent.created_at;
  }
}
