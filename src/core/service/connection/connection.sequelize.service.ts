import { Inject, Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { LOGS_REPOSITORY } from '@src/core/constants';
import { Log } from '@src/log/entity/log.entity';

@Injectable()
export class SequelizeHealthIndicator extends HealthIndicator {
  sequelize: any;
  constructor(
    @Inject(LOGS_REPOSITORY)
    private readonly companyDocumentCutOffRepository: typeof Log
  ) {
    super();
    this.sequelize = this.companyDocumentCutOffRepository.sequelize;
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    try {
      await this.sequelize.authenticate();
      return this.getStatus('database', true);
    } catch (error) {
      return this.getStatus('database', false, { message: error.message });
    }
  }
}
