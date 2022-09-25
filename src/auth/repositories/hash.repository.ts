import { InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CustomRepository } from "src/database/typeorm/typeorm.decorator";
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";


@CustomRepository(User)
export class HashRepository {
    constructor() { }

    async hashPassword(password: string, saltRounds: number) {
        try {
            const hash = await bcrypt.hash(password, saltRounds);
            return hash;
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    async compareHashPassword(password: string, hash: string) {
        const isMatch = await bcrypt.compare(password, hash);
        return isMatch;
    }
}