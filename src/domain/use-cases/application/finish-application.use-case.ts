import { Injectable } from '@nestjs/common';
import { AnalisysApplicationService } from 'src/domain/services/analisys-application/analisys-application.service';

export interface FinishApplicationRequest {
  applicationId: number;
}

@Injectable()
export class FinishApplicationUseCase {
  constructor(
    private readonly analisysApplicationService: AnalisysApplicationService,
  ) {}

  execute(data: FinishApplicationRequest) {
    this.analisysApplicationService.execute(data);
  }
}
