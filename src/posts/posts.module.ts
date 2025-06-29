import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './posts.entity';
import { Tag } from 'src/tags/tags.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Tag]), UsersModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
