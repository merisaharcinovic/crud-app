import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from '../services/comments.service';
import { CreateCommentDto } from '../dtos/create-comment.dto';
import { CommentEntity } from '../../database/entities/comment.entity';
import { PostEntity } from '../../database/entities/post.entity';
import { UserEntity } from '../../database/entities/user.entity';
import { NotFoundException, HttpException, HttpStatus } from '@nestjs/common';

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService;

  const mockCreateCommentDto: CreateCommentDto = {
    comment_text: 'Test Comment',
    userId: 0
  };

  const mockCommentEntity: CommentEntity = {
    comment_id: 1,
    comment_text: 'Test Comment',
    date: new Date(2024, 11),
    user: new UserEntity,
    post: new PostEntity
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: {
            createComment: jest.fn().mockImplementation((postId, mockCreateCommentDto)=>mockCommentEntity),
            deleteComment: jest.fn().mockImplementation((postId, commentId)=>Promise<void>)
          },
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createComment', () => {
    it('should create a comment successfully', async () => {
      const result = await controller.createComment(1, mockCreateCommentDto);

      expect(result).toEqual({
        message: 'Comment created successfully', 
        comment: mockCommentEntity,});
    });

    it('should throw NotFoundException when creating a comment with invalid postId', async () => {
      jest.spyOn(service, 'createComment').mockRejectedValueOnce(new NotFoundException());

      try {
        await controller.createComment(999, mockCreateCommentDto);
        fail('Expected NotFoundException but no exception was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment successfully', async () => {
      const result = await controller.deleteComment(1, 1);

      expect(result).toEqual({ message: 'Comment deleted successfully' });
    });

    it('should throw NotFoundException when deleting a comment with invalid commentId or postId', async () => {
      jest.spyOn(service, 'deleteComment').mockRejectedValueOnce(new NotFoundException());

      try {
        await controller.deleteComment(1, 999);
        fail('Expected NotFoundException but no exception was thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });


});
