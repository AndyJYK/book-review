import { Common } from "src/common/entities/common.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Book extends Common {
    @Column({ type: 'varchar' })
    book_title: string;

    @Column({ type: 'varchar' })
    book_author: string;
}