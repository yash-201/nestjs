import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka } from '@nestjs/microservices';
import { OnModuleInit } from '@nestjs/common';

@Controller()
export class AppController implements OnModuleInit {
  constructor(
    @Inject('NOTIFICATION_SERVICE') private readonly client: ClientKafka,
    private readonly appService: AppService
  ) { }

  async onModuleInit() {
    await this.client.connect();

    // Explicitly create the topic with 3 partitions on startup
    const admin = this.client.createClient().admin();
    try {
      await admin.connect();
      const topics = await admin.listTopics();
      if (!topics.includes('user_created')) {
        await admin.createTopics({
          topics: [
            {
              topic: 'user_created',
              numPartitions: 3,
              replicationFactor: 1,
            },
          ],
        });
        console.log('Topic "user_created" created with 3 partitions');
      }
    } catch (err) {
      console.error('Error creating Kafka topic:', err);
    } finally {
      await admin.disconnect();
    }
  }

  // url: /api/register
  @Post('register')
  async registerUser(@Body() userData: any) {
    this.client.emit('user_created', userData);
    return { message: 'User registration event sent' };
  }

  @Get()
  getData() {
    return this.appService.getData();
  }
}
