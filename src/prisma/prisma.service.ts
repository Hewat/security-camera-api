import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  /**
   * Quand oum servico carrega e tem o OnModuleInit o Nest vai invocar o metodo abaixo
   * quando o modulo do prisma for carregado
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   *criando um evento para quando a instancia do Prisma foi fechada,forcar o fechamento da aplicacao
   *evita problemas de memory leak
   */
  enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit' as never, async () => {
      await app.close();
    });
  }
}
