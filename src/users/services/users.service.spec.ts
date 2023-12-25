import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserRepository } from '../../database/repositories/user.repository';
import { CommentEntity } from '../../database/entities/comment.entity';
import { PostEntity } from '../../database/entities/post.entity';
import { UserEntity } from '../../database/entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

describe('UsersService', () => {
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
    comments: [],
  };

  const mockPostEntity: PostEntity = {
    post_id: 0,
    content: 'post content',
    date: new Date(2024, 12),
    user: new UserEntity(),
    comments: [],
  };

  const mockCommentEntity: CommentEntity = {
    comment_id: 0,
    comment_text: 'comment text',
    date: new Date(2024, 12),
    user: new UserEntity(),
    post: new PostEntity(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: {
            getAll: jest.fn().mockImplementation(()=>[mockUserEntity]),
            createUser: jest.fn((mockCreateDto) => mockUserEntity),
            updateUser: jest.fn((id: number, mockUpdateDto)=>mockUserEntity),
            deleteUser: jest.fn((id: number) => mockUserEntity),
            getPosts: jest.fn((id: number)=> [mockPostEntity]),
            getComments: jest.fn((id:number)=>[mockCommentEntity]),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the same value as repository for getAll', () => {
    const allUsers = service.getAll();
    expect(allUsers).resolves.toEqual([mockUserEntity]);
  });

  it('should return the same value as repository for create', () => {
    const createdUser = service.create(mockCreateDto);
    expect(createdUser).resolves.toEqual(mockUserEntity);
  });

  it('should return the same value as repository for update', () => {
    const updatedUser = service.update(1, mockUpdateDto);
    expect(updatedUser).resolves.toEqual(mockUserEntity);
  });

  it('should return the same value as repository for delete', () => {
    const deletedUser = service.delete(1);
    expect(deletedUser).resolves.toEqual(mockUserEntity);
  });

  it('should return the same value as repository for getPosts', () => {
    const posts = service.getUserPosts(1);
    expect(posts).resolves.toEqual([mockPostEntity]);
  });

  it('should return the same value as repository for getComments', () => {
    const comments = service.getUserComments(1);
    expect(comments).resolves.toEqual([mockCommentEntity]);
  });

});
