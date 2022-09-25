import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Auth Api')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @ApiOperation({ summary: 'Sign Up Api' })
    @ApiCreatedResponse({
        description: 'Sign In'
    })
    @Post('/sign-up')
    async signUp(@Body() signUpData: SignUpDto) {
        return await this.authService.signUp(signUpData);
    }

    @ApiOperation({ summary: 'Sign In Api' })
    @Post('/sign-in')
    async signIn() {
        try {

        } catch (err) { }
    }
}
