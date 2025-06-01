import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { TagsModule } from './tags/tags.module';
import { CommentModule } from './comment/comment.module';
import { LikesModule } from './likes/likes.module';
import { CategoryModule } from './category/category.module';
import { DataSourceConfig } from './common/config/data.source';
import { UsersModule } from './users/users.module';



@Module({
  imports: [
    TypeOrmModule.forRoot(DataSourceConfig),

    AuthModule, 
    PostModule, 
    TagsModule, 
    CommentModule, 
    LikesModule, 
    CategoryModule, UsersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
