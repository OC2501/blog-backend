
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' , nullable: false })
  publishedAt: Date;

  @Column({ type: 'varchar', length: 255 })
  excerpt: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  featuredimage: string;

  @Column({ type: 'int', default: 0 })
  viewcount: number;

  @ManyToMany(()=> CategoryEntity, category => category.posts)
   @JoinTable({
    name: 'posts_categories', // nombre de la tabla intermedia
    joinColumn: { name: 'post_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' }
  })
  categories: CategoryEntity[];

  @ManyToMany(() => TagEntity, tag => tag.post)
  @JoinTable({
    name: 'posts_tags', // nombre de la tabla intermedia
    joinColumn: { name: 'post_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' }
  })
  tags: TagEntity[];

  @OneToMany(() => CommentEntity, comments => comments.posts)
  comments: CommentEntity[];

  @ManyToOne(() => UserEntity, user => user.posts)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity; 
   
  @OneToMany(() => LikeEntity, likes => likes.posts)
  likes: LikeEntity[];

}

