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
import { JwtAuthGuard } from '../../../auth/auth.guard';
import { SchemaValidationPipe } from '../../../pipes/schema-validation.pipe';
import { CreateApplicationUseCase } from '../../../domain/use-cases/application/create-application.use-case';
import { UpdateApplicationUseCase } from '../../../domain/use-cases/application/update-application.use-case';
import { ApplicationRepository } from '../../../infra/prisma/repositories/application.repository';
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
import { Application } from '../../../domain/entities';
import { PaginableEntity } from '../../dtos/paginable.dto';
import { ValidationRequestDto } from '../../dtos/validation-request.dto';
import { ErrorRequestDto } from '../../dtos/error-request.dto';

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
    @Inject(ApplicationRepository)
    private readonly applicationRepository: ApplicationRepository,
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
}
