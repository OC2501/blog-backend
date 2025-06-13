import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeEntity } from './entities/like.entity';
import { UsersModule } from 'src/users/users.module';
import { PostModule } from 'src/post/post.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LikeEntity]),
    UsersModule,
    PostModule
  ],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
