import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreatePostsDto } from './dto/CreatePosts.dto';
import { PostsService } from './posts.service';
import { RoleName } from 'src/roles/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('posts')
@UseGuards(RolesGuard) // Apply guards to entire controller
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Roles(RoleName.EDITOR)
  @Post('create')
  async signup(@Body() createPostsDto: CreatePostsDto) {
    return this.postsService.createPosts(createPostsDto);
  }
}
