import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
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
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ResponseMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
