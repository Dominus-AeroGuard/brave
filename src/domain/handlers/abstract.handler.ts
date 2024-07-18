import { Logger } from '@nestjs/common';

export interface AnalisysApplicationContext {
  applicationId: number;
}

export class AbstractHandler implements Handler {
  private nextHandler: Handler;
  private readonly logger = new Logger(AbstractHandler.name);

  public setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }

  public handle<AnalisysApplicationContext>(
    request: AnalisysApplicationContext,
  ): AnalisysApplicationContext {
    this.logger.log(`Processing ${this.constructor.name}`, request);

    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }

    return null;
  }
}
