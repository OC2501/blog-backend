import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ManagerError } from 'src/common/errors/manager.error';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from './entities/tag.entity';


@Injectable()
export class TagsService {
  constructor(
      @InjectRepository(TagEntity)
      private readonly TagRepository: Repository<TagEntity>,
    ) {}
  
    async create(createTagDto: CreateTagDto,) {
      try {
        const tag = await this.TagRepository.save(createTagDto);
        if (!tag) {
          throw new ManagerError({
            type: 'CONFLICT',
            message: 'Tag not created!',
          });
        }
  
        return {
          status: {
            statusMsg: 'CREATED',
            statusCode: HttpStatus.CREATED,
            error: null,
          },
          data: tag,
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
          this.TagRepository.count({ where: { isActive: true } }),
          this.TagRepository.find({
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
        const Tag = await this.TagRepository
          .createQueryBuilder('tag')
          .where({ id, isActive: true })
          .leftJoinAndSelect('tag.post', 'post')
          .getOne();
        if (!Tag) {
          throw new ManagerError({
            type: 'NOT_FOUND',
            message: 'Tag not found',
          });
        }
  
        return {
          status: {
            statusMsg: 'OK',
            statusCode: HttpStatus.OK,
            error: null,
          },
          data: Tag,
        };
      } catch (error) {
        ManagerError.createSignatureError(error.message);
      }
    }
  
    async update(id: string, updateTagDto: UpdateTagDto,){
       try {
        const Tag = await this.TagRepository.update(
          { id, isActive: true },
          updateTagDto,
        );
        if (Tag.affected === 0) {
          throw new ManagerError({
            type: 'NOT_FOUND',
            message: 'Tag not found',
          });
        }
  
        return {
          status: {
            statusMsg: 'OK',
            statusCode: HttpStatus.OK,
            error: null,
          },
          data: Tag,
        };
      } catch (error) {
        ManagerError.createSignatureError(error.message);
      }
    }
  
    async remove(id: string) {
      try {
        const tag = await this.TagRepository.update(
          { id, isActive: true },
          { isActive: false },
        );
        if (tag.affected === 0) {
          throw new ManagerError({
            type: 'NOT_FOUND',
            message: 'Tag not found',
          });
        }
  
        return {
          status: {
            statusMsg: 'OK',
            statusCode: HttpStatus.OK,
            error: null,
          },
          data: tag,
        };
      } catch (error) {
        ManagerError.createSignatureError(error.message);
      }
    }
}
