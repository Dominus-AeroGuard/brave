import { ApiProperty } from '@nestjs/swagger';
import { ApplicationAnalisysStatusEnum } from '../enums/application-analisys-status.enum';
import parseJson from '../../utils/parse-json.util';

export class AnalisysBufferDetail {
  @ApiProperty({ description: 'Identificador da area de proteção' })
  protectedAreaId: number;

  @ApiProperty({
    description: 'Medida em metros que a aplicação passou sobre a area',
  })
  meters: number;
}

export class AnalisysDetail implements Record<string, any> {}

export class ApplicationAnalisys {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ description: 'Tempo de processamento da analise' })
  elapsedTime: number;

  @ApiProperty({ description: 'Tipo da análise' })
  type: Partial<{
    name: string;
  }>;

  @ApiProperty({
    description: 'Detalhes da análise',
    oneOf: [
      {
        type: 'array',
        items: { $ref: '#/components/schemas/AnalisysBufferDetail' },
      },
      {
        type: 'object',
        items: { $ref: '#/components/schemas/AnalisysDetail' },
      },
    ],
  })
  details: AnalisysDetail | AnalisysBufferDetail[];

  @ApiProperty({ description: 'Status atual do processamento' })
  status: ApplicationAnalisysStatusEnum;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  constructor(
    id: number,
    elapsedTime: number,
    typeName: string,
    details: string,
    status: ApplicationAnalisysStatusEnum,
    createdAt: Date,
  ) {
    this.id = id;
    this.elapsedTime = elapsedTime;
    this.type = { name: typeName };
    this.details = parseJson(details);
    this.status = status;
    this.createdAt = createdAt;
  }
}
