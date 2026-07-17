import { Controller, Get } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor() { }

  @GrpcMethod('InventoryService', 'CheckStock')
  CheckStock(data: { productId: number, quantity: number }) {
    console.log("data ", data)
    const items: Record<string, number> = {
      '1': 10,
      '2': 20,
      '3': 30,
    }
    if (items[data.productId] >= data.quantity) {
      return { inStock: true, availableQuantity: items[data.productId] }
    }
    return { inStock: false, availableQuantity: 0 }
  }

}
