import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { User } from "src/user/entities/user.entity";


export class GetReviewListDto {
    // equal to take() in typeorm
    @ApiProperty({ default: 15, example: 15, required: true })
    @IsNumber()
    limit: number;

    // equal to skip() in typeorm
    @ApiProperty({ default: 0, example: 0, required: true })
    @IsNumber()
    offset: number;
}