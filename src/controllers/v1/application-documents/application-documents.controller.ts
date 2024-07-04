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
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateApplicationDocumentUseCase } from '../../../domain/use-cases/application-document/create-application-document.use-case';
import { CreateApplicationDocumentRequest } from './models/create-application-document.model';
import { SchemaValidationPipe } from '../../../pipes/schema-validation.pipe';
import { JwtAuthGuard } from '../../../auth/auth.guard';
import { IApplicationDocumentRepository } from '../../../infra/prisma/repositories/application-document.repository';
import { UpdateApplicationDocumentRequest } from './models/update-application-document.model';
import { ErrorRequestDto } from '../../dtos/error-request.dto';
import { ValidationRequestDto } from '../../dtos/validation-request.dto';
import { ApplicationDocument } from '../../../domain/entities/application-document.entity';

@ApiTags('documents')
@Controller('v1/applications/:applicationId/documents')
@ApiParam({ name: 'applicationId', type: BigInt })
@ApiBadRequestResponse({ type: ValidationRequestDto })
@ApiInternalServerErrorResponse({ type: ErrorRequestDto })
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
  @ApiBody({ type: CreateApplicationDocumentRequest })
  @ApiCreatedResponse({ type: [ApplicationDocument] })
  @ApiConsumes('multipart/form-data')
  create(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 1024,
        })
        .build(),
      new SchemaValidationPipe(),
    )
    files: Array<Express.Multer.File>,
    @Param('applicationId') applicationId: string,
    @Body(new SchemaValidationPipe())
    body: CreateApplicationDocumentRequest,
  ) {
    const filesList = files.map((file, index) => ({
      file,
      typeId: Number(body.files[index].typeId),
    }));

    return this.createApplicationDocument.execute({
      applicationId: Number(applicationId),
      files: filesList,
    });
  }

  @Get()
  @ApiOkResponse({ type: [ApplicationDocument] })
  list(@Param('applicationId') applicationId: string) {
    return this.applicationDocumentRepository.findAll(applicationId);
  }

  @Get(':documentId')
  @ApiParam({ name: 'documentId', type: 'number' })
  @ApiOkResponse({ type: ApplicationDocument })
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
  @ApiOkResponse({ type: ApplicationDocument })
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
  @ApiParam({ name: 'documentId', type: 'number' })
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
