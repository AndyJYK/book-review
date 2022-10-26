import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
import { AppRequest } from "src/common/interfaces";
import { User } from "src/user/entities/user.entity";
import { CustomJwtService } from "../services";
import { AuthService } from "../services/auth.service";

@Injectable()
export class JwtValidateGuard extends AuthGuard('jwt-validate') implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly customJwtService: CustomJwtService,
    ) {
        super();
    }

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const req = ctx.switchToHttp().getRequest<AppRequest<User>>();
        const res = ctx.switchToHttp().getResponse<Response>();

        const validateRefreshAndIssueAccess = async (refreshIndex: string): Promise<boolean> => {
            const refresh = await this.authService.getRefreshTokenFromDB(refreshIndex);
            if (!refresh) {
                return false;
            }

            const refreshValidated = this.customJwtService.validateRefreshToken(refresh.refreshToken);
            if (!refreshValidated) {
                await this.authService.removeRefreshByToken(refreshIndex);

                res.clearCookie('at');
                res.clearCookie('rt');

                return false;
            }

            const access_token = this.customJwtService.getAccessTokenFromJWT({
                sub: 'at',
                iss: 'localhost',
                id: refresh.authId
            });

            await super.canActivate(ctx);

            res.cookie('at', access_token, {
                httpOnly: true,
                sameSite: "lax",
                maxAge: 30 * 60 * 1000,
                // secure: true
            });

            return true;
        }

        const { at, rt } = req.cookies;

        if (!at && !rt) {
            return false;
        }

        if (!at && rt) {
            const result = validateRefreshAndIssueAccess(rt);
            return result;
        }

        const accessValidated = this.customJwtService.validateAccessToken(at);

        // AccessToken is validated
        if (accessValidated && accessValidated.id) {
            await super.canActivate(ctx);
            return true;
        }

        // AccessToken is unvalidated and checking RefreshToken Index ID
        if (!rt) {
            return false;
        }

        const result = validateRefreshAndIssueAccess(rt);
        return result;
    }
}