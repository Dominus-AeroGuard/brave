import {
  Controller,
  Get,
  Inject,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../auth/auth.guard';
import { ErrorRequestDto } from '../../../../controllers/dtos/error-request.dto';
import { ValidationRequestDto } from '../../../../controllers/dtos/validation-request.dto';
import { AnalysisBuffer } from '../../../../domain/entities/analysis-buffer.entity';
import { NotificationBufferUseCase } from '../../../../domain/use-cases/notification/notification-buffer.use-case';
import { ApplicationAnalisysRepository } from '../../../../infra/prisma/repositories/application-analisys.repository';
import { ListAnalysisRequest } from '../models/list-analysis.model';
import { PaginableEntity } from '../../../../controllers/dtos/paginable.dto';
import { ApplicationAnalisys } from '../../../../domain/entities/application-analisys.entity';

@ApiTags('notifications')
@Controller('v1/notifications/:notificationId/analysis')
@UseGuards(JwtAuthGuard)
@ApiBadRequestResponse({ type: ValidationRequestDto })
@ApiInternalServerErrorResponse({ type: ErrorRequestDto })
export class AnalysisController {
  constructor(
    @Inject('IApplicationAnalisysRepository')
    private readonly analysisRepository: ApplicationAnalisysRepository,
    @Inject(NotificationBufferUseCase)
    private readonly notificationBufferUseCase: NotificationBufferUseCase,
  ) {}

  @Get()
  @ApiParam({ name: 'notificationId', type: BigInt, example: 1 })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'size', required: false, type: Number, example: 10 })
  @ApiOkResponse({
    schema: {
      type: 'object',
      $ref: '#/components/schemas/PaginableEntity',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/ApplicationAnalisys' },
        },
      },
    },
  })
  async findAll(
    @Param('notificationId') notificationId: string,
    @Query() query: ListAnalysisRequest,
  ): Promise<PaginableEntity<ApplicationAnalisys>> {
    const result = await this.analysisRepository.findAll({
      notification_id: BigInt(notificationId),
      status: query.status,
      typeId: query.type,
      page: query.page,
      pageSize: query.size,
    });

    return new PaginableEntity<ApplicationAnalisys>(result, {
      page: query.page,
      size: query.size,
    });
  }

  @Get('/:analysisId')
  @ApiParam({ name: 'analysisId', type: BigInt, example: 1 })
  @ApiOkResponse({ type: ApplicationAnalisys })
  analysisDetail(@Param('analysisId') id: string) {
    return this.analysisRepository.findOne(Number(id));
  }

  @Get(':analysisId/buffer')
  @ApiOkResponse({ type: AnalysisBuffer })
  findAnalisyBuffer(
    @Param('notificationId') id: string,
    @Param('analysisId') analysisId: string,
  ) {
    return this.notificationBufferUseCase.execute(
      BigInt(id),
      Number(analysisId),
    );
  }
}
