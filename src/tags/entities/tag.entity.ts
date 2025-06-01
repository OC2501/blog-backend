import { PostEntity } from "../../post/entities/post.entity";
import { BaseEntity } from "../../common/config/base.entity";
import { Entity, Column, ManyToMany } from "typeorm";


@Entity('tags')
export class TagEntity extends BaseEntity {
    @Column({ type: 'varchar', length: 255 })
    name: string;
    
    @Column({ type: 'varchar', length: 255, unique: true })
    slug: string;
    
    @ManyToMany(() => PostEntity, post => post.tags)
    posts: PostEntity[];
}


  
