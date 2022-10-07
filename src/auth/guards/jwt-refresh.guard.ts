import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AppRequest } from "src/common/interfaces";
import { User } from "src/user/entities/user.entity";
import { AuthService } from "../auth.service";
import { Refresh } from "../entities/refresh.entity";



@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') implements CanActivate {
    constructor(
        private readonly authService: AuthService
    ) {
        super()
    }

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const req = ctx.switchToHttp().getRequest<AppRequest<Partial<User>>>();
        const { rt } = req?.cookies;
        if (!rt) return true;

        const refresh = await this.getRefreshToken(rt);
        if (!refresh || !refresh.authId) return true;
        req.user = { id: refresh.authId }

        // const canAccess = await super.canActivate(ctx);
        // if (!canAccess) return false;

        return true;
    }

    async getRefreshToken(refreshId: string): Promise<Refresh> {
        const refresh = await this.authService.getRefreshTokenFromDB(refreshId);
        if (!refresh || !refresh.refreshToken) return;

        const isVerified = this.authService.validateRefreshToken(refresh.refreshToken);
        if (isVerified) return refresh;
        await this.authService.removeRefreshTokenFromDB(refreshId);
        return;
    }
}