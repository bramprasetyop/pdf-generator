import { LOGS_REPOSITORY } from '../core/constants';
import { Log } from './entity/log.entity';

export const logProviders = [
  {
    provide: LOGS_REPOSITORY,
    useValue: Log
  }
];
