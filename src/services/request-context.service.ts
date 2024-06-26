import { Injectable, Scope } from '@nestjs/common';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
  private request: Request;

  setRequest(request: Request) {
    this.request = request;
  }

  getRequest(): Request {
    return this.request;
  }

  getUser() {
    return this.request?.['context']?.user;
  }
}
