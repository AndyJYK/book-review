import { Body, Controller, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from './services/auth.service';
import { MyProfile } from './decorators/my-profile.decorator';
import { Public } from './decorators/public.decorator';
import { SignUpDto } from './dtos/sign-up.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtPayload } from './interface/auth.interface';
import { CustomJwtService } from './services';

@ApiTags('Auth Api')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly customJwtService: CustomJwtService
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
        const payload: Omit<JwtPayload, 'sub'> = {
            iss: 'localhost',
            id: user.id,
        }

        const access_token = this.customJwtService.getAccessTokenFromJWT({ sub: 'at', ...payload });
        const refresh_token = this.customJwtService.getRefreshTokenFromJWT({ sub: 'rt', ...payload });

        const refreshId = await this.authService.saveRefreshTokenInToDB(refresh_token, user.id);

        res.cookie('at', access_token, {
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

    // Refectoring Process
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
