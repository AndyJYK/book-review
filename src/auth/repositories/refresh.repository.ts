import { CustomRepository } from "src/database/typeorm/typeorm.decorator";
import { Repository } from "typeorm";
import { Refresh } from "../entities/refresh.entity";

@CustomRepository(Refresh)
export class RefreshRepository extends Repository<Refresh> {
    public async saveRefreshToken(token: string, authId: string) {
        return await this.createQueryBuilder()
            .insert()
            .into(Refresh)
            .values({
                refreshToken: token,
                authId,
            })
            .execute();
    }

    public async deleteRefreshToken(authId: string) {
        return await this.createQueryBuilder()
            .delete()
            .from(Refresh)
            .where('authId = :authId', { authId })
            .execute();
    }
}