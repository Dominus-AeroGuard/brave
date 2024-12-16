import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Inject,
  Query,
} from '@nestjs/common';
import { CreateApplicationRequest } from './models/create-application.model';
import { UpdateApplicationRequest } from './models/update-application.model';
import { JwtAuthGuard } from '../../../resources/auth/auth.guard';
import { SchemaValidationPipe } from '../../../resources/pipes/schema-validation.pipe';
import { CreateApplicationUseCase } from '../../../domain/use-cases/application/create-application.use-case';
import { UpdateApplicationUseCase } from '../../../domain/use-cases/application/update-application.use-case';
import { ApplicationRepository } from '../../../resources/infra/prisma/repositories/application.repository';
import { ListApplicationUseCase } from '../../../domain/use-cases/application/list-application.use-case';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Application, ProtectedArea } from '../../../domain/entities';
import { PaginableEntity } from '../../dtos/paginable.dto';
import { ValidationRequestDto } from '../../dtos/validation-request.dto';
import { ErrorRequestDto } from '../../dtos/error-request.dto';
import { FinishApplicationUseCase } from '../../../domain/use-cases/application/finish-application.use-case';
import { FindByDistanceProtectedAreaUseCase } from '../../../domain/use-cases/protected-area/find-by-distance-protected-area.use-case';

@ApiTags('applications')
@Controller('v1/applications')
@UseGuards(JwtAuthGuard)
@ApiBadRequestResponse({ type: ValidationRequestDto })
@ApiInternalServerErrorResponse({ type: ErrorRequestDto })
export class ApplicationController {
  constructor(
    @Inject(CreateApplicationUseCase)
    private readonly createApplication: CreateApplicationUseCase,
    @Inject(UpdateApplicationUseCase)
    private readonly updateApplication: UpdateApplicationUseCase,
    @Inject(ListApplicationUseCase)
    private readonly listApplication: ListApplicationUseCase,
    @Inject(FinishApplicationUseCase)
    private readonly finishApplicationUseCase: FinishApplicationUseCase,
    @Inject(ApplicationRepository)
    private readonly applicationRepository: ApplicationRepository,
    @Inject(FindByDistanceProtectedAreaUseCase)
    private readonly findByDistanceProtectedArea: FindByDistanceProtectedAreaUseCase,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: Application })
  @ApiUnprocessableEntityResponse({ type: ErrorRequestDto })
  create(
    @Request() req,
    @Body(new SchemaValidationPipe()) application: CreateApplicationRequest,
  ) {
    return this.createApplication.execute({
      ...application,
      organization: { id: req.user.organizationId },
      user: { id: req.user.userId },
    });
  }

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
          items: { $ref: '#/components/schemas/Application' },
        },
      },
    },
  })
  findAll(
    @Request() { user },
    @Query() query: any,
  ): Promise<PaginableEntity<Application>> {
    return this.listApplication.execute({
      ...query,
      page: query.page ? parseInt(query.page) : undefined,
      pageSize: query.pageSize ? parseInt(query.pageSize) : undefined,
      organizationId: user.organizationId,
    });
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: BigInt, example: 1 })
  @ApiOkResponse({ type: Application })
  findOne(@Request() { user }, @Param('id') id: string) {
    return this.applicationRepository.findOne(user.organizationId, id);
  }

  @Get(':id/protected-areas')
  @ApiParam({ name: 'id', type: BigInt })
  @ApiQuery({ name: 'distance', required: true, type: Number })
  @ApiQuery({ name: 'typeId', required: true, type: Number })
  @ApiOkResponse({ type: [ProtectedArea] })
  findByDistance(@Query() query: any, @Param('id') applicationId: string) {
    return this.findByDistanceProtectedArea.execute({
      applicationId: Number(applicationId),
      distance: Number(query.distance),
      typeId: Number(query.typeId),
    });
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: BigInt, example: 1 })
  @ApiOkResponse({ type: Application })
  update(
    @Param('id') id: string,
    @Request() { user },
    @Body() updateApplication: UpdateApplicationRequest,
  ) {
    return this.updateApplication.execute({
      ...updateApplication,
      id,
      organization: { id: user.organizationId },
      user: { id: user.userId },
    });
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: BigInt, example: 1 })
  @ApiNoContentResponse()
  remove(@Request() { user }, @Param('id') id: string) {
    return this.applicationRepository.remove(user.organizationId, id);
  }

  @Post(':id/finish')
  @ApiParam({ name: 'id', type: BigInt, example: 1 })
  finish(@Request() { user }, @Param('id') id: string) {
    return this.finishApplicationUseCase.execute({
      userId: user,
      applicationId: BigInt(id),
    });
  }
}
