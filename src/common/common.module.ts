import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import * as providers from './providers';

@Global()
@Module({
    imports: [
        JwtModule.registerAsync({
            useFactory: (config: ConfigService) => ({
                secret: config.get('jwtSecret'),
                signOptions: { expiresIn: '60h' },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [...Object.values(providers)],
    exports: [...Object.values(providers), JwtModule]
})
export class CommonModule { }
