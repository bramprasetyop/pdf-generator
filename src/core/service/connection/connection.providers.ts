import { LOGS_REPOSITORY } from '@src/core/constants';
import { Log } from '@src/log/entity/log.entity';

export const connectionCheckProviders = [
  {
    provide: LOGS_REPOSITORY,
    useValue: Log
  }
];
