import { Common } from "src/common/entities/common.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class User extends Common {
    @Column({ type: 'varchar', nullable: true })
    name?: string;

    @Column({ type: 'varchar', length: 50, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;
}