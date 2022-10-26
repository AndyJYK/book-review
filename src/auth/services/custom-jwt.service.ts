import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { CookieOptions } from "express";
import { JwtPayload, SignJwtPayload } from "../interface/auth.interface";
import { JwtSignOpt } from "../types/auth.type";

@Injectable()
export class CustomJwtService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly config: ConfigService
    ) { }

    public accessCookieOptions: CookieOptions = {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 30 * 60 * 1000,
        // secure: true
    };

    /**
     * @Deprecated true
     */
    // public jwtSign(payload: SignJwtPayload, opt: JwtSignOpt) {
    //     return {
    //         ...(opt?.access_token && { access_token: this.getAccessTokenFromJWT({ sub: 'at', ...payload }) }),
    //         ...(opt?.refresh_token && { refresh_token: this.getRefreshTokenFromJWT({ sub: 'rt', ...payload }) }),
    //     };
    // }

    public getAccessTokenFromJWT(payload: JwtPayload): string {
        return this.jwtService.sign(payload, {
            secret: this.config.get<string>('jwtSecret'),
            expiresIn: '30m',
        });
    }

    public getRefreshTokenFromJWT(payload: JwtPayload): string {
        return this.jwtService.sign(payload, {
            secret: this.config.get('jwtRefreshSecret'),
            expiresIn: '7d',
        });
    }

    public validateAccessToken(token: string): JwtPayload {
        try {
            const verified = this.jwtService.verify(token, {
                secret: this.config.get('jwtSecret')
            });
            return verified;
        } catch (err) {
            return null;
        }
    }

    public validateRefreshToken(token: string): boolean {
        const verified = this.jwtService.verify<JwtPayload>(token, {
            secret: this.config.get('jwtRefreshSecret')
        });
        if (!verified) {
            return false;
        }

        const diffTime = (verified.exp * 1000) - new Date().getTime();
        return diffTime > 300000 ? true : false;
    }
}