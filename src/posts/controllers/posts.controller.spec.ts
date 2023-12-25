import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { CommentEntity } from '../../database/entities/comment.entity';
import { PostEntity } from '../../database/entities/post.entity';
import { CreatePostDto } from '../dtos/create-post.dto';
import { PostsService } from '../services/posts.service';
import { UserEntity } from '../../database/entities/user.entity';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';


describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  const mockCreatePostDto: CreatePostDto = {
    content: 'Test Content',
    userId: 1,
  };

  const mockPostEntity: PostEntity = {
    post_id: 1,
    content: 'Test Content',
    user: new UserEntity, 
    comments: [],
    date: new Date(2024,11)
  };

  const mockCommentEntity: CommentEntity = {
    comment_id: 1,
    comment_text: 'Test Comment',
    user: new UserEntity,
    post: mockPostEntity,
    date: new Date(2024,11)
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: {
            createPost: jest.fn().mockImplementation((mockCreatePostDto)=>mockPostEntity),
            getAllPostComments: jest.fn().mockImplementation(()=>[mockPostEntity, mockPostEntity]),
            getPostComments: jest.fn().mockImplementation((id: number)=>[mockCommentEntity]),
            deletePost: jest.fn().mockImplementation((id:number)=>Promise<void>),
          },
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe(('create'), ()=>{

    it('should create a post successfully', async () => {
      const result = await controller.create(mockCreatePostDto);
  
      expect(result).toEqual({
        message: 'Post created successfully.',
        post: mockPostEntity,
      });
    });

    it('should throw NotFoundException when creating a post with invalid userId', async () => {
      jest.spyOn(service, 'createPost').mockRejectedValueOnce(new NotFoundException('User with id 999 not found'));
  
      try {
        await controller.create({ ...mockCreatePostDto, userId: 999 });
        fail('Expected NotFoundException but no exception was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });

  it('should get all posts with comments successfully', async () => {

    const result = await controller.getAllPostsComments();

    expect(result).toEqual({
      message: 'Post comments retrieved successfully.',
      posts: [mockPostEntity, mockPostEntity],
    });
  });

  describe(('getPostComments'), ()=>{

    it('should get post comments successfully', async () => {
      const result = await controller.getPostComments(1);
  
      expect(result).toEqual({
        message: 'Post comments retrieved successfully.',
        comments: [mockCommentEntity],
      });
    });
  
    it('should throw NotFoundException when getting post comments with invalid postId', async () => {
      jest.spyOn(service, 'getPostComments').mockRejectedValueOnce(new NotFoundException('Post with 999 not found'));
  
      try {
        await controller.getPostComments(999);
        fail('Expected NotFoundException but no exception was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  })

  describe(('deletePost'), ()=>{
    it('should delete a post successfully', async () => {  
      const result = await controller.deletePost(1);
  
      expect(result).toEqual({ message: 'Post deleted successfully' });
    });
  
    it('should throw NotFoundException when deleting a post with invalid postId', async () => {
      jest.spyOn(service, 'deletePost').mockRejectedValueOnce(new NotFoundException('Post with id 999 not found'));
  
      try {
        await controller.deletePost(999);
        fail('Expected NotFoundException but no exception was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  })






  


});
