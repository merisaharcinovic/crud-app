import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { UserEntity } from "./user.entity";
import { PostEntity } from "./post.entity";

@Entity('comments')
export class CommentEntity{
    @PrimaryGeneratedColumn()
    comment_id: number;

    @Column()
    comment_text: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date: Date;

    @ManyToOne(() => UserEntity, user => user.comments, { onDelete: "CASCADE" })
    user: UserEntity;
    
    @ManyToOne(() => PostEntity, post => post.comments, { onDelete: "CASCADE" })
    post: PostEntity;
}