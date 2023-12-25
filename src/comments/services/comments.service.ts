import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository } from '../../database/repositories/comment.repository';
import { CreateCommentDto } from '../dtos/create-comment.dto';
import { UserRepository } from '../../database/repositories/user.repository';
import { PostRepository } from '../../database/repositories/post.repository';
import { CommentEntity } from '../../database/entities/comment.entity';

@Injectable()
export class CommentsService {

    constructor(private commentRepository: CommentRepository, private userRepository: UserRepository, private postRepository: PostRepository) { }

    async createComment(postId: number, createCommentDto: CreateCommentDto): Promise<CommentEntity> {
        const id = createCommentDto.userId;
        const user = await this.userRepository.getUser(id);
        const post = await this.postRepository.getPost(postId);

        if (user && post) {
            return this.commentRepository.createComment(user, post, createCommentDto.comment_text);
        } else {
            throw new NotFoundException(`User with id ${id} or post with id ${postId} not found`);
        }
    }
   

    deleteComment(postId: number, commentId: number): Promise<void> {
        return this.commentRepository.deleteComment(postId, commentId);
    }
    

}
