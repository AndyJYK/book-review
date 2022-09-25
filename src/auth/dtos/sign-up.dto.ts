import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";


export class SignUpDto {
    @ApiProperty({
        example: 'example@example.com',
        description: 'email',
        required: true
    })
    @IsString()
    readonly email: string;

    @ApiProperty({
        example: '1234',
        description: 'password',
        required: true
    })
    @IsString()
    readonly password: string;

    @ApiProperty({
        example: 'John Doe',
        description: 'username'
    })
    @IsOptional()
    @IsString()
    readonly name?: string;
}