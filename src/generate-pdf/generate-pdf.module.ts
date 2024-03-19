import { Module } from '@nestjs/common';
import { AuthModule } from '@src/auth/auth.module';
import { DatabaseModule } from '@src/core/database/database.module';
import { KafkaProducerModule } from '@src/core/service/kafka/producer/kafka-producer.module';
import { KafkaProducerService } from '@src/core/service/kafka/producer/kafka-producer.service';
import { LoggerService } from '@src/core/service/logger/logger.service';
import { PermissionsService } from '@src/permissions/permissions.service';

import { PdfController } from './generate-pdf.controller';
import { pdfProviders } from './generate-pdf.providers';
import { PdfService } from './service/generate-pdf.service';

@Module({
  imports: [KafkaProducerModule, DatabaseModule, AuthModule],
  providers: [
    PdfService,
    ...pdfProviders,
    LoggerService,
    PermissionsService,
    KafkaProducerService
  ],
  controllers: [PdfController],
  exports: [PdfService, LoggerService, PermissionsService, KafkaProducerService]
})
export class PdfModule {}
