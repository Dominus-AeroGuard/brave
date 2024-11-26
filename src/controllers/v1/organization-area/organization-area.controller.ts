import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  Inject,
  Query,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { SchemaValidationPipe } from '../../../resources/pipes/schema-validation.pipe';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ValidationRequestDto } from '../../dtos/validation-request.dto';
import { ErrorRequestDto } from '../../dtos/error-request.dto';
import { CreateOrganizationAreaRequest } from './models/create-organization-area.model';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { OrganizationArea } from '../../../domain/entities';
import { CreateOrganizationAreaUseCase } from '../../../domain/use-cases/organization-area/create-organization-area.use-case';
import { OrganizationAreaRepository } from '../../../resources/infra/prisma/repositories/organization-area.repository';

@ApiTags('organization-areas')
@Controller('v1/organization-areas')
@ApiBadRequestResponse({ type: ValidationRequestDto })
@ApiInternalServerErrorResponse({ type: ErrorRequestDto })
export class OrganizationAreaController {
  constructor(
    @Inject(CreateOrganizationAreaUseCase)
    private readonly createOrganizationArea: CreateOrganizationAreaUseCase,
    @Inject(OrganizationAreaRepository)
    private readonly organizationAreaRepository: OrganizationAreaRepository,
  ) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  @ApiBody({ type: CreateOrganizationAreaRequest })
  @ApiConsumes('multipart/form-data')
  create(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 102400000,
        })
        .build(),
      new SchemaValidationPipe(),
    )
    files: Array<Express.Multer.File>,
    @Request() req,
    @Body(new SchemaValidationPipe()) body: CreateOrganizationAreaRequest,
  ) {
    return this.createOrganizationArea.execute({
      file: files[0],
      organizationId: req.user.organizationId,
      userId: req.user.userId,
    });
  }

  @Get()
  @ApiOkResponse({ type: [OrganizationArea] })
  findAll(@Request() { user }) {
    return this.organizationAreaRepository.findAll(
      user.organizationId,
    );
  }

  @Get('/geojson')
  findAllGeojson(@Request() { user }) {
    return this.organizationAreaRepository.getAsGeoJson(
      user.organizationId,
    );
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiNoContentResponse()
  remove(@Request() { user }, @Param('id') id: number) {
    return this.organizationAreaRepository.removeOne(user.organizationId, +id);
  }

  @Delete()
  @ApiNoContentResponse()
  removeAll(@Request() { user }) {
    return this.organizationAreaRepository.removeAll(user.organizationId);
  }
}
