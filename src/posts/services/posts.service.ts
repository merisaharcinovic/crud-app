import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { PostRepository } from '../../database/repositories/post.repository';
import { UserRepository } from '../../database/repositories/user.repository';
import { CommentEntity } from '../../database/entities/comment.entity';
import { PostEntity } from '../../database/entities/post.entity';

@Injectable()
export class PostsService {
   
    constructor(private postRepository: PostRepository, private userRepository: UserRepository) {}

    async createPost(postData: CreatePostDto): Promise<PostEntity>{
        const user = await this.userRepository.getUser(postData.userId);

        if (user) {
            return this.postRepository.createPost(postData, user);
        } else {
            throw new NotFoundException(`User with id ${postData.userId} not found`);
        }
    }

    getAllPostComments(): Promise<PostEntity[]> {
        return this.postRepository.getAllPostsComments();
    }

    async getPostComments(postId: number): Promise<CommentEntity[]> {
        const post = await this.postRepository.getPostComments(postId);

        if (!post) {
            throw new NotFoundException(`Post with id ${postId} not found`);
        }

        return post.comments;
    }


    async deletePost(postId: number): Promise<void> {
        return this.postRepository.deletePost(postId);
    }
    
}
