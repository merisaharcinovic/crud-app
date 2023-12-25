import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../database/repositories/user.repository';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserEntity } from '../../database/entities/user.entity';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { CommentEntity } from '../../database/entities/comment.entity';
import { PostEntity } from '../../database/entities/post.entity';

@Injectable()
export class UsersService {
 
  constructor(private userRepository: UserRepository) { }

  validateUser(email: string): Promise<UserEntity> {
    return this.userRepository.validateUser(email);
  }

  async getAll(): Promise<UserEntity[]> {
    return this.userRepository.getAll();
  }

  async create(userData: CreateUserDto): Promise<UserEntity> {
    return this.userRepository.createUser(userData);
  }

  async update(id: number, userData: UpdateUserDto): Promise<UserEntity> {
    return this.userRepository.updateUser(id, userData);
  }

  async delete(id: number): Promise<UserEntity> {
    return this.userRepository.deleteUser(id);
  }
  
  async getUserPosts(userId: number): Promise<PostEntity[]> {
    return this.userRepository.getPosts(userId);
  }
  async getUserComments(userId: number): Promise<CommentEntity[]> {
    return this.userRepository.getComments(userId);
  }

  async getTopCommentedPosts(userId: number): Promise<PostEntity[]> {
    return this.userRepository.getTopCommentedPosts(userId);
  }
  



}
