import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import * as providers from './providers';

@Global()
@Module({
    imports: [],
    providers: [...Object.values(providers)],
    exports: [...Object.values(providers)]
})
export class CommonModule { }
