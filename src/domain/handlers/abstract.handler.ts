import { Logger } from '@nestjs/common';

export class AbstractHandler<T> implements Handler<T> {
  private nextHandler: Handler<T>;
  private readonly _logger = new Logger(AbstractHandler.name);

  public setNext(handler: Handler<T>): Handler<T> {
    this.nextHandler = handler;
    return handler;
  }

  public handle(context: T) {
    this._logger.log(`Processing ${this.constructor.name}`, context);

    if (this.nextHandler) {
      return this.nextHandler.handle(context);
    }

    return null;
  }
}
