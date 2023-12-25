import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { UserEntity } from "./user.entity";
import { CommentEntity } from "./comment.entity";

@Entity('posts')
export class PostEntity{
    @PrimaryGeneratedColumn()
    post_id: number;

    @Column()
    content: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date: Date;

    @ManyToOne(() => UserEntity, user => user.posts, { onDelete: "CASCADE" })
    user: UserEntity;

    @OneToMany(() => CommentEntity, comment => comment.post)
    comments: CommentEntity[];

    
}