import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AppRequest } from 'src/common/interfaces';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { MyProfile } from './decorators/my-profile.decorator';
import { Public } from './decorators/public.decorator';
import { SignUpDto } from './dtos/sign-up.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Auth Api')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @ApiOperation({ summary: 'Sign Up Api' })
    @ApiResponse({ status: 201, description: 'New account has been successfully created.' })
    @Public()
    @Post('/sign-up')
    async signUp(@Body() signUpData: SignUpDto) {
        return await this.authService.signUp(signUpData);
    }

    @ApiOperation({ summary: 'Sign In Api' })
    @ApiCreatedResponse({
        status: 200,
        description: 'Sign In Success.',
        schema: {
            example: {
                message: 'login success',
                status: HttpStatus.OK,
                responseData: {
                    name: 'John Doe',
                    email: 'test@test.com'
                }
            }
        }
    })
    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('/sign-in')
    async signIn(@MyProfile() user: User, @Res() res: Response) {
        const tokens = this.authService.jwtSign({ id: user.id }, { access_token: true, refresh_token: true });
        const refreshId = await this.authService.saveRefreshTokenInToDB(tokens.refresh_token, user.id);

        res.cookie('at', tokens.access_token, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 30 * 60 * 1000,
            // secure: true
        });
        res.cookie('rt', refreshId, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 14 * 24 * 60 * 60 * 1000,
            // secure: true
        })
        return res.status(HttpStatus.OK).json({
            message: 'login success',
            status: HttpStatus.OK,
            responseData: user
        })
    }

    @ApiOperation({ summary: 'Sign Out Api' })
    @ApiResponse({ status: 200, description: 'Sign Out Success.' })
    @UseGuards(JwtAuthGuard)
    @Post('/sign-out')
    async signOut(@MyProfile() user: User, @Res() res: Response) {
        await this.authService.removeRefreshTokenFromDB(user.id);
        res.clearCookie('at');
        res.clearCookie('rt');
        return res.status(HttpStatus.OK).json({
            message: 'logout success',
            status: HttpStatus.OK
        })
    }
}
