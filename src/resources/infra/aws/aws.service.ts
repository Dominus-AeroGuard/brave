import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  ListBucketsCommand,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3';

@Injectable()
export class AwsService {
  private s3Instance: S3Client;
  constructor() {
    this.createInstanceS3();
  }

  private createInstanceS3(): void {
    this.s3Instance = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET,
      },
    });
  }

  async uploadFile(
    file: Buffer,
    bucket: string,
    key: string,
  ): Promise<PutObjectCommandOutput> {
    const params = {
      Bucket: bucket,
      Key: key,
      Body: file,
    };

    const command = new PutObjectCommand(params);

    try {
      const response = await this.s3Instance.send(command);
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async listBuckets() {
    const command = new ListBucketsCommand({});
    try {
      const response = await this.s3Instance.send(command);
      return response.Buckets;
    } catch (error) {
      console.error(error);
    }
  }

  buildPath(bucket: string, key: string): string {
    return `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }
}
