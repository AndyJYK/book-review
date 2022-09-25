import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interface/auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private readonly config: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => {
                const { at } = req?.cookies;
                if (!at) return null;
                return at;
            }]),
            ignoreExpiration: true,
            secretOrKey: config.get<string>('jwtSecret')
        });
    }

    public validate(payload: JwtPayload) {
        console.log(payload, 'jwt.strategy.ts');
        return payload;
    };
}