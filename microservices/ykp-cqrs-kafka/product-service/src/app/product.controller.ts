import { Controller, Get, Inject } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProductCommand } from './commands/create-product.command';
import { GetProductsQuery } from './queries/get-products.queries';
import { Body, Post, Query } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Controller('products')
export class ProductController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        @Inject('KAFKA_SERVICE') private readonly producer: ClientKafka,
    ) { }

    @Post()
    async createProduct(@Body() body: { name: string }) {
        const result = await this.commandBus.execute(new CreateProductCommand(body.name));
        this.producer.emit('product_created', result);
        return { message: 'Product created successfully', result };
    }

    @Get()
    async getProducts(@Query() query: any) {
        const result = await this.queryBus.execute(new GetProductsQuery(query));
        return { 
            message: 'Products fetched successfully', 
            instance: process.env.INSTANCE_NAME || 'default',
            result 
        };
    }
}
