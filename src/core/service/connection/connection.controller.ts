import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

import { ExternalAPIHealthIndicator } from './connection.externalAPI.service';
import { SequelizeHealthIndicator } from './connection.sequelize.service';

@Controller('/health-check')
export class ConnectionController {
  constructor(
    private readonly connection: HealthCheckService,
    private readonly sequelizeHealthIndicator: SequelizeHealthIndicator,
    private readonly externalApiIndicator: ExternalAPIHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.connection.check([
      () => this.sequelizeHealthIndicator.isHealthy(),
      async () =>
        await this.externalApiIndicator.isHealthy('https://google.co.id')
    ]);
  }
}
