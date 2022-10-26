import { HttpException, HttpStatus } from "@nestjs/common";
import { CommonEntity } from "src/common/entities/common.entity";
import { BeforeInsert, Column, Entity, Index, OneToOne } from "typeorm";
import { UserAvatar } from "./user-avatar.entity";

@Entity()
export class User extends CommonEntity {
    @Column({ type: 'varchar', length: 50, unique: true })
    public readonly email!: string;

    @Column({ type: 'varchar', length: 255, select: false })
    public readonly password!: string;

    @Column({ type: 'varchar', nullable: true })
    public readonly name?: string;

    @Index()
    @Column({ type: 'varchar', length: 255, unique: true })
    public readonly user_address!: string;

    @OneToOne(() => UserAvatar, (userAvatar) => userAvatar.user, { nullable: true })
    public readonly user_avatar?: UserAvatar;
}