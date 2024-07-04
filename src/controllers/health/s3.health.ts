import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { AwsService } from '../../infra/aws/aws.service';

@Injectable()
export class S3HealthIndicator extends HealthIndicator {
  constructor(private awsService: AwsService) {
    super();
  }

  async isBucketsUp(): Promise<HealthIndicatorResult> {
    try {
      const buckets = await this.awsService.listBuckets();
      const isHealthy = buckets.length > 0;

      const result = this.getStatus('s3', isHealthy, {
        buckets: buckets,
      });

      if (!isHealthy) throw new Error('No buckets found');

      return result;
    } catch (error) {
      const result = this.getStatus('s3', false, {
        error: error.message,
        buckets: [],
      });
      throw new HealthCheckError('S3 check failed', result);
    }
  }
}
