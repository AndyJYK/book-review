import { CommonEntity } from "src/common/entities/common.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { User } from "./user.entity";


@Entity()
export class UserAvatar extends CommonEntity {
    @OneToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    public readonly user!: User;

    @Column({ type: 'uuid' })
    public readonly user_id!: string;

    @Column({ type: 'varchar' })
    public readonly avatar!: string;
}