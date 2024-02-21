import { Log } from '@src/log/entity/log.entity';
import { Sequelize } from 'sequelize-typescript';

import { SEQUELIZE } from '../constants';
import { databaseConfig } from './database.config';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      const config = databaseConfig.database;
      const sequelize = new Sequelize(config);
      if (process.env.NODE_ENV === 'production') {
        // Disable SQL query logging in production
        sequelize.options.logging = false;

        // Connection pooling settings
        sequelize.options.pool = {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        };
      }
      sequelize.addModels([Log]);
      // uncomment for auto syncronize
      // await sequelize.sync();
      return sequelize;
    }
  }
];
