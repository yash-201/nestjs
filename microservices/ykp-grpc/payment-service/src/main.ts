/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import Consul from 'consul';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 3005;
  const consul = new Consul({
    host: 'localhost',
    port: 8500,
  });

  const serviceId = `payment-service-${Date.now()}`;
  const registrationOptions = {
    name: 'payment-service',
    port,
    id: serviceId,
    address: 'localhost',
    check: {
      name: 'payment-service-health',
      http: `http://host.docker.internal:${port}/health`,
      interval: '10s',
      timeout: '5s',
      deregistercriticalserviceafter: '1m',
    },
  };

  try {
    await consul.agent.service.register(registrationOptions);
    console.log("service id ", serviceId);
  } catch (error) {
    console.error("Consul registration error:", error);
  }

  // Connect gRPC microservice in parallel
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'payment',
      protoPath: join(process.cwd(), 'libs/proto/payment.proto'),
      url: '0.0.0.0:50052',
    },
  });

  process.on('SIGTERM', async () => {
    console.log('de-registering from consul');
    await consul.agent.service.deregister(serviceId);
    process.exit(0);
  });

  await app.startAllMicroservices();
  await app.listen(port);
  console.log(`payment service is running on port ${port} (HTTP)`);
  console.log(`payment service is running on port 50052 (gRPC)`);
}

bootstrap();
