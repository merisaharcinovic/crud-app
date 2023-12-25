import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { PostEntity } from 'src/database/entities/post.entity';
import { CommentEntity } from 'src/database/entities/comment.entity';
import { UserEntity } from 'src/database/entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) { }
  

  @Get()
  async getAllUsers(): Promise<UserEntity[]> {
    return this.userService.getAll();
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() userData: CreateUserDto): Promise<{message: string, user: UserEntity}> {

    const createdUser = await this.userService.create(userData);
    return { message: 'User created successfully', user: createdUser };
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('id') id: number, @Body() userData: UpdateUserDto): Promise<{message: string, user: UserEntity}> {

    try {
      const updatedUser = await this.userService.update(id, userData);
      return { message: 'User updated successfully', user: updatedUser };

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async delete(@Param('id') id: number): Promise<{message: string, user: UserEntity}>{
    try {
      const updatedUser = await this.userService.delete(id);
      return { message: 'User deleted successfully', user: updatedUser };

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw error;
    }

  }

  @Get(':userId/comments')
  async getUserComments(@Param('userId') userId: number): Promise<{message: string, comments: CommentEntity[]}> {
    try {
      const comments = await this.userService.getUserComments(userId);
      return { message: `Comments for user: ${userId}`, comments: comments };

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }

  @Get(':userId/posts')
  async getUserPosts(@Param('userId') userId: number): Promise<{message: string, posts: PostEntity[]}>{
    try {
      const posts = await this.userService.getUserPosts(userId);
      return { message: `Posts for user: ${userId}`, posts: posts };

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }

  @Get(':userId/top-commented-posts')
  async getTopCommentedPosts(@Param('userId') userId: number): Promise<{message: string, posts: PostEntity[]}> {
    try {
      const posts = await this.userService.getTopCommentedPosts(userId);
      return { message: `Top 5 posts for user: ${userId}`, posts: posts };

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }

}
