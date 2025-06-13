import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';

import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ManagerError } from 'src/common/errors/manager.error';
import { PaginationDto } from 'src/common/dtos/pagination.dto';


@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ) {
    try {
      const category = await this.categoryRepository.save(createCategoryDto);
      if (!category) {
        throw new ManagerError({
          type: 'CONFLICT',
          message: 'Category not created!',
        });
      }

      return {
        status: {
          statusMsg: 'CREATED',
          statusCode: HttpStatus.CREATED,
          error: null,
        },
        data: category,
      };
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async findAll( paginationDto: PaginationDto,) {
    const { limit, page } = paginationDto;
    const skip = (page - 1) * limit;

    try {

      const [total, data] = await Promise.all([
        this.categoryRepository.count({ where: { isActive: true } }),
        this.categoryRepository.find({
          where: { isActive: true },
          take: limit,
          skip: skip,
        }),
      ]);

      const lastPage = Math.ceil(total / limit);

      return {
        status: {
          statusMsg: 'OK',
          statusCode: HttpStatus.OK,
          error: null,
        },
        meta: {
          page,
          limit,
          lastPage,
          total,
        },
        data,
      };
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async findOne(id: string){
    try {
      const category = await this.categoryRepository
        .createQueryBuilder('category')
        .where({ id, isActive: true })
        .leftJoinAndSelect('category.posts', 'posts')
        .getOne();
      if (!category) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Category not found',
        });
      }

      return {
        status: {
          statusMsg: 'OK',
          statusCode: HttpStatus.OK,
          error: null,
        },
        data: category,
      };
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto,){
     try {
      const category = await this.categoryRepository.update(
        { id, isActive: true },
        updateCategoryDto,
      );
      if (category.affected === 0) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Category not found',
        });
      }

      return {
        status: {
          statusMsg: 'OK',
          statusCode: HttpStatus.OK,
          error: null,
        },
        data: category,
      };
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async remove(id: string) {
    try {
      const category = await this.categoryRepository.update(
        { id, isActive: true },
        { isActive: false },
      );
      if (category.affected === 0) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Category not found',
        });
      }

      return {
        status: {
          statusMsg: 'OK',
          statusCode: HttpStatus.OK,
          error: null,
        },
        data: category,
      };
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }
}