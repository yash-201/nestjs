import { Controller, Get } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @GrpcMethod('PaymentService', 'ProcessPayment')
  processPayment(data: { orderId: string; amount: number }) {
    console.log('gRPC Payment request received:', data);
    return {
      status: 'success',
      transactionId: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    };
  }

  @Get("/health")
  healthCheck() {
    return { status: "ok" };
  }

  @Get()
  getData() {
    return this.appService.getData();
  }
}
