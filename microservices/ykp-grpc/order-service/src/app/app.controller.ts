import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom, Observable } from 'rxjs';

interface InventoryService {
  CheckStock(data: { productId: number, quantity: number }): Observable<any>;
}

@Controller()
export class AppController implements OnModuleInit {
  private inventoryService!: InventoryService;

  constructor(
    @Inject("INVENTORY_SERVICE") private readonly inventoryClient: ClientGrpc,
  ) { }

  onModuleInit() {
    this.inventoryService = this.inventoryClient.getService<InventoryService>('InventoryService');
  }

  @Get()
  async getInventoryService() {
    try {
      const result = await lastValueFrom(this.inventoryService.CheckStock({ productId: 1, quantity: 10 }));
      return result
    } catch (error) {
      return error
    }
  }
}
