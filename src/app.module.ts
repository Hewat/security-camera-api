import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CamerasModule } from './cameras/cameras.module';
import { PrismaModule } from './prisma/prisma.module';
import { CustomersModule } from './customers/customers.module';
import { AlertsModule } from './alerts/alerts.module';

@Module({
  imports: [CamerasModule, PrismaModule, CustomersModule, AlertsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
