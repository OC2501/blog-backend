import { Module } from '@nestjs/common';
import { CategoriesService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])], // Add your CategoryEntity here
  controllers: [CategoryController],
  providers: [CategoriesService],
})
export class CategoryModule {}
