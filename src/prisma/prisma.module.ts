import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // permite que todos modulos do Nest trabalhe com banco de dados
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
