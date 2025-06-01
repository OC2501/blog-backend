import { PostEntity } from "../../post/entities/post.entity";
import { BaseEntity } from "../../common/config/base.entity";
import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { UserEntity } from "../../users/entities/user.entity";


@Entity("likes")
export class LikeEntity extends BaseEntity {
    @ManyToOne(() => PostEntity, (post) => post.likes)
    @JoinColumn({ name: "post_id" })
    post: string;
    @ManyToOne(() => UserEntity, (user) => user.likes)
    @JoinColumn({ name: "user_id" })
    user: string;

}
