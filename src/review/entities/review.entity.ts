import { Common } from "src/common/entities/common.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

@Entity()
export class Review extends Common {
    @Column({ type: 'varchar' })
    review_title: string;

    @Column({ type: 'text' })
    content: string;

    @OneToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn()
    review_author: User;
}