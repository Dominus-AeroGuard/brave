import { ApiProperty } from '@nestjs/swagger';
import { ApplicationAnalisysStatusEnum } from '../enums/application-analisys-status.enum';

export class ApplicationAnalisys {
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
    elapsedTime: number,
    typeName: string,
    status: number,
    createdAt: Date,
  ) {
    this.elapsedTime = elapsedTime;
    this.type.name = typeName;
    this.status = status;
    this.createdAt = createdAt;
  }
}
