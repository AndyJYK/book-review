import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/repositories/user.repository';
import { isQueryResultExists } from 'src/utils/query.util';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto, SignUpResultDto } from './dtos/sign-up.dto';
import { Refresh } from './entities/refresh.entity';
import { JwtPayload, Payload } from './interface/auth.interface';
import { HashRepository } from './repositories/hash.repository';
import { RefreshRepository } from './repositories/refresh.repository';
import { JwtSignOpt } from './types/auth.type';

@Injectable()
export class AuthService {
    constructor(
        private readonly refreshRepository: RefreshRepository,
        private readonly userRepository: UserRepository,
        private readonly hashRepository: HashRepository,
        private jwtService: JwtService,
        private config: ConfigService
    ) { }

    async validateLocalSignIn({ email, password }: SignInDto) {
        const user = await this.userRepository.findUserByEmail(email);
        if (!user || !user.id) throw new HttpException({ message: 'User is not found' }, HttpStatus.NOT_FOUND);

        const validatePwd = await this.hashRepository.compareHashPassword(password, user.password);
        if (!validatePwd) throw new HttpException({ message: 'Password is not match' }, HttpStatus.BAD_REQUEST);
        return user;
    }

    async signUp(signUpData: SignUpDto): Promise<SignUpResultDto> {
        const { email, password, ...rest } = signUpData;
        const hash = await this.hashRepository.hashPassword(password, 10);

        const isUserExist = await this.userRepository.checkUserExistByEmail(email);
        if (isUserExist) throw new HttpException({ message: 'User with this email is exist' }, HttpStatus.BAD_REQUEST);

        let appAddress = email.split('@')[0];
        const isAppAddressExist = await this.userRepository.checkAppAddressExist(appAddress);
        if (isAppAddressExist) appAddress += ('_' + new Date().getTime().toString());

        const { password: pwd, ...newUser } = await this.userRepository.createUser({
            email,
            password: hash,
            name: rest?.name,
            app_address: appAddress
        });
        return newUser;
    }

    public jwtSign(data: Payload, opt: JwtSignOpt) {
        const payload: JwtPayload = { sub: data.id };

        return {
            ...(opt?.access_token && { access_token: this.getAccessTokenFromJWT(payload) }),
            ...(opt?.refresh_token && { refresh_token: this.getRefreshTokenFromJWT(payload.sub) }),
        };
    }

    public validateAccessToken(token: string): JwtPayload {
        return this.jwtService.verify(token, { secret: this.config.get('jwtSecret') });
    }

    public validateRefreshToken(token: string): boolean {
        try {
            const verified = this.jwtService.verify<JwtPayload>(token, { secret: this.config.get('jwtRefreshSecret') });
            const diffTime = (verified.exp * 1000) - new Date().getTime();
            return diffTime > 300000 ? true : false;

        } catch (err) {
            return false;
        }
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
            expiresIn: '7d',
        });
    }

    public async getRefreshTokenFromDB(refreshId: string): Promise<Refresh> {
        try {
            const refresh = await this.refreshRepository.findOneBy({ id: refreshId });
            if (!refresh) throw new Error('RefreshToken is not found');

            return refresh;
        } catch (err) {
            console.log(err);
            return;
        }
    }

    public async saveRefreshTokenInToDB(token: string, authId: string): Promise<string> {
        const refresh = await this.refreshRepository.findOneBy({ authId });
        if (refresh) return refresh.id;

        const { identifiers } = await this.refreshRepository.saveRefreshToken(token, authId);
        if (!identifiers[0].id) throw new HttpException({ message: 'Insert Refresh Token into the DB failed' }, HttpStatus.INTERNAL_SERVER_ERROR);
        return identifiers[0].id;
    }

    public async removeRefreshTokenFromDB(authId: string): Promise<boolean> {
        const deleteResult = await this.refreshRepository.deleteRefreshToken(authId);
        if (deleteResult.affected > 0) return true;
        return false;
    }

    public async removeRefreshByToken(refreshToken: string) {
        const deleteResult = await this.refreshRepository
            .createQueryBuilder()
            .delete()
            .from(Refresh)
            .where('refreshToken = :refreshToken', { refreshToken })
            .execute();
        if (deleteResult.affected > 0) return true;
        return false;
    }
}
