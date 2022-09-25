import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from 'src/user/entities/user.entity';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(private readonly authService: AuthService) {
        super({
            usernameField: 'email',
            passwordField: 'password',
        });
    }

    public async validate(email: string, password: string) {
        try {
            // return await this.authService.validateUserByEmail({ email, password });
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.UNAUTHORIZED);
        }
    }
}