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
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { SchemaValidationPipe } from 'src/pipes/schema-validation.pipe';
import { CreateApplicationUseCase } from 'src/domain/use-cases/application/create-application.use-case';
import { UpdateApplicationUseCase } from 'src/domain/use-cases/application/update-application.use-case';
import { ApplicationRepository } from 'src/infra/prisma/repositories/application.repository';
import { ListApplicationUseCase } from 'src/domain/use-cases/application/list-application.use-case';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('applications')
@Controller('v1/applications')
@UseGuards(JwtAuthGuard)
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
  findAll(@Request() { user }, @Query() query: any) {
    return this.listApplication.execute({
      ...query,
      page: query.page ? parseInt(query.page) : undefined,
      pageSize: query.pageSize ? parseInt(query.pageSize) : undefined,
      organizationId: user.organizationId,
    });
  }

  @Get(':id')
  findOne(@Request() { user }, @Param('id') id: string) {
    return this.applicationRepository.findOne(user.organizationId, id);
  }

  @Patch(':id')
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
  remove(@Request() { user }, @Param('id') id: string) {
    return this.applicationRepository.remove(user.organizationId, id);
  }
}
