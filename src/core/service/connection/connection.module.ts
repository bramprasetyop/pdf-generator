import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { DatabaseModule } from '@src/core/database/database.module';

import { ConnectionController } from './connection.controller';
import { ExternalAPIHealthIndicator } from './connection.externalAPI.service';
import { connectionCheckProviders } from './connection.providers';
import { SequelizeHealthIndicator } from './connection.sequelize.service';

@Module({
  imports: [TerminusModule, DatabaseModule, HttpModule],
  controllers: [ConnectionController],
  providers: [
    SequelizeHealthIndicator,
    ExternalAPIHealthIndicator,
    ...connectionCheckProviders
  ]
})
export class ConnectionModule {}
