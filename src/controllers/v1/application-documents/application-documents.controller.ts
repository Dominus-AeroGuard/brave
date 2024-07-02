import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { CreateApplicationDocumentUseCase } from '../../../domain/use-cases/application-document/create-application-document.use-case';
import { CreateApplicationDocumentRequest } from './models/create-application-document.model';
import { SchemaValidationPipe } from '../../../pipes/schema-validation.pipe';
import { JwtAuthGuard } from '../../../auth/auth.guard';
import { IApplicationDocumentRepository } from '../../../infra/prisma/repositories/application-document.repository';
import { UpdateApplicationDocumentRequest } from './models/update-application-document.model';

@ApiTags('documents')
@Controller('v1/applications/:applicationId/documents')
@UseGuards(JwtAuthGuard)
export class ApplicationDocumentsController {
  constructor(
    @Inject(CreateApplicationDocumentUseCase)
    private createApplicationDocument: CreateApplicationDocumentUseCase,
    @Inject('IApplicationDocumentRepository')
    private applicationDocumentRepository: IApplicationDocumentRepository,
  ) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  create(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 128,
        })
        .build(),
    )
    files: Array<Express.Multer.File>,
    @Param('applicationId') applicationId: string,
    @Body(new SchemaValidationPipe())
    applicationDocument: CreateApplicationDocumentRequest,
  ) {
    return this.createApplicationDocument.execute({
      typeId: Number(applicationDocument.typeId),
      applicationId: Number(applicationId),
      files,
    });
  }

  @Get()
  list(@Param('applicationId') applicationId: string) {
    return this.applicationDocumentRepository.findAll(applicationId);
  }

  @Get(':documentId')
  get(
    @Param('applicationId') applicationId: string,
    @Param('documentId') documentId: string,
  ) {
    return this.applicationDocumentRepository.findOne(
      Number(documentId),
      Number(applicationId),
    );
  }

  @Put(':documentId')
  update(
    @Body(new SchemaValidationPipe())
    applicationDocument: UpdateApplicationDocumentRequest,
    @Param('applicationId') applicationId: number,
    @Param('documentId') documentId: number,
  ) {
    return this.applicationDocumentRepository.update(
      Number(documentId),
      Number(applicationId),
      applicationDocument,
    );
  }

  @Delete(':documentId')
  @HttpCode(204)
  remove(
    @Param('applicationId') applicationId: number,
    @Param('documentId') documentId: number,
  ) {
    return this.applicationDocumentRepository.remove(
      Number(documentId),
      Number(applicationId),
    );
  }
}
