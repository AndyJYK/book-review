import { PrimaryGeneratedColumn } from "typeorm";

export class CommonEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
}