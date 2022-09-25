import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AppRequest } from "src/common/types";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        private readonly config: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(req: AppRequest) => {
                const { rt } = req;
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