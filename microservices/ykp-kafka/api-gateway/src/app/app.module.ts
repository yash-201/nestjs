import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppService } from './app.service';
import { Partitioners } from 'kafkajs';

@Module({
  imports: [ClientsModule.register([
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
