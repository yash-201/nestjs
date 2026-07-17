import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { readDb } from "../product.store";
import { GetProductsQuery } from "./get-products.queries";

@QueryHandler(GetProductsQuery)
export class GetProductsHandler implements IQueryHandler<GetProductsQuery> {
    async execute(query: GetProductsQuery): Promise<any> {
        return readDb;
    }
}