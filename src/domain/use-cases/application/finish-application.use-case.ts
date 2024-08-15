import { Injectable } from '@nestjs/common';
import { AnalisysApplicationService } from '../../../domain/services/analisys-application/analisys-application.service';

export interface FinishApplicationRequest {
  applicationId: bigint;
  userId: number;
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
