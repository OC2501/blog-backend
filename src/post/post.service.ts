import { HttpStatus, Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { ManagerError } from 'src/common/errors/manager.error';
import { UsersService } from 'src/users/users.service';
import { CategoriesService } from 'src/category/category.service';
import { TagsService } from 'src/tags/tags.service';
import { TagEntity } from 'src/tags/entities/tag.entity';
import { CategoryEntity } from 'src/category/entities/category.entity';


@Injectable()
export class PostService {
   constructor(
    @InjectRepository(PostEntity)
    private readonly PostRepository: Repository<PostEntity>,
    private readonly usersService: UsersService,
    private readonly categoriesService: CategoriesService,
    private readonly tagsService: TagsService,
  ) {}

  async create(createPostDto: CreatePostDto,) {
    const { categoryId, tagId, userId, ...rest } = createPostDto;
    
    try {
      const user = await this.usersService.findOne(userId);
      if(!user){
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'User not found!',
        });
      }
      
      const categoryDraff: CategoryEntity[] = []
      for(let catgoryItem of categoryId){
        const category = await this.categoriesService.findOne(catgoryItem);
        if(!category?.data){
          throw new ManagerError({
            type: 'NOT_FOUND',
            message: 'Category not found!',
          });
        }
        categoryDraff.push(category.data)
      }
      
      const tagsDraff: TagEntity[] = []

      for(let tagItem of tagId){
        const tag = await this.tagsService.findOne(tagItem);
        if(!tag?.data){
          throw new ManagerError({
            type: 'NOT_FOUND',
            message: 'tags not found!',
          });
        }

        tagsDraff.push( tag.data )
      }

      
      const post = await this.PostRepository.save({
        ...rest,
        user: user,
        tags: tagsDraff,
        categories: categoryDraff,
      });


      if (!post) {
        throw new ManagerError({
          type: 'CONFLICT',
          message: 'Post not created!',
        });
      }

      return post;
    } catch (error) {
      if(error instanceof ManagerError) throw error;
      ManagerError.createSignatureError(error.message);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;
    
      try {
      const [total, data] = await Promise.all([
        this.PostRepository.count({ where: { isActive: true } }),
        this.PostRepository
          .createQueryBuilder('posts')
          .where({ isActive: true })
          .leftJoinAndSelect('posts.categories', 'categories')
          .leftJoinAndSelect('posts.tags', 'tags')
          .leftJoinAndSelect('posts.comments', 'comments')
          .leftJoinAndSelect('posts.likes', 'likes')
          .leftJoinAndSelect('posts.user', 'user')
          .take(limit)
          .skip(skip)
          .getMany(),
      ]);

      const lastPage = Math.ceil(total / limit);

      return {
        data,
        total,
        page,
        limit,
        lastPage,
      };
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  

  async findOne(id: string) {
    try {
      const post = await this.PostRepository
        .createQueryBuilder('posts')
        .where({ id, isActive: true })
        .leftJoinAndSelect('posts.categories', 'categories')
        .leftJoinAndSelect('posts.tags', 'tags')
        .leftJoinAndSelect('posts.comments', 'comments')
        .leftJoinAndSelect('posts.likes', 'likes')
        .leftJoinAndSelect('posts.user', 'user')
        .getOne();
      
      if (!post) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Post not found',
        });
      }
    
       return post;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async update(id: string, updatePostDto: UpdatePostDto,){
    try {
      const post = await this.PostRepository.update(
        { id, isActive: true },
        updatePostDto,
      );
      if (post.affected === 0) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Post not found',
        });
      }

      return post;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async remove(id: string) {
    try {
      const post = await this.PostRepository.update(
        { id, isActive: true },
        { isActive: false },
      );
      if (post.affected === 0) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Post not found',
        });
      }

      
      return post;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }
}
