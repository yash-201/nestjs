import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookInput } from './dto/create-book.input';
import { updateBookInput } from './dto/update-book.input';
import { Book } from './model/book.model';

@Injectable()
export class BookService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    create(input: CreateBookInput) {
        return this.prisma.book.create({
            data: {
                title: input.title,
                description: input.description,
                author: input.author,
            }
        })
    }

    async findAll(): Promise<Book[]> {
        return this.prisma.book.findMany();
    }

    async findById(id: string): Promise<Book> {
        const book = await this.prisma.book.findUnique({
            where: { id }
        });
        if (!book) {
            throw new NotFoundException('Book not found');
        }
        return book;
    }

    async update(id: string, input: updateBookInput): Promise<Book> {
        return this.prisma.book.update({
            where: { id },
            data: {
                title: input.title,
                description: input.description,
                author: input.author,
            }
        })
    }

    async delete(id: string): Promise<Book> {
        return this.prisma.book.delete({
            where: { id }
        })
    }
}
