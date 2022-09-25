import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { JwtPayload } from "../interface/auth.interface";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private readonly config: ConfigService,
    ) {
        super();
    }

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const req = ctx.switchToHttp().getRequest<Request>();
        const { at } = req.cookies;
        if (!at) throw new HttpException('AccessToken is not sent', HttpStatus.UNAUTHORIZED);

        console.log(at, 'jwt-auth.guard.ts');
        const canAccess = await super.canActivate(ctx);
        if (!canAccess) return false;

        req.user = this.validateToken(at);

        return true;
    }

    public validateToken(token: string): JwtPayload {
        const verify: JwtPayload = this.jwtService.verify(
            token,
            { secret: this.config.get<string>('jwtSecret') }
        );
        return verify;
    }
}