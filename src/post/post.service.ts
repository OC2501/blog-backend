import { HttpStatus, Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { ManagerError } from 'src/common/errors/manager.error';


@Injectable()
export class PostService {
   constructor(
    @InjectRepository(PostEntity)
    private readonly PostRepository: Repository<PostEntity>,
  ) {}

  async create(createPostDto: CreatePostDto,) {
    try {
      const post = await this.PostRepository.save(createPostDto);

      if (!post) {
        throw new ManagerError({
          type: 'CONFLICT',
          message: 'Post not created!',
        });
      }

      return post;
    } catch (error) {
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
          .createQueryBuilder('post')
          .where({ isActive: true })
          .leftJoinAndSelect('post.category', 'category')
          .leftJoinAndSelect('post.tags', 'tags')
          .leftJoinAndSelect('post.comment_id', 'comment')
          .leftJoinAndSelect('post.like_id', 'like')
          .leftJoinAndSelect('post.user', 'user')
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
        .createQueryBuilder('product')
        .where({ id, isActive: true })
        .leftJoinAndSelect('post.category', 'category')
        .leftJoinAndSelect('post.tags', 'tags')
        .leftJoinAndSelect('post.comment_id', 'comment')
        .leftJoinAndSelect('post.like_id', 'like')
        .leftJoinAndSelect('post.user', 'user')
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
