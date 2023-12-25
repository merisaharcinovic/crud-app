import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserEntity } from '../../database/entities/user.entity';
import { PostEntity } from '../../database/entities/post.entity';
import { CommentEntity } from '../../database/entities/comment.entity';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockCreateDto: CreateUserDto = {
    username: 'test',
    password: 'test123',
    email: 'test@gmail.com',
  };

  const mockUpdateDto: UpdateUserDto = {
    username: 'test',
    email: 'test@gmail.com',
  };

  const mockUserEntity: UserEntity = {
    username: 'test',
    email: 'test@gmail.com',
    id: 0,
    password: '',
    posts: [],
    comments: []
  };

  const mockPostEntity: PostEntity = {
    post_id: 0,
    content: 'post content',
    date: new Date(2024, 12),
    user: new UserEntity,
    comments: []
  };

  const mockCommentEntity: CommentEntity = {
    comment_id: 0,
    comment_text: 'comment text',
    date: new Date(2024, 12),
    user: new UserEntity,
    post: new PostEntity
  }



  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getAll: jest.fn().mockImplementation(() => [mockUserEntity, mockUserEntity]),
            create: jest.fn().mockImplementation((createUserDto) => mockUserEntity),
            update: jest.fn().mockImplementation((updateUserDto) => mockUserEntity),
            delete: jest.fn().mockImplementation((id) => mockUserEntity),
            getUserPosts: jest.fn().mockImplementation((id) => [mockPostEntity, mockPostEntity]),
            getUserComments: jest.fn().mockImplementation((id) => [mockCommentEntity]),
          }
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);

  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the same value as service for getAll', () => {
    const allUsers = controller.getAllUsers();
    expect(allUsers).resolves.toEqual([mockUserEntity, mockUserEntity]);
  });

  it('should return successful message and created user', () => {
    const createUser = controller.create(mockCreateDto);
    expect(createUser).resolves.toEqual({ message: 'User created successfully', user: mockUserEntity });
  });


  describe('update', () => {

    it('should return successful message and updated user', () => {
      const updateUser = controller.update(1, mockUpdateDto);
      expect(updateUser).resolves.toEqual({ message: 'User updated successfully', user: mockUserEntity });
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException);

      try {
        await controller.update(1, mockUpdateDto);
        fail('Expected NotFoundException but no exception was thrown');
      } catch (error) {
        expect(error).toThrow(HttpException);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });

  describe('delete', () => {
    it('should return successful message and deleted user', () => {
      const deleteUser = controller.delete(1);
      expect(deleteUser).resolves.toEqual({ message: 'User deleted successfully', user: mockUserEntity });
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(service, 'delete').mockRejectedValue(new NotFoundException);

      try {
        await controller.delete(1);
        fail('Expected NotFoundException but no exception was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  })

  describe('getUserPosts', () => {
    it('should return the message and posts', () => {
      const posts = controller.getUserPosts(1);
      expect(posts).resolves.toEqual({ message: `Posts for user: 1`, posts: [mockPostEntity, mockPostEntity] });
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(service, 'getUserPosts').mockRejectedValue(new NotFoundException);

      try {
        await controller.getUserPosts(1);
        fail('Expected NotFoundException but no exception was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });

  })


  describe('getUserComments', () => {
    it('should return the message and comments', () => {
      const posts = controller.getUserComments(1);
      expect(posts).resolves.toEqual({ message: `Comments for user: 1`, comments: [mockCommentEntity] });
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(service, 'getUserComments').mockRejectedValue(new NotFoundException);

      try {
        await controller.getUserComments(1);
        fail('Expected NotFoundException but no exception was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });

  })

});
