import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AppRequest } from "src/common/interfaces";
import { User } from "src/user/entities/user.entity";

export const MyProfile = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest<AppRequest<User>>();
        const { password, ...user } = req?.user;
        return user;
    }
)