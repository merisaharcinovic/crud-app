import { Module } from '@nestjs/common';
import { CommentsController } from './controllers/comments.controller';
import { CommentsService } from './services/comments.service';
import { CommentRepository } from 'src/database/repositories/comment.repository';
import { UserRepository } from 'src/database/repositories/user.repository';
import { PostRepository } from 'src/database/repositories/post.repository';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, CommentRepository, UserRepository, PostRepository]
})
export class CommentsModule {}
