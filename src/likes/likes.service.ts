import { Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { ManagerError } from 'src/common/errors/manager.error';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LikeEntity } from './entities/like.entity';

@Injectable()
export class LikesService {
   constructor(
    @InjectRepository(LikeEntity)
    private readonly LikeRepository: Repository<LikeEntity>,
  ) {}

  async create(createLikeDto: CreateLikeDto,) {
    try {
      const like = await this.LikeRepository.save(createLikeDto as Partial<LikeEntity>);

      if (!like) {
        throw new ManagerError({
          type: 'CONFLICT',
          message: 'Like not created!',
        });
      }

      return like;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;
    
      try {
      const [total, data] = await Promise.all([
        this.LikeRepository.count({ where: { isActive: true } }),
        this.LikeRepository
          .createQueryBuilder('Like')
          .where({ isActive: true })
          .leftJoinAndSelect('Like.post', 'post')
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
        .createQueryBuilder('product')
        .where({ id, isActive: true })
        .leftJoinAndSelect('Like.category', 'category')
        .leftJoinAndSelect('Like.tags', 'tags')
        .leftJoinAndSelect('Like.comment_id', 'comment')
        .getOne();
      
      if (!like) {
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
