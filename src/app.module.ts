import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import {
  Inject,
  MiddlewareConsumer,
  Module,
  RequestMethod
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as redisStore from 'cache-manager-redis-store';
import { join } from 'path';

import { HomeController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './core/database/database.module';
import { ResponseMiddleware } from './core/middleware';
import { ConnectionModule } from './core/service/connection/connection.module';
import { LoggerService } from './core/service/logger/logger.service';
import { PdfModule } from './generate-pdf/generate-pdf.module';
import { LogsModule } from './log/logs.module';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..')
    }),
    DatabaseModule,
    AuthModule,
    ConnectionModule,
    PermissionsModule,
    PdfModule,
    LogsModule
  ],
  controllers: [HomeController],
  providers: [LoggerService]
})
export class AppModule {
  constructor(@Inject(CACHE_MANAGER) cacheManager) {
    try {
      const client = cacheManager.store.getClient();

      client.on('error', error => {
        console.info(`Redis error: ${error}`);
      });

      client.on('end', () => {
        console.info('Redis connection ended');
      });

      client.on('reconnecting', () => {
        console.info('Redis is reconnecting');
      });
    } catch (error) {
      console.error(
        `Error while initializing Redis connection: ${error.message}`
      );
    }
  }

  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ResponseMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
