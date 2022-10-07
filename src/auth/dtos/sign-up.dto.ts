import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";
import { User } from "src/user/entities/user.entity";


export class SignUpDto {
    @ApiProperty({
        example: 'example@example.com',
        description: 'email',
        required: true
    })
    @IsString()
    @IsEmail()
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

export class SignUpResultDto extends PartialType(User) { };