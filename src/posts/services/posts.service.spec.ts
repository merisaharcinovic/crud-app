import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { CommentEntity } from '../../database/entities/comment.entity';
import { PostEntity } from '../../database/entities/post.entity';
import { PostRepository } from '../../database/repositories/post.repository';
import { UserRepository } from '../../database/repositories/user.repository';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UserEntity } from '../../database/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('PostsService', () => {
  let service: PostsService;
  let userRepository: UserRepository;
  let postRepository: PostRepository;

  const mockCreatePostDto: CreatePostDto = {
    content: 'Test Content',
    userId: 1,
  };

  const mockUserEntity: UserEntity = {
    id: 1,
    username: 'testuser',
    email: 'test@mail.com',
    password: 'test1234',
    posts: [],
    comments: []
  };

const mockPostEntity: PostEntity = {
  post_id: 1,
  content: 'Test Content',
  user: mockUserEntity,
  comments: [], 
  date: new Date(2024, 11),
};

const mockCommentEntity: CommentEntity = {
  comment_id: 1,
  comment_text: 'Test Comment',
  user: mockUserEntity,
  post: mockPostEntity, 
  date: new Date(2024, 11),
};

mockPostEntity.comments = [mockCommentEntity];
  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: UserRepository,
          useValue: {
            getUser: jest.fn().mockImplementation((userId) =>
              userId === mockUserEntity.id ? mockUserEntity : null,
            ),
          },
        },
        {
          provide: PostRepository,
          useValue: {
            createPost: jest.fn().mockImplementation((mockCreatePostDto, mockUserEntity) => mockPostEntity),
            getAllPostsComments: jest.fn().mockImplementation(() => [mockPostEntity, mockPostEntity]),
            getPostComments: jest.fn().mockImplementation((postId) =>
              postId === mockPostEntity.post_id ? mockPostEntity : null,
            ),
            deletePost: jest.fn().mockImplementation((postId) => Promise<void>),
          },
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    userRepository = module.get<UserRepository>(UserRepository);
    postRepository = module.get<PostRepository>(PostRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPost', () => {
    it('should create a post successfully', async () => {
      const result = await service.createPost(mockCreatePostDto);

      expect(result).toEqual(mockPostEntity);
    });

    it('should throw NotFoundException when creating a post with invalid userId', async () => {
      jest.spyOn(userRepository, 'getUser').mockResolvedValueOnce(null);

      try {
        await service.createPost({ ...mockCreatePostDto, userId: 999 })
        fail('Expected NotFoundException but no exception was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  it('should get all posts with comments successfully', async () => {
    const result = await service.getAllPostComments();

    expect(result).toEqual([mockPostEntity, mockPostEntity]);
  });

  describe('getPostComments', () => {
    it('should get post comments successfully', async () => {
      const result = await service.getPostComments(1);

      expect(result).toEqual([mockCommentEntity]);
    });

    it('should throw NotFoundException when getting post comments with invalid postId', async () => {
      jest.spyOn(postRepository, 'getPostComments').mockResolvedValueOnce(null);

      try {
        await service.getPostComments(999);
        fail('Expected NotFoundException but no exception was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe(('deletePost'), ()=>{

    it('should delete a post successfully', async () => {
      await expect(service.deletePost(1)).resolves.toEqual(Promise<void>)
    });

    it('should throw NotFoundException when deleting a post with invalid postId', async () => {
      jest.spyOn(postRepository, 'deletePost').mockRejectedValue(new NotFoundException);

      try {
        await service.deletePost(999);
        fail('Expected NotFoundException but no exception was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  })

  


});
