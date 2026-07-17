import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppService } from './app.service';
import { Partitioners } from 'kafkajs';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';

@Module({
  imports: [
    CacheModule.registerAsync<any>({
      isGlobal: true,
      useFactory: async () => ({
        stores: [createKeyv('redis://localhost:6379')],
        ttl: 60000,
      }),
    }),
    ClientsModule.register([
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          producer: {
            createPartitioner: Partitioners.DefaultPartitioner,
          },
          consumer: {
            groupId: 'api-gateway',
          },
        },
      },
    ])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
