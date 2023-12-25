import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository, DataSource, EntityManager } from "typeorm";
import { CommentEntity } from "../entities/comment.entity";
import { PostEntity } from "../entities/post.entity";
import { UserEntity } from "../entities/user.entity";


@Injectable()
export class CommentRepository extends Repository<CommentEntity> {
    async deleteComment(postId: number, commentId: number) {
        const comment = await this.findOne({
            where: { comment_id: commentId, post: { post_id: postId } },
        });

        if (!comment) {
            throw new NotFoundException(`Comment with id ${commentId} not found for post with id ${postId}`);
        }
        await this.remove(comment);
    }
   
    constructor(private dataSource: DataSource, manager?: EntityManager) {
        super(CommentEntity, manager ?? dataSource.createEntityManager());
    }

    async getComments(postId: number): Promise<CommentEntity[]> {
        return this.find({ where: { post: { post_id: postId } } });
    }
    
    createComment(user:UserEntity,post:PostEntity, content: string): Promise<CommentEntity> {
        const newComment = this.create({
            comment_text: content,
            user: user,
            post: post,
        });
    
        return this.save(newComment);
    }
}