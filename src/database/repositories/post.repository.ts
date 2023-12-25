import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository, DataSource, EntityManager } from "typeorm";
import { PostEntity } from "../entities/post.entity";
import { CreatePostDto } from "src/posts/dtos/create-post.dto";
import { UserEntity } from "../entities/user.entity";

@Injectable()
export class PostRepository extends Repository<PostEntity> {

    constructor(private dataSource: DataSource, manager?: EntityManager) {
        super(PostEntity, manager ?? dataSource.createEntityManager());
    }

    async createPost(postData: CreatePostDto, user: UserEntity): Promise<PostEntity> {
        const newPost = this.create({
            content: postData.content,
            user: user,
        });

        return this.save(newPost);
    }
    async getPost(_id: number): Promise<PostEntity> {
        const post = await this.findOne({ where: { post_id: _id } });
        return post;
    }

    async getAllPostsComments(): Promise<PostEntity[]> {
        return this.find({ relations: ['comments', 'comments.user'] });
    }

    async getPostComments(postId: number): Promise<PostEntity> {
        const post = await this.findOne({ where: { post_id: postId }, relations: ['comments', 'comments.user'] });
        return post;
    }

    async deletePost(postId: number): Promise<void> {
        const post = await this.findOne({ where: { post_id: postId } });

        if (!post) {
            throw new NotFoundException(`Post with id ${postId} not found`);
        }
        await this.remove(post);
    }
}