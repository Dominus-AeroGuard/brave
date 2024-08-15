import { ApiProperty } from '@nestjs/swagger';
import { ApplicationAnalisysStatusEnum } from '../enums/application-analisys-status.enum';

export class ApplicationAnalisys {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ description: 'Tempo de processamento da analise' })
  elapsedTime: number;

  @ApiProperty({ description: 'Tipo da análise' })
  type: Partial<{
    name: string;
  }>;

  @ApiProperty({ description: 'Status atual do processamento' })
  status: ApplicationAnalisysStatusEnum;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  constructor(
    id: number,
    elapsedTime: number,
    typeName: string,
    status: ApplicationAnalisysStatusEnum,
    createdAt: Date,
  ) {
    this.id = id;
    this.elapsedTime = elapsedTime;
    this.type = { name: typeName };
    this.status = status;
    this.createdAt = createdAt;
  }
}
