import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { FormData } from 'formdata-node';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { OcrResponse } from './responses/ocr.dto';

@Injectable()
export class OcrService {
  private readonly logger = new Logger(OcrService.name);
  private baseUrl: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('APIS_OCR_BASE_URL');
  }
  async extractDocumentData({
    file,
    type,
  }: Partial<{
    file: Express.Multer.File;
    type: string;
  }>): Promise<OcrResponse> {
    const formData = new FormData();
    const blob = new Blob([file.buffer], { type: file.mimetype });
    formData.append('file', blob);
    formData.append('type', type);

    const { data } = await firstValueFrom(
      this.httpService
        .post<OcrResponse>(`${this.baseUrl}/mapaAPIOCR`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response);
            throw error;
          }),
        ),
    );

    return data;
  }
}
