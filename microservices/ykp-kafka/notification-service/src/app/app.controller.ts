import { Controller } from '@nestjs/common';
// import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  // constructor(private readonly appService: AppService) { }

  // @Get()
  // getData() {
  //   return this.appService.getData();
  // }

  @EventPattern('user_created')
  async handleUserCreated(data: any) {
    console.log('User created event received:', data);
    // Process the event, e.g., send an email
    return {
      status: 'success',
      message: 'Notification processed successfully',
    };
  }
}
