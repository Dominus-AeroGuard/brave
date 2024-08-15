import { Injectable } from '@nestjs/common';
import { AbstractHandler } from '../../abstract.handler';
import { AnalisysApplicationContext } from '../analisys-application.context';

@Injectable()
export class BufferHandler extends AbstractHandler<AnalisysApplicationContext> {
  public handle(context: AnalisysApplicationContext) {
    return super.handle(context);
  }
}
