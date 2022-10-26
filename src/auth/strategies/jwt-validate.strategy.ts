import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interface/auth.interface";
import { AuthService } from "../services";

@Injectable()
export class JwtValidateStrategy extends PassportStrategy(Strategy, 'jwt-validate') {
    constructor(
        private readonly authService: AuthService,
        private readonly config: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => {
                const { at } = req.cookies;
                if (!at) {
                    return null;
                }
                return at;
            }]),
            ignoreExpiration: true,
            secretOrKey: config.get('jwtSecret'),
        })
    }

    public async validate(payload: JwtPayload) {
        const user = await this.authService.validateUserById(payload.id);
        if (!user) {
            throw new HttpException({ message: 'User is not found' },
                HttpStatus.NOT_FOUND
            );
        }

        return user;
    }
}