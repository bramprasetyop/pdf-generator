import { Log } from '@src/log/entity/log.entity';

import { LOGS_REPOSITORY } from '../core/constants';

export const pdfProviders = [
  {
    provide: LOGS_REPOSITORY,
    useValue: Log
  }
];
