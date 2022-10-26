import { CustomRepository } from "src/database/typeorm/typeorm.decorator";
import { Repository } from "typeorm";
import { UserAvatar } from "../entities/user-avatar.entity";

@CustomRepository(UserAvatar)
export class UserAvatarRepository extends Repository<UserAvatar> {
}