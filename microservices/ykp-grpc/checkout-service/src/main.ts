import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import Consul from 'consul';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 3006;
  const consul = new Consul({
    host: 'localhost',
    port: 8500,
  });

  const serviceId = `checkout-service-${Date.now()}`;
  const registrationOptions = {
    name: 'checkout-service',
    port,
    id: serviceId,
    address: 'localhost',
    check: {
      name: 'checkout-service-health',
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

  process.on('SIGTERM', async () => {
    console.log('de-registering from consul');
    await consul.agent.service.deregister(serviceId);
    process.exit(0);
  });

  await app.listen(port);
  console.log(`checkout service is running on port ${port}`);
}

bootstrap();
