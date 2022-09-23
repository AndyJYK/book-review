import { Module } from '@nestjs/common';
import { TypeOrmModule } from 'src/database/typeorm/typeorm.module';
import { BookService } from './book.service';
import { BookRepository } from './repositories/book.repository';

@Module({
    imports: [
        TypeOrmModule.forCustomRepository([
            BookRepository
        ])
    ],
    providers: [BookService]
})
export class BookModule { }
