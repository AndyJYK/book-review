import { CustomRepository } from "src/database/typeorm/typeorm.decorator";
import { Repository } from "typeorm";
import { Book } from "../entities/book.entity";

@CustomRepository(Book)
export class BookRepository extends Repository<Book> { }