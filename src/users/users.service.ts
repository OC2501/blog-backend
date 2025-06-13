import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ManagerError } from 'src/common/errors/manager.error';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
      @InjectRepository(UserEntity)
      private readonly UserRepository: Repository<UserEntity>,
    ) {}
  
    async create(createUserDto: CreateUserDto,) {
      try {
        const user = await this.UserRepository.save(createUserDto);
  
        if (!user) {
          throw new ManagerError({
            type: 'CONFLICT',
            message: 'User not created!',
          });
        }
  
        return user;
      } catch (error) {
        ManagerError.createSignatureError(error.message);
      }
    }
  
    async findAll(paginationDto: PaginationDto) {
      const { page, limit } = paginationDto;
      const skip = (page - 1) * limit;
      
        try {
        const [total, data] = await Promise.all([
          this.UserRepository.count({ where: { isActive: true } }),
          this.UserRepository
            .createQueryBuilder('user')
            .where({ isActive: true })
            .leftJoinAndSelect('user.post', 'post')
            .leftJoinAndSelect('user.comment', 'comment')
            .leftJoinAndSelect('user.like', 'like')
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
        const user = await this.UserRepository
          .createQueryBuilder('user')
          .where({ id, isActive: true })
          .leftJoinAndSelect('user.posts', 'posts')
          .leftJoinAndSelect('user.comments', 'comments')
          .leftJoinAndSelect('user.likes', 'likes')
          .getOne();
        
        if (!user) {
          throw new ManagerError({
            type: 'NOT_FOUND',
            message: 'User not found',
          });
        }
      
         return user;
      } catch (error) {
        ManagerError.createSignatureError(error.message);
      }
    }
  
    async update(id: string, updateUserDto: UpdateUserDto,){
      try {
        const user = await this.UserRepository.update(
          { id, isActive: true },
          updateUserDto,
        );
        if (user.affected === 0) {
          throw new ManagerError({
            type: 'NOT_FOUND',
            message: 'User not found',
          });
        }
  
        return user;
      } catch (error) {
        ManagerError.createSignatureError(error.message);
      }
    }
  
    async remove(id: string) {
      try {
        const user = await this.UserRepository.update(
          { id, isActive: true },
          { isActive: false },
        );
        if (user.affected === 0) {
          throw new ManagerError({
            type: 'NOT_FOUND',
            message: 'User not found',
          });
        }
  
        
        return user;
      } catch (error) {
        ManagerError.createSignatureError(error.message);
      }
    }

    async findOneByEmail(email: string) {
    try {
      const user = await this.UserRepository.findOne({
        where: { email, isActive: true },
      });
      if (!user) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'User not found',
        });
      }
      return user;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }
}
