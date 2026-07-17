import { CreateProductCommand } from "./create-product.command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
// import { EventPublisher } from "@nestjs/cqrs";
import { writeDb } from "../product.store";

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
    // constructor(
    //     private readonly eventPublisher: EventPublisher
    // ) { }

    async execute(command: CreateProductCommand): Promise<any> {
        const { name } = command;
        // const product = this.eventPublisher.mergeObjectContext({
        //     id: Date.now(),
        //     name,
        // });
        // product.commit();
        const product = {
            id: String(Date.now()),
            name,
        };
        writeDb.push(product);
        return product;
    }
}