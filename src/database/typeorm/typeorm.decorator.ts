import { SetMetadata } from "@nestjs/common";
import { TYPEORM_CUSTOM_REPOSITORY } from "../database.constants";

export function CustomRepository(entity: Function): ClassDecorator {
    return SetMetadata(TYPEORM_CUSTOM_REPOSITORY, entity);
}