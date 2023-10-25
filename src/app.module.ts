import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CamerasModule } from './cameras/cameras.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [CamerasModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
