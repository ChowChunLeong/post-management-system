import { Injectable } from '@nestjs/common';
import { CreatePostsDto } from './dto/CreatePosts.dto';

@Injectable()
export class PostsService {
  async createPosts(createPostsDto: CreatePostsDto) {
    console.log('createPosts api');
  }
}
