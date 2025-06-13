import { PostEntity } from "../../post/entities/post.entity";
import { BaseEntity } from "../../common/config/base.entity";
import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { UserEntity } from "../../users/entities/user.entity";


@Entity("likes")
export class LikeEntity extends BaseEntity {
    @ManyToOne(() => PostEntity, (posts) => posts.likes)
    @JoinColumn({ name: "post_id" })
    posts: PostEntity;
    @ManyToOne(() => UserEntity, (user) => user.likes)
    @JoinColumn({ name: "user_id" })
    user: UserEntity;

}
