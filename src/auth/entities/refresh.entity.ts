import { CommonEntity } from "src/common/entities/common.entity";
import { Column, Entity } from "typeorm";


@Entity()
export class Refresh extends CommonEntity {
    @Column({ type: 'varchar' })
    refreshToken: string;

    @Column({ type: 'uuid' })
    authId: string;
}