import { Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { PostsService } from '../services/posts.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { PostEntity } from '../../database/entities/post.entity';
import { CommentEntity } from '../../database/entities/comment.entity';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('posts')
export class PostsController {
    constructor(private postService:PostsService) {}

    @UseGuards(JwtGuard)
    @Post()
    async create(@Body() postData: CreatePostDto) : Promise<{message: string, post: PostEntity}>{
        try {
            const createdPost = await this.postService.createPost(postData);
            return { message: 'Post created successfully.', post: createdPost };

        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new HttpException(error.message, HttpStatus.NOT_FOUND);
            }
            throw error;
        }
    }

    @Get()
    async getAllPostsComments() :  Promise<{message: string, posts: PostEntity[]}>{
        try {
            const posts = await this.postService.getAllPostComments();
            return { message: 'Post comments retrieved successfully.', posts: posts };

        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new HttpException(error.message, HttpStatus.NOT_FOUND);
            }
            throw error;
        }
    }

    @Get(':postId/comments')
    async getPostComments(@Param('postId') postId: number):  Promise<{message: string, comments: CommentEntity[]}>  {
        try {
            const postComments = await this.postService.getPostComments(postId);
            return { message: 'Post comments retrieved successfully.', comments: postComments };

        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new HttpException(error.message, HttpStatus.NOT_FOUND);
            }
            throw error;
        }
    }

    
    @Delete(':postId')
    async deletePost(@Param('postId') postId: number): Promise<{message: string}> {
        try {
            await this.postService.deletePost(postId);
            return { message: 'Post deleted successfully' };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new HttpException(error.message, HttpStatus.NOT_FOUND);
            }
            throw error;
        }
    }
}
