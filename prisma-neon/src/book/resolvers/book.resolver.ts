import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BookService } from '../book.service';
import { Book } from '../model/book.model';
import { CreateBookInput } from '../dto/create-book.input';
import { updateBookInput } from '../dto/update-book.input';

@Resolver(() => Book)
export class BookResolver {
    constructor(
        private readonly bookService: BookService
    ) { }

    @Query(() => [Book], { name: 'getAllBooks' })
    async findAll(): Promise<Book[]> {
        return this.bookService.findAll();
    }

    @Query(() => String, { name: 'testThrottle' })
    testThrottle(): string {
        return 'Throttler works!';
    }

    @Query(() => Book, { name: 'getBookById' })
    async findById(@Args('id') id: string): Promise<Book> {
        return this.bookService.findById(id);
    }

    @Mutation(() => Book, { name: 'createBook' })
    async create(@Args('createBookInput') input: CreateBookInput): Promise<Book> {
        return this.bookService.create(input);
    }

    @Mutation(() => Book, { name: 'updateBook' })
    async update(@Args('updateBookInput') input: updateBookInput): Promise<Book> {
        return this.bookService.update(input.id, input);
    }

    @Mutation(() => Book, { name: 'deleteBook' })
    async delete(@Args('id') id: string): Promise<Book> {
        return this.bookService.delete(id);
    }
}

/*
// GraphQL Query and Mutation Examples for Testing:
// URL: http://localhost:3000/graphql

// 1. Create a Book
mutation {
  createBook(createBookInput: {
    title: "yash book",
    author: "yash",
    description: "test description"
  }) {
    id
    title
    description
    author
  }
}

// 2. Get All Books
query {
  getAllBooks {
    id
    title
    description
    author
    createdAt
    updatedAt
  }
}

// 3. Get Book By ID
query {
  getBookById(id: "YOUR_BOOK_UUID") {
    id
    title
    description
    author
  }
}

// 4. Update a Book
mutation {
  updateBook(updateBookInput: {
    id: "YOUR_BOOK_UUID",
    title: "Updated Title",
    description: "Updated Description"
  }) {
    id
    title
    description
  }
}

// 5. Delete a Book
mutation {
  deleteBook(id: "YOUR_BOOK_UUID") {
    id
    title
  }
}
*/
