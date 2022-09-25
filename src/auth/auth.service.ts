import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/repositories/user.repository';
import { SignUpDto } from './dtos/sign-up.dto';
import { JwtPayload, Payload } from './interface/auth.interface';
import { HashRepository } from './repositories/hash.repository';
import { JwtSignOpt } from './types/auth.type';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly hashRepository: HashRepository,
        private jwtService: JwtService,
        private config: ConfigService
    ) { }

    async signUp(signUpData: SignUpDto): Promise<Omit<User, 'password'>> {
        const { email, password, ...rest } = signUpData;
        const hash = await this.hashRepository.hashPassword(password, 10);

        const isUserExist = await this.userRepository.checkUserExistByEmail(email);
        if (isUserExist) throw new HttpException({ message: 'User with this email is exist' }, HttpStatus.BAD_REQUEST);

        const { password: pwd, ...newUser } = await this.userRepository.createUser({ email, password: hash, name: rest?.name });
        return newUser;
    }

    async signIn() { }

    public jwtSign(data: Payload, opt: JwtSignOpt) {
        const payload: JwtPayload = { sub: data.id, scope: data.scope };

        return {
            ...(opt?.access_token && { access_token: this.getAccessTokenFromJWT(payload) }),
            ...(opt?.refresh_token && { refresh_token: this.getRefreshTokenFromJWT(payload.sub) }),
        };
    }

    public validateAccessToken(token: string): JwtPayload {
        return this.jwtService.verify(token, { secret: this.config.get('jwtSecret') });
    }

    public getAccessTokenFromJWT(payload: JwtPayload): string {
        return this.jwtService.sign(payload, {
            secret: this.config.get('jwtSecret'),
            expiresIn: '30m',
        });
    }

    private getRefreshTokenFromJWT(sub: string): string {
        return this.jwtService.sign({ sub }, {
            secret: this.config.get('jwtRefreshSecret'),
            expiresIn: '7d', // Set greater than the expiresIn of the access_token
        });
    }
}
