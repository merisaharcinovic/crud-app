import { Module } from '@nestjs/common';
import { PostsController } from './controllers/posts.controller';
import { PostsService } from './services/posts.service';
import { PostRepository } from 'src/database/repositories/post.repository';
import { UserRepository } from 'src/database/repositories/user.repository';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PostRepository, UserRepository]
})
export class PostsModule {}
