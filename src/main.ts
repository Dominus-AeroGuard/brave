import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaExceptionFilter } from './filters/prisma-exception/prisma-exception.filter';
import { Meta, PaginableEntity } from './controllers/dtos/paginable.dto';
import {
  AnalisysBufferDetail,
  AnalisysDetail,
} from './domain/entities/application-analisys.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('AeroGuard API')
    .setDescription('')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [Meta, PaginableEntity, AnalisysDetail, AnalisysBufferDetail],
  });
  SwaggerModule.setup('api', app, document);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalFilters(new PrismaExceptionFilter());

  await app.listen(3000);
}
bootstrap();
