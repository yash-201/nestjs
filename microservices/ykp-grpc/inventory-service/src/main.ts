/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule, {
    transport: Transport.GRPC,
    options: {
      package: "inventory",
      protoPath: join(process.cwd(), 'libs/proto/inventory.proto'),
      url: "localhost:50051"
    }
  }
  )
  // const globalPrefix = 'api';
  // app.setGlobalPrefix(globalPrefix);
  // const port = process.env.PORT || 3000;
  await app.listen();
  Logger.log(
    `🚀 Application is running on: http://localhost:50051 grpc inventory service`,
  );
}

bootstrap();
