import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { KafkaProducerService } from '@src/core/service/kafka/producer/kafka-producer.service';
import { LoggerService } from '@src/core/service/logger/logger.service';
import { Queue } from 'bull';

@Injectable()
export class PdfService {
  private readonly host: string;
  sequelize: any;
  constructor(
    private readonly logger: LoggerService,
    @InjectQueue('pdfQueue') private pdfQueue: Queue,
    private readonly kafkaProducerService: KafkaProducerService
  ) {}
  async create(dto: any): Promise<any> {
    this.logger.log('starting generate pdf through BullMQ', '===running===');

    const job = await this.pdfQueue.add('generatePdfQueue', dto);
    const response = await job.finished();

    this.logger.log('success generate pdf', JSON.stringify(dto, null, 2));

    return {
      statusCode: 201,
      statusDescription: 'Generate PDF success!',
      data: response
    };
  }

  async generatePDF(dto: any): Promise<any> {
    this.logger.log('starting generate pdf through BullMQ', '===running===');

    this.pdfQueue.add('generatePdfQueue', { ...dto, isDataFromKafka: true });

    this.logger.log('success generate pdf', JSON.stringify(dto, null, 2));
  }
}
