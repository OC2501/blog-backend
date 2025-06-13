import { Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { ManagerError } from 'src/common/errors/manager.error';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LikeEntity } from './entities/like.entity';
import { PostService } from 'src/post/post.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LikesService {
   constructor(
    @InjectRepository(LikeEntity)
    private readonly LikeRepository: Repository<LikeEntity>,
    private readonly usersService: UsersService,
    private readonly postService: PostService
  ) {}

  async create(createLikeDto: CreateLikeDto,) {

    const {userId,postId,...rest}= createLikeDto;

    try {
      const user = await this.usersService.findOne(userId);
      if(!user){
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'User not found!',
        });
      }

      const posts = await this.postService.findOne(postId);
      if(!posts){
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Post not found!',
        });
      }

      const like = await this.LikeRepository.save({
        ...rest,
        posts: posts,
        user: user,
      });

      if (!like) {
        throw new ManagerError({
          type: 'CONFLICT',
          message: 'Like not created!',
        });
      }

      return like;
    } catch (error) {
     if(error instanceof ManagerError) throw error;
      throw ManagerError.createSignatureError(error.message);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;
    
      try {
      const [total, data] = await Promise.all([
        this.LikeRepository.count({ where: { isActive: true } }),
        this.LikeRepository
          .createQueryBuilder('likes')
          .where({ isActive: true })
          .leftJoinAndSelect('likes.user', 'user')
          .leftJoinAndSelect('likes.posts', 'posts')
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
      const like = await this.LikeRepository
        .createQueryBuilder('likes')
        .where({ id, isActive: true })
        .leftJoinAndSelect('likes.user', 'user')
        .leftJoinAndSelect('likes.posts', 'posts')
        .getOne();
      
      if (!like) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Like not found',
        });
      }
    
       return like;
    } catch (error) {
      if(error instanceof ManagerError) throw error;
      ManagerError.createSignatureError(error.message);
    }
  }

  async update(id: string, updateLikeDto: UpdateLikeDto,){
    try {
      const like = await this.LikeRepository.update(
        { id, isActive: true },
        updateLikeDto as Partial<LikeEntity>,
      );
      if (like.affected === 0) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Like not found',
        });
      }

      return like;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async remove(id: string) {
    try {
      const like = await this.LikeRepository.update(
        { id, isActive: true },
        { isActive: false },
      );
      if (like.affected === 0) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Like not found',
        });
      }

      
      return like;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }
}
