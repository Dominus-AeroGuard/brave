import { Injectable } from '@nestjs/common';
import { AnalisysApplicationContext } from 'src/domain/handlers/abstract.handler';
import { BufferHandler } from 'src/domain/handlers/analisys-application/buffer/buffer.handler';
import { DeadlineValidationHandler } from 'src/domain/handlers/analisys-application/deadline-validation/deadline-validation.handler';
import { DocumentsValidationHandler } from 'src/domain/handlers/analisys-application/documents-validation/documents-validation.handler';
import { GeolocationHandler } from 'src/domain/handlers/analisys-application/geolocation/geolocation.handler';
import { PreApplicationValidationHandler } from 'src/domain/handlers/analisys-application/pre-application-validation/pre-application-validation.handler';
import { PrescriptionHandler } from 'src/domain/handlers/analisys-application/prescription/prescription.handler';
import { WeatherHandler } from 'src/domain/handlers/analisys-application/weather/weather.handler';

@Injectable()
export class AnalisysApplicationService {
  private readonly chain: Handler;

  constructor(
    private readonly weatherHandler: WeatherHandler,
    private readonly bufferHandler: BufferHandler,
    private readonly prescriptionHandler: PrescriptionHandler,
    private readonly documentsValidationHandler: DocumentsValidationHandler,
    private readonly preApplicationValidationHandler: PreApplicationValidationHandler,
    private readonly deadlineValidationHandler: DeadlineValidationHandler,
    private readonly geolocationHandler: GeolocationHandler,
  ) {
    weatherHandler
      .setNext(bufferHandler)
      .setNext(prescriptionHandler)
      .setNext(documentsValidationHandler)
      .setNext(preApplicationValidationHandler)
      .setNext(deadlineValidationHandler)
      .setNext(geolocationHandler);

    this.chain = weatherHandler;
  }

  public execute(data: AnalisysApplicationContext) {
    this.chain.handle(data);
  }
}
