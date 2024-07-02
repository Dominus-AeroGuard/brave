import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

@Catch(
  PrismaClientRustPanicError,
  PrismaClientValidationError,
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientInitializationError,
)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.UNPROCESSABLE_ENTITY;
    let message = exception.meta?.cause || 'Erro interno do servidor';

    if (['P2002', 'P2003'].includes(exception.code)) {
      message = 'Um ou mais campos violam restrições de chave única';
    }

    if ([`P2025`].includes(exception.code)) {
      message = 'Registro não encontrado';
      status = HttpStatus.NOT_FOUND;
    }

    console.log('exception => ', exception);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
      message,
      detail: exception,
    });
  }
}
