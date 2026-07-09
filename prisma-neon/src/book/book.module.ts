import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookResolver } from './resolvers/book.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
  ],
  providers: [BookService, BookResolver],
  exports: [BookService, BookResolver]
})
export class BookModule { }
