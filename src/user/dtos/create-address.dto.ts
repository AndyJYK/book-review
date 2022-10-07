import { PickType } from "@nestjs/swagger";
import { User } from "../entities/user.entity";


export class CreateAddressDto extends PickType(User, ['id', 'app_address'] as const) { };