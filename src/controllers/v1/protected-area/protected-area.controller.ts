import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Inject,
  Query,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../resources/auth/auth.guard';
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
import { CreateProtectedAreaUseCase } from '../../../domain/use-cases/protected-area/create-protected-area.use-case';
import { CreateProtectedAreaRequest } from './models/create-protected-area.model';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ProtectedArea } from '../../../domain/entities';
import { ProtectedAreaRepository } from '../../../resources/infra/prisma/repositories/protected-area.repository';

@ApiTags('protected-areas')
@Controller('v1/protected-areas')
@UseGuards(JwtAuthGuard)
@ApiBadRequestResponse({ type: ValidationRequestDto })
@ApiInternalServerErrorResponse({ type: ErrorRequestDto })
export class ProtectedAreaController {
  constructor(
    @Inject(CreateProtectedAreaUseCase)
    private readonly createProtectedArea: CreateProtectedAreaUseCase,
    @Inject(ProtectedAreaRepository)
    private readonly protectedAreaRepository: ProtectedAreaRepository,
  ) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  @ApiBody({ type: CreateProtectedAreaRequest })
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
    @Body(new SchemaValidationPipe()) body: CreateProtectedAreaRequest,
  ) {
    return this.createProtectedArea.execute({
      description: body.description,
      file: files[0],
      typeId: Number(body.typeId),
      organizationId: req.user.organizationId,
      userId: req.user.userId,
    });
  }

  @Get()
  @ApiQuery({ name: 'typeId', required: false, type: Number, example: 1 })
  @ApiOkResponse({ type: [ProtectedArea] })
  findAll(@Request() { user }, @Query() query: any) {
    return this.protectedAreaRepository.findAll(
      user.organizationId,
      query.typeId ? parseInt(query.typeId) : undefined,
    );
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiNoContentResponse()
  remove(@Request() { user }, @Param('id') id: number) {
    return this.protectedAreaRepository.removeOne(user.organizationId, +id);
  }

  @Delete('/type/:id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiNoContentResponse()
  removeAll(@Request() { user }, @Param('id') id: number) {
    return this.protectedAreaRepository.removeAll(user.organizationId, +id);
  }
}
