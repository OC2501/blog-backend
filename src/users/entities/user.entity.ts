import { UserRole } from "../../common/enums/roles";
import { BaseEntity } from "../../common/config/base.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { PostEntity } from "../../post/entities/post.entity";
import { CommentEntity } from "../../comment/entities/comment.entity";
import { LikeEntity } from "../../likes/entities/like.entity";



@Entity('users')
export class UserEntity extends BaseEntity {
      
      @Column({ type: 'varchar', length: 255})
      name: string;

      @Column({ type: 'varchar', length: 255})
      email: string;

      @Column({ type: 'varchar', length: 255})
      password: string;

      @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
      role: UserRole = UserRole.USER;
    
      @Column({ type: 'varchar', length: 255 })
      bio: string;
      
      @Column({ type: 'varchar', length: 255 })
      position: string;
      
      @Column({ type: 'varchar', length: 255 })
      department: string;
      
      @Column({ type: 'varchar', length: 255, nullable: true })
      avatar: string;
      
      @Column({ type: 'varchar', length: 255, nullable: true })
      facebook: string;
      
      @Column({ type: 'varchar', length: 255, nullable: true })
      twitter: string;
      
      @Column({ type: 'varchar', length: 255, nullable: true })
      instagram: string;
      
      @Column({ type: 'varchar', length: 255, nullable: true })
      linkedin: string;

      @OneToMany(() => PostEntity, (post) => post.user)
      post: PostEntity[];

      @OneToMany(() => CommentEntity, (comment) => comment.user)
      comments: CommentEntity[];

      @OneToMany(() => LikeEntity, (like) => like.user)
      likes: LikeEntity[];

}
