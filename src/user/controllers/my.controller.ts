import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { MyProfile } from "src/auth/decorators/my-profile.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { User } from "../entities/user.entity";


@ApiTags('My Api')
@Controller('my')
export class MyController {
    constructor() { }

    @UseGuards(JwtAuthGuard)
    @Get()
    async my(@MyProfile() { id }: User) {
        return id;
    }
}