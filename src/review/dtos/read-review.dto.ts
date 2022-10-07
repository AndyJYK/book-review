import { IsNumber, IsString } from "class-validator";

export class ReadReviewDto {
    @IsString()
    readonly address: string;

    @IsNumber()
    readonly review_id: number;
}