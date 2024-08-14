import { Logger } from '@nestjs/common';

export class AbstractHandler<T> implements Handler<T> {
  private nextHandler: Handler<T>;
  private readonly logger = new Logger(AbstractHandler.name);
  public request: T;

  public setNext(handler: Handler<T>): Handler<T> {
    this.nextHandler = handler;
    return handler;
  }

  setRequest(request: T) {
    this.request = request;
  }

  public handle() {
    this.logger.log(`Processing ${this.constructor.name}`, this.request);

    if (this.nextHandler) {
      return this.nextHandler.handle();
    }

    return null;
  }
}
