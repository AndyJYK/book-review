import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/repositories/user.repository';
import { SignInDto } from '../dtos/sign-in.dto';
import { SignUpDto, SignUpResultDto } from '../dtos/sign-up.dto';
import { Refresh } from '../entities/refresh.entity';
import { HashRepository } from '../repositories/hash.repository';
import { RefreshRepository } from '../repositories/refresh.repository';

@Injectable()
export class AuthService {
    constructor(
        private readonly refreshRepository: RefreshRepository,
        private readonly userRepository: UserRepository,
        private readonly hashRepository: HashRepository,
    ) { }

    async validateUserById(authId: string): Promise<User> {
        return await this.userRepository.findUserById(authId);
    }

    async validateLocalSignIn({ email, password }: SignInDto) {
        const user = await this.userRepository.findUserByEmailLocal(email);
        if (!user || !user.id) {
            throw new HttpException({ message: 'User is not found' },
                HttpStatus.NOT_FOUND
            );
        }

        const validatePwd = await this.hashRepository.compareHashPassword(password, user.password);
        if (!validatePwd) {
            throw new HttpException({ message: 'Password is not match' },
                HttpStatus.BAD_REQUEST
            );
        }

        return user;
    }

    // Refectoring Process
    async signUp(signUpData: SignUpDto): Promise<SignUpResultDto> {
        const { email, password, ...rest } = signUpData;
        const hash = await this.hashRepository.hashPassword(password, 10);

        const isUserExist = await this.userRepository.checkUserExistByEmail(email);
        if (isUserExist) {
            throw new HttpException({ message: 'User with this email is exist' },
                HttpStatus.BAD_REQUEST
            );
        }

        const userAddress = email.split('@')[0] + '_' + new Date().getTime().toString();

        const { password: pwd, ...newUser } = await this.userRepository.createUser({
            email,
            password: hash,
            name: rest?.name,
            user_address: userAddress
        });
        return newUser;
    }

    public async getRefreshTokenFromDB(refreshId: string): Promise<Refresh> {
        const refresh = await this.refreshRepository.findOneBy({ id: refreshId });
        return refresh;
    }

    public async saveRefreshTokenInToDB(token: string, authId: string): Promise<string> {
        const refresh = await this.refreshRepository.findOneBy({ authId });
        if (refresh && refresh.id) {
            return refresh.id;
        }

        const { identifiers }: { identifiers: { id?: string }[] } =
            await this.refreshRepository.saveRefreshToken(token, authId);

        if (identifiers[0].id) {
            return identifiers[0].id;
        }

        throw new HttpException({ message: 'Insert Refresh Token into the DB failed' },
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    public async removeRefreshTokenFromDB(authId: string): Promise<boolean> {
        const deleteResult = await this.refreshRepository.deleteRefreshToken(authId);
        if (deleteResult.affected > 0) {
            return true;
        }

        return false;
    }

    public async removeRefreshByToken(refreshToken: string) {
        const deleteResult = await this.refreshRepository
            .createQueryBuilder()
            .delete()
            .from(Refresh)
            .where('refreshToken = :refreshToken', { refreshToken })
            .execute();

        if (deleteResult.affected > 0) {
            return true;
        }

        return false;
    }
}
