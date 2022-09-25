import { Common } from "src/common/entities/common.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class User extends Common {
    @Column({ type: 'varchar', length: 50, unique: true })
    public readonly email: string;

    @Column({ type: 'varchar', length: 255 })
    public readonly password: string;

    @Column({ type: 'varchar', nullable: true })
    public readonly name?: string;
}