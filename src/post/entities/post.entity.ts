
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

  @ManyToMany(()=> CategoryEntity, category => category.post)
   @JoinTable({
    name: 'posts_categories', // nombre de la tabla intermedia
    joinColumn: { name: 'postId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' }
  })
  category: CategoryEntity[];

  @ManyToMany(() => TagEntity, tag => tag.post)
  @JoinTable({
    name: 'posts_tags', // nombre de la tabla intermedia
    joinColumn: { name: 'postId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' }
  })
  tags: TagEntity[];

  @OneToMany(() => CommentEntity, comment => comment.post, { cascade: true })
  comments: CommentEntity[];

  @ManyToOne(() => UserEntity, user => user.post)
  @JoinColumn({ name: 'userId' })
  user: string; 
   
  @OneToMany(() => LikeEntity, like => like.post)
  likes: LikeEntity[];

}

