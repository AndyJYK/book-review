import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { notStrictEqual } from "assert";
import { Request, Response } from "express";
import { AppRequest } from "src/common/interfaces";
import { User } from "src/user/entities/user.entity";
import { AuthService } from "../auth.service";
import { IS_PUBLIC } from "../constants";
import { Refresh } from "../entities/refresh.entity";
import { JwtPayload } from "../interface/auth.interface";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
    constructor(
        private reflector: Reflector,
        private authService: AuthService,
        private jwtService: JwtService,
        private readonly config: ConfigService,
    ) {
        super();
    }

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
            ctx.getHandler(),
            ctx.getClass(),
        ]);
        if (isPublic) true;

        const req = ctx.switchToHttp().getRequest<AppRequest<Partial<User>>>();
        const res = ctx.switchToHttp().getResponse<Response>();

        const { at, rt } = req.cookies;
        if (!at && !rt) return false;
        if (!at && rt) {
            const refresh = await this.getRefresh(rt);
            if (!refresh || !refresh.refreshToken) return false;

            const verified = this.validateRefreshToken(refresh.refreshToken);
            if (!verified) {
                await this.authService.removeRefreshByToken(rt);
                res.clearCookie('at');
                res.clearCookie('rt');
                return false;
            }

            const { access_token } = this.authService.jwtSign({ id: refresh.authId }, { access_token: true });
            req.user = { id: refresh.authId };
            res.cookie('at', access_token, {
                httpOnly: true,
                sameSite: "lax",
                maxAge: 30 * 60 * 1000,
                // secure: true
            });
            return true;
        }

        const verified = this.validateAccessToken(at);
        if (!verified || !verified.sub) {
            if (!rt) return false;
            const refresh = await this.getRefresh(rt);
            if (!refresh || !refresh.refreshToken) return false;

            const verified = this.validateRefreshToken(refresh.refreshToken);
            if (!verified) {
                await this.authService.removeRefreshByToken(rt);
                res.clearCookie('at');
                res.clearCookie('rt');
                return false;
            }

            const { access_token } = this.authService.jwtSign({ id: refresh.authId }, { access_token: true });
            req.user = { id: refresh.authId };
            res.cookie('at', access_token, {
                httpOnly: true,
                sameSite: "lax",
                maxAge: 30 * 60 * 1000,
                // secure: true
            });
            return true;
        }
        await super.canActivate(ctx);
        return true;
    }

    private validateAccessToken(token: string): JwtPayload {
        try {
            const verified = this.jwtService.verify<JwtPayload>(token, { secret: this.config.get<string>('jwtSecret') });
            return verified;
        } catch (err) {
            console.log(err);
            return;
        }
    }

    private async getRefresh(refreshId: string): Promise<Refresh> {
        const refresh = await this.authService.getRefreshTokenFromDB(refreshId);
        return refresh;
    }

    private validateRefreshToken(refreshToken: string): boolean {
        return this.authService.validateRefreshToken(refreshToken);
    }
}