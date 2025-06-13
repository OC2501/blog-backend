import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ManagerError } from 'src/common/errors/manager.error';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from './entities/comment.entity';
import { UsersService } from 'src/users/users.service';
import { PostService } from 'src/post/post.service';

@Injectable()
export class CommentService {
constructor(
    @InjectRepository(CommentEntity)
    private readonly CommentRepository: Repository<CommentEntity>,
    private readonly usersService: UsersService,
    private readonly postService: PostService
  ) {}

  async create(createCommentDto: CreateCommentDto,) {
    const {postId,userId, ...rest } = createCommentDto;
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

      const comment = await this.CommentRepository.save({
        ...rest,
        user: user,
        posts: posts,
      });

      if (!comment) {
        throw new ManagerError({
          type: 'CONFLICT',
          message: 'Comment not created!',
        });
      }

      return comment;
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
        this.CommentRepository.count({ where: { isActive: true } }),
        this.CommentRepository
          .createQueryBuilder('comments')
          .where({ isActive: true })
          .leftJoinAndSelect('comments.posts', 'posts')
          .leftJoinAndSelect('comments.user', 'user')
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
        .createQueryBuilder('comments')
        .where({ id, isActive: true })
        .leftJoinAndSelect('comments.posts', 'posts')
        .leftJoinAndSelect('comments.user', 'user')
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
