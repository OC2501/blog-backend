import { Entity, Column,ManyToMany } from 'typeorm';
import { BaseEntity } from '../../common/config/base.entity';
import { PostEntity } from '../../post/entities/post.entity';


@Entity( 'categories')
export class CategoryEntity extends BaseEntity {
    @Column({ type: 'varchar', length: 100, unique: true })
    name: string;
    @Column({ type: 'text', nullable: true })
    description: string;
    @Column({ type: 'varchar', length: 255, nullable: true })
    slug: string;

    @ManyToMany(()=> PostEntity, post => post.category,)
    posts: PostEntity[];
    
    
}
