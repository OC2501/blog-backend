import { Entity, JoinColumn, OneToMany } from "typeorm";
import { BaseEntity } from "../../common/config/base.entity";
import { Column, ManyToOne } from "typeorm";
import { PostEntity } from "../../post/entities/post.entity";
import { UserEntity } from "../../users/entities/user.entity";


@Entity('comments')
export class CommentEntity extends BaseEntity {
    @Column('text')
    content: string;
    @ManyToOne(()=> PostEntity, post => post.comments,)
    @JoinColumn({ name: 'post_id' })
    post: string;

    @ManyToOne(()=> UserEntity, user => user.comments,)
    @JoinColumn({ name: 'user_id' })
    user: string;

}
