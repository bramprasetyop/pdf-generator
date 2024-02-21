import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  Query
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { API_PREFIX } from '@src/core/constants';
import { ParseMessagePipe } from '@src/core/service/kafka/consumer/parse-message.pipe';

import { PdfGeneratorCreateRequest } from './dto';
import { PdfService } from './service/generate-pdf.service';

@Controller()
@ApiTags('Pdf')
@ApiBearerAuth()
export class PdfController {
  constructor(private pdfService: PdfService) {}

  @MessagePattern('pdf-generator-topic')
  pdfGeneratorResponse(@Payload(new ParseMessagePipe()) message): void {
    this.pdfService.generatePDF(message);
  }

  @Post(`${API_PREFIX}pdf`)
  async create(
    @Body() body: any,
    @Query() query: PdfGeneratorCreateRequest
  ): Promise<any> {
    try {
      if (Array.isArray(body)) {
        throw new BadRequestException(
          'PDF Generator data structure must object'
        );
      }

      if (!body || !body?.appCode) {
        throw new BadRequestException('PDF Generator need data and app code');
      }

      const jobData = {
        ...body,
        ...{ file: query?.fileRoute }
      };
      return await this.pdfService.create(jobData);
    } catch (error) {
      throw new InternalServerErrorException(error?.message);
    }
  }
}
