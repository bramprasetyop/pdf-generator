import { Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { LOGS_REPOSITORY } from '@src/core/constants';
import { KafkaProducerService } from '@src/core/service/kafka/producer/kafka-producer.service';
import { LoggerService } from '@src/core/service/logger/logger.service';
import { Log } from '@src/log/entity/log.entity';
import { Job } from 'bull';
import Docxtemplater from 'docxtemplater';
import * as fs from 'fs';
import { convert } from 'libreoffice-convert';
import PizZip from 'pizzip';

@Processor('pdfQueue')
export class PdfProcessor {
  constructor(
    private readonly logger: LoggerService,
    @Inject(LOGS_REPOSITORY)
    private readonly logRepository: typeof Log,
    private readonly kafkaProducerService: KafkaProducerService
  ) {}

  private async convertDocumentToPDF(inputBuffer: Buffer): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      convert(inputBuffer, '.pdf', undefined, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  private removeDocxFile(filePath: string) {
    try {
      fs.unlinkSync(filePath);
      this.logger.log('Removed file:', `${filePath}`);
    } catch (error) {
      this.logger.error('Removing file:', `${filePath}`, error);
    }
  }

  @Process('generatePdfQueue')
  async processGeneratePdf(job: Job<any>) {
    const data = job.data;
    const { file } = data;

    try {
      this.logger.log(
        'Starting generate pdf in BullMQ processor',
        '===running==='
      );

      const logData = {
        appCode: data?.appCode,
        createdBy: 'SYS',
        data: JSON.stringify(data)
      };

      const createLog = await this.logRepository.create<any>(logData);

      // Load the DOCX template
      const docxTemplate = fs.readFileSync(`templates/${file}.docx`);

      // Create a new Docxtemplater instance
      const zip = new PizZip(docxTemplate);
      const doc = new Docxtemplater(zip);

      // Set the data for the template
      doc.setData(data);

      // Render the template
      doc.render();

      // Save the modified DOCX file
      const docxOutputPath = `templates/output/${data?.appCode}-${data?.id}.docx`;
      fs.writeFileSync(
        docxOutputPath,
        doc.getZip().generate({ type: 'nodebuffer' })
      );

      const docxFilePath = `templates/output/${data?.appCode}-${data?.id}.docx`;

      const docxTemplateInputBuffer = fs.readFileSync(docxFilePath);

      // Convert the DOCX file to PDF
      const pdfBuffer = await this.convertDocumentToPDF(
        docxTemplateInputBuffer
      );

      this.removeDocxFile(docxFilePath);

      // Send the PDF buffer to Kafka
      if (data?.isDataFromKafka) {
        this.kafkaProducerService.publish(
          { originData: data, convertedData: pdfBuffer },
          'pdf-generator-response-topic'
        );
      }
      createLog.update({ isSuccess: true, updatedBy: 'SYS' });

      this.logger.log('Generate pdf in bull processor done', 'success');
      return { originData: data, convertedData: pdfBuffer };
    } catch (error) {
      this.logger.error('Generate PDF in BullMQ processor', 'Error', error);
      throw error;
    }
  }
}
