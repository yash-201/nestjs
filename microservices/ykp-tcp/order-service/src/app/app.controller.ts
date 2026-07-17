import { Controller, Get, Inject, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';


@Controller('orders')
export class AppController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    private readonly appService: AppService) { }

  @Get(":id")
  async getOrder(@Param('id') userId: string) {
    const pattern = { cmd: "validate_user" };
    const paylod = { userId: Number(userId) };
    const userAuthValid = await firstValueFrom(this.authClient.send(pattern, paylod));
    if (userAuthValid.status == "success") {
      const orderData = this.appService.getData();
      return { message: "order get successfully", data: orderData }
    }
    return { message: "user not authorized" }
  }
}
