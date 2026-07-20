import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductController } from './product.controller';
import { ProductConsumer } from './product.consumer';
import { CreateProductHandler } from './commands/create-product.handlers';
import { GetProductsHandler } from './queries/get-products.handler';

@Module({
  imports: [
    CqrsModule.forRoot(),
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: "cqrs-client",
            brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
          },
          consumer: {
            groupId: "cqrs-group",
          }
        },
      },
    ])],
  controllers: [AppController, ProductController, ProductConsumer],
  providers: [AppService, CreateProductHandler, GetProductsHandler],
})
export class AppModule { }
