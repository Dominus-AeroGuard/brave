import { Injectable } from '@nestjs/common';
import { AnalisysApplicationContext } from '../../../domain/handlers/analisys-application/analisys-application.context';
import { BufferHandler } from '../../../domain/handlers/analisys-application/buffer/buffer.handler';
import { DeadlineValidationHandler } from '../../../domain/handlers/analisys-application/deadline-validation/deadline-validation.handler';
import { DocumentsValidationHandler } from '../../../domain/handlers/analisys-application/documents-validation/documents-validation.handler';
import { GeolocationHandler } from '../../../domain/handlers/analisys-application/geolocation/geolocation.handler';
import { PreApplicationValidationHandler } from '../../../domain/handlers/analisys-application/pre-application-validation/pre-application-validation.handler';
import { PrescriptionHandler } from '../../../domain/handlers/analisys-application/prescription/prescription.handler';
import { SendNotificationHandler } from '../../../domain/handlers/analisys-application/send-notification/send-notification.handler';
import { WeatherHandler } from '../../../domain/handlers/analisys-application/weather/weather.handler';

@Injectable()
export class AnalisysApplicationService {
  private readonly chain: Handler<AnalisysApplicationContext>;

  constructor(
    private readonly weatherHandler: WeatherHandler,
    private readonly bufferHandler: BufferHandler,
    private readonly prescriptionHandler: PrescriptionHandler,
    private readonly documentsValidationHandler: DocumentsValidationHandler,
    private readonly preApplicationValidationHandler: PreApplicationValidationHandler,
    private readonly deadlineValidationHandler: DeadlineValidationHandler,
    private readonly geolocationHandler: GeolocationHandler,
    private readonly sendNotification: SendNotificationHandler,
  ) {
    weatherHandler
      .setNext(bufferHandler)
      .setNext(prescriptionHandler)
      .setNext(documentsValidationHandler)
      .setNext(preApplicationValidationHandler)
      .setNext(deadlineValidationHandler)
      .setNext(geolocationHandler)
      .setNext(sendNotification);

    this.chain = weatherHandler;
  }

  public execute(data: AnalisysApplicationContext) {
    this.chain.handle(data);
  }
}
