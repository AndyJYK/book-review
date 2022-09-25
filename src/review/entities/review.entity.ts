import { Common } from "src/common/entities/common.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

@Entity()
export class Review extends Common {
    @Column({ type: 'varchar' })
    public readonly review_title: string;

    @Column({ type: 'text' })
    public readonly content: string;

    @OneToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn()
    public readonly review_author: User;

    @Column({ type: 'integer' })
    public readonly review_view: number;
}