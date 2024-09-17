import { Module } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { OcrService } from './ocr/ocr.service';

@Module({
  providers: [OcrService],
  imports: [HttpService],
})
export class HttpModule {}
