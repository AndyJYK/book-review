import { SignUpDto } from "src/auth/dtos/sign-up.dto";
import { CustomRepository } from "src/database/typeorm/typeorm.decorator";
import { Repository, SelectQueryBuilder } from "typeorm";
import { User } from "../entities/user.entity";

@CustomRepository(User)
export class UserRepository extends Repository<User> {

    public async checkUserExistByEmail(email: string): Promise<boolean> {
        const user = await this.createQueryBuilder('u').where('u.email = :email', { email }).getOne();
        if (user && user.email) return true;
        return false;
    }

    public async findUserByEmail(email: string): Promise<User> {
        return await this.createQueryBuilder('u').where('u.email = :email', { email }).getOne();
    }

    public async createUser(signUpData: SignUpDto): Promise<User> {
        return await this.save(this.create(signUpData));
    }
}