import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OcrService } from './ocr/ocr.service';

@Global()
@Module({
  providers: [OcrService],
  imports: [HttpModule],
  exports: [OcrService],
})
export class RestModule {}
