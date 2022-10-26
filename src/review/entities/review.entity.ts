import { CommonEntity } from "src/common/entities/common.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

@Entity()
export class Review extends CommonEntity {
    @Column({ type: 'integer' })
    public readonly review_id: number;

    @Column({ type: 'varchar' })
    public readonly review_title: string;

    @Column({ type: 'varchar', nullable: true })
    public readonly review_sub_title: string;

    @Column({ type: 'varchar', nullable: true })
    public readonly thumbnail: string;

    @Column({ type: 'text' })
    public readonly content: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'review_author_id', referencedColumnName: 'id' })
    public readonly review_author!: User;

    @Column({ type: 'uuid' })
    public readonly review_author_id!: string;

    @Column({ type: 'varchar', length: 255 })
    public readonly review_author_address!: string;

    @Column({ type: 'integer', default: 0 })
    public readonly views: number;
}