import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        private readonly config: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => {
                const { rt } = req.cookies;
                if (!rt) return null;
                return rt;
            }]),
            ignoreExpiration: true,
            secretOrKey: config.get('jwtRefreshSecret'),
        })
    }

    async validate(payload) {
        return payload;
    }
}