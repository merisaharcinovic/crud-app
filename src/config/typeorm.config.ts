import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { CommentEntity } from "src/database/entities/comment.entity";
import { PostEntity } from "src/database/entities/post.entity";
import { UserEntity } from "src/database/entities/user.entity";

export const typeormConfig = (): TypeOrmModuleOptions => {
    return {
        url: process.env.DATABASE_URL,
        type: 'postgres',
        // logging: true,
        entities: [UserEntity, PostEntity, CommentEntity],
        synchronize:true
    }
};