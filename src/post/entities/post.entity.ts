
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/config/base.entity';
import { CategoryEntity } from '../../category/entities/category.entity';
import { TagEntity } from '../../tags/entities/tag.entity';
import { CommentEntity } from '../../comment/entities/comment.entity';
import { LikeEntity } from '../../likes/entities/like.entity';
import { Status } from '../../common/enums/status';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('posts')
export class PostEntity extends BaseEntity {
  
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  slug: string;
 
  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'enum', enum: Status, default: Status.PUBLISHED })
  status: Status;

  @Column({ type: 'timestamp'})
  publishedAt: Date;

  @Column({ type: 'varchar', length: 255 })
  excerpt: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  featuredimage: string;

  @Column({ type: 'int', nullable: true })
  viewcount: number;

  @ManyToMany(()=> CategoryEntity, category => category.posts)
  category: CategoryEntity[];

  @ManyToMany(() => TagEntity, tag => tag.posts)
  tags: TagEntity[];

  @OneToMany(() => CommentEntity, comment => comment.post, { cascade: true })
  comments: CommentEntity[];
   
  @OneToMany(() => LikeEntity, like => like.post)
  likes: LikeEntity[];

  @ManyToOne(() => UserEntity, user => user.posts)
  @JoinColumn({ name: 'userId' })
  user: string;

}

