import { DataSource, EntityManager, Repository } from "typeorm";
import { UserEntity } from "../entities/user.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "src/users/dtos/create-user.dto";
import { UpdateUserDto } from "src/users/dtos/update-user.dto";
import { CommentEntity } from "../entities/comment.entity";
import { PostEntity } from "../entities/post.entity";


@Injectable()
export class UserRepository extends Repository<UserEntity> {

    constructor(private dataSource: DataSource, manager?: EntityManager) {
        super(UserEntity, manager ?? dataSource.createEntityManager());
    }

    async validateUser(email: string): Promise<UserEntity> {
        const user = await this.findOne({ where: { email: email} })
        return user
    }


    async getAll(): Promise<UserEntity[]> {
        const result: UserEntity[] = await this.find();
        return result;
    }

    async getComments(userId: number): Promise<CommentEntity[]> {
        const user = await this.findOne({ where: { id: userId }, relations: ['comments'] });

        if (!user) {
            throw new NotFoundException(`User with id: ${userId} not found.`);
        }

        return user.comments;
    }

    async getPosts(userId: number): Promise<PostEntity[]> {
        const user = await this.findOne({ where: { id: userId }, relations: ['posts'] });

        if (!user) {
            throw new NotFoundException(`User with id: ${userId} not found.`);
        }

        return user.posts;
    }

    async getTopCommentedPosts(userId: number) {
        const query = await this.createQueryBuilder()
            .select('p.*, COUNT(DISTINCT(c.comment_id)) as comment_count')
            .from('posts', 'p')
            .leftJoin('p.user', 'u')
            .leftJoin('p.comments', 'c')
            .where('u.id = :id', { id: userId })
            .groupBy('p.post_id')
            .orderBy('comment_count', 'DESC')
            .limit(5)
            .getRawMany();
        console.log("This is query:")
        console.log(query)
        return query;
    }


    async createUser(userData: CreateUserDto): Promise<UserEntity> {
        const newUser = this.create(userData);
        const createdUser = this.save(newUser);
        return createdUser;
    }

    async updateUser(_id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
        const user = await this.findOne({ where: { id: _id } });

        if (!user) {
            throw new NotFoundException(`User with id: ${_id} not found`);
        }

        if (updateUserDto.username && updateUserDto.email) {
            await this.update(_id, {
                username: updateUserDto.username,
                email: updateUserDto.email,
            });

            return this.findOne({ where: { id: _id } });
        }

        if (updateUserDto.username) {
            user.username = updateUserDto.username;
        }

        if (updateUserDto.email) {
            user.email = updateUserDto.email;
        }

        return this.save(user);

    }

    async deleteUser(_id: number): Promise<UserEntity> {
        const user = await this.findOne({ where: { id: _id } });

        if (!user) {
            throw new NotFoundException(`User with id ${_id} not found`);
        }

        return this.remove(user);
    }

    async getUser(_id: number): Promise<UserEntity> {
        const existingUser = await this.findOne({ where: { id: _id } });
        return existingUser;
    }


}