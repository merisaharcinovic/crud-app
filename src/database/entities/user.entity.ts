import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CommentEntity } from "./comment.entity";
import { PostEntity } from "./post.entity";

@Entity('users')
export class UserEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    role: string;

    @OneToMany(() => PostEntity, post => post.user)
    posts: PostEntity[];

    @OneToMany(() => CommentEntity, comment => comment.user)
    comments: CommentEntity[];
}