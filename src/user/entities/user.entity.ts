import { CommonEntity } from "src/common/entities/common.entity";
import { BeforeInsert, Column, Entity } from "typeorm";

@Entity()
export class User extends CommonEntity {
    @Column({ type: 'varchar', length: 50, unique: true })
    public readonly email: string;

    @Column({ type: 'varchar', length: 255 })
    public readonly password: string;

    @Column({ type: 'varchar', nullable: true })
    public readonly name?: string;

    @Column({ type: 'varchar', unique: true, nullable: true })
    public readonly app_address?: string;
}