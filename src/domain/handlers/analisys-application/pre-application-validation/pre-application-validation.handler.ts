import { Injectable } from '@nestjs/common';
import { AbstractHandler } from '../../abstract.handler';

@Injectable()
export class PreApplicationValidationHandler extends AbstractHandler {
  public handle(request: any): any {
    return super.handle(request);
  }
}
