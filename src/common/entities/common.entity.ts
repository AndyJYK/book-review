import { PrimaryGeneratedColumn } from "typeorm";

export class Common {
    @PrimaryGeneratedColumn('uuid')
    id: string;
}