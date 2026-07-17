import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { readDb } from "./product.store";

@Controller()
export class ProductConsumer {
    @EventPattern('product_created')
    async handleCreateProductEvent(@Payload() data: any) {
        console.log('Product created:', data);
        readDb.push({
            id: data.id,
            name: data.name,
        })
        return { status: 'success' }
    }
}
