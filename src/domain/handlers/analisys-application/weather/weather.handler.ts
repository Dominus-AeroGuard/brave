import { Injectable } from '@nestjs/common';
import { AbstractHandler } from '../../abstract.handler';

@Injectable()
export class WeatherHandler extends AbstractHandler {
  public ahndle(request: any): any {
    return super.handle(request);
  }
}
