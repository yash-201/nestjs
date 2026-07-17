import { Injectable } from '@nestjs/common';
import Consul from 'consul';

@Injectable()
export class AppService {
  private consul = new Consul({
    host: 'localhost',
    port: 8500,
  });

  async discoverAndCallPayment() {
    const services = await this.consul.agent.service.list();
    const service = Object.values(services).find((s: any) => s.Service === 'payment-service');
    if (!service) {
      return "service not found";
    }
    return service;
  }

  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
