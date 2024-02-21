import { Module } from '@nestjs/common';
import { DatabaseModule } from '@src/core/database/database.module';
import { LoggerService } from '@src/core/service/logger/logger.service';

import { logProviders } from './logs.providers';

@Module({
  imports: [DatabaseModule],
  providers: [...logProviders, LoggerService],
  exports: [LoggerService]
})
export class LogsModule {}
