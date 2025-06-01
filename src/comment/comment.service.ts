import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ManagerError } from 'src/common/errors/manager.error';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from './entities/comment.entity';

@Injectable()
export class CommentService {
constructor(
    @InjectRepository(CommentEntity)
    private readonly CommentRepository: Repository<CommentEntity>,
  ) {}

  async create(createCommentDto: CreateCommentDto,) {
    try {
      const comment = await this.CommentRepository.save(createCommentDto as Partial<CommentEntity>);

      if (!comment) {
        throw new ManagerError({
          type: 'CONFLICT',
          message: 'Comment not created!',
        });
      }

      return comment;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;
    
      try {
      const [total, data] = await Promise.all([
        this.CommentRepository.count({ where: { isActive: true } }),
        this.CommentRepository
          .createQueryBuilder('comment')
          .where({ isActive: true })
          .leftJoinAndSelect('comment.post', 'post')
          .leftJoinAndSelect('comment.user', 'user')
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
      const comment = await this.CommentRepository
        .createQueryBuilder('product')
        .where({ id, isActive: true })
        .leftJoinAndSelect('Comment.user', 'user')
        .leftJoinAndSelect('Comment.post', 'post')
        .getOne();
      
      if (!comment) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Comment not found',
        });
      }
    
       return comment;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async update(id: string, updateCommentDto: UpdateCommentDto,){
    try {
      const comment = await this.CommentRepository.update(
        { id, isActive: true },
        updateCommentDto,
      );
      if (comment.affected === 0) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Comment not found',
        });
      }

      return comment;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async remove(id: string) {
    try {
      const comment = await this.CommentRepository.update(
        { id, isActive: true },
        { isActive: false },
      );
      if (comment.affected === 0) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Comment not found',
        });
      }

      
      return comment;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }
}
