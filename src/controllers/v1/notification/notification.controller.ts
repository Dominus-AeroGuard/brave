import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Query,
  Request,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorRequestDto } from '../../../controllers/dtos/error-request.dto';
import { PaginableEntity } from '../../../controllers/dtos/paginable.dto';
import { ValidationRequestDto } from '../../../controllers/dtos/validation-request.dto';
import { ApplicationNotification } from '../../../domain/entities/application-notification.entity';
import { ApplicationNotificationRepository } from '../../../resources/infra/prisma/repositories/application-notification.repository';
import { ListNotificationUseCase } from '../../../domain/use-cases/notification/list-notification.use-case';
import { UpdateNotificationRequest } from './models/update-notification.model';
import { ListNotificationRequest } from './models/list-notification.model';

@ApiTags('notifications')
@Controller('v1/notifications')
@ApiBadRequestResponse({ type: ValidationRequestDto })
@ApiInternalServerErrorResponse({ type: ErrorRequestDto })
export class NotificationController {
  constructor(
    @Inject('IApplicationNotificationRepository')
    private readonly notificationRepository: ApplicationNotificationRepository,
    @Inject(ListNotificationUseCase)
    private readonly listNotificationUseCase: ListNotificationUseCase,
  ) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'size', required: false, type: Number, example: 10 })
  @ApiOkResponse({
    schema: {
      type: 'object',
      $ref: '#/components/schemas/PaginableEntity',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/ApplicationNotification' },
        },
      },
    },
  })
  findAll(
    @Query() query: ListNotificationRequest,
  ): Promise<PaginableEntity<ApplicationNotification>> {
    return this.listNotificationUseCase.execute({
      query,
    });
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: BigInt, example: 1 })
  @ApiOkResponse({ type: ApplicationNotification })
  findOne(@Param('id') id: string) {
    return this.notificationRepository.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: BigInt, example: 1 })
  @ApiOkResponse({ type: ApplicationNotification })
  update(
    @Param('id') id: string,
    @Request() { user },
    @Body() body: UpdateNotificationRequest,
  ) {
    return this.notificationRepository.update(BigInt(id), {
      userId: user,
      statusId: body.status.id,
    });
  }
}
