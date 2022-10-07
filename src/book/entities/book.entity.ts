import { CommonEntity } from "src/common/entities/common.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Book extends CommonEntity {
    @Column({ type: 'varchar' })
    public readonly book_title: string;

    @Column({ type: 'varchar' })
    public readonly book_subtitle: string;

    @Column({ type: 'simple-array' })
    public readonly book_authors: string[];

    @Column({ type: 'varchar' })
    public readonly publisher: string;

    @Column({ type: 'smallint' })
    public readonly page_count: number;
}