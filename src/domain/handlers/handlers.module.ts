import { Module } from '@nestjs/common';
import { WeatherHandler } from './analisys-application/weather/weather.handler';
import { BufferHandler } from './analisys-application/buffer/buffer.handler';
import { PrescriptionHandler } from './analisys-application/prescription/prescription.handler';
import { DocumentsValidationHandler } from './analisys-application/documents-validation/documents-validation.handler';
import { PreApplicationValidationHandler } from './analisys-application/pre-application-validation/pre-application-validation.handler';
import { GeolocationHandler } from './analisys-application/geolocation/geolocation.handler';
import { DeadlineValidationHandler } from './analisys-application/deadline-validation/deadline-validation.handler';

@Module({
  providers: [
    WeatherHandler,
    BufferHandler,
    PrescriptionHandler,
    DocumentsValidationHandler,
    PreApplicationValidationHandler,
    GeolocationHandler,
    DeadlineValidationHandler,
  ],
  exports: [
    WeatherHandler,
    BufferHandler,
    PrescriptionHandler,
    DocumentsValidationHandler,
    PreApplicationValidationHandler,
    GeolocationHandler,
    DeadlineValidationHandler,
  ],
})
export class HandlersModule {}
