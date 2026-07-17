import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getData() {
    return this.appService.getData();
  }

  @MessagePattern({ cmd: "validate_user" })
  validateUser(@Payload() data: { userId: number }) {
    console.log("recive data as :", data);
    if (data.userId == 1) {
      return {
        status: "success",
      }

    }
    return 'user not found'
  }
}
