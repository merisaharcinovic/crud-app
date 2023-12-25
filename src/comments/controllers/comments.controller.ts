import { Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, Post } from '@nestjs/common';
import { CommentsService } from '../services/comments.service';
import { CreateCommentDto } from '../dtos/create-comment.dto';
import { CommentEntity } from '../../database/entities/comment.entity';

@Controller('posts/:postId/comments')
export class CommentsController {
    constructor(private commentService: CommentsService) { }

    @Post()
    async createComment(@Param('postId') postId: number, @Body() createCommentDto: CreateCommentDto) : Promise<{message:string, comment: CommentEntity}>{
        try {
            const createdComment = await this.commentService.createComment(postId, createCommentDto);
            return { message: 'Comment created successfully', comment: createdComment };

        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new HttpException(error.message, HttpStatus.NOT_FOUND);
            }
            throw error;
        }
    }

    @Delete(':commentId')
    async deleteComment(@Param('postId') postId: number, @Param('commentId') commentId: number): Promise<{message:string}> {
        try {
            await this.commentService.deleteComment(postId, commentId);
            return { message: 'Comment deleted successfully' };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new HttpException(error.message, HttpStatus.NOT_FOUND);
            }
            throw error;
        }
    }
}


