import { Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, Post, Query, UseGuards } from '@nestjs/common';
import { PostsService } from '../services/posts.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { PostEntity } from '../../database/entities/post.entity';
import { CommentEntity } from '../../database/entities/comment.entity';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { PaginationParamsDto } from '../dtos/pagination-params.dto';
import { PaginatedResponseDto } from '../dtos/paginated-response.dto';

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
    async getAllPostsComments(@Query() params: PaginationParamsDto) :  Promise<{message: string, paginatedResponse: PaginatedResponseDto<PostEntity>}>{
        try {

            const [posts, total] = await this.postService.getAllPostComments(params);

            const paginatedResponse: PaginatedResponseDto<PostEntity> = {
                _meta: {
                    page: params.page,
                    per_page: params.per_page,
                    total: total,
                },
                list: posts,
            };
            return { message: 'Posts retrieved successfully.', paginatedResponse: paginatedResponse };

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

    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.Admin)
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
