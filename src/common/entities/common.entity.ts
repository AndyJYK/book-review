import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class CommonEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    create_date: Date;

    @UpdateDateColumn({ type: 'time with time zone' })
    update_date: Date;
}