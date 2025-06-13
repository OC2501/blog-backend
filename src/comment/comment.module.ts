import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { PostModule } from 'src/post/post.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity]), 
    PostModule,
    UsersModule
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
