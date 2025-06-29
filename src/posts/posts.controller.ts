import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from './dto/CreatePost.dto';
import { PostsService } from './posts.service';
import { RoleName } from 'src/roles/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Role } from 'src/roles/roles.entity';
import { UpdatePostDto } from './dto/UpdatePost.dto';
import { SearchPostDto } from './dto/SearchPost.dto';

@Controller('posts')
@UseGuards(RolesGuard) // Apply guards to entire controller
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Roles(RoleName.EDITOR)
  @Post('create')
  async signup(
    @CurrentUser() user: any,
    @Body() createPostsDto: CreatePostDto,
  ) {
    return this.postsService.createPost(createPostsDto, user.id);
  }

  @Roles(RoleName.ADMIN, RoleName.EDITOR, RoleName.VIEWER)
  @Get('search')
  async searchPosts(@Query() dto: SearchPostDto, @CurrentUser() user: any) {
    return this.postsService.searchPosts(dto, user);
  }

  @Roles(RoleName.ADMIN, RoleName.EDITOR, RoleName.VIEWER)
  @Get(':id')
  async getPostById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.postsService.findOnePostById(id, user);
  }

  @Roles(RoleName.ADMIN, RoleName.EDITOR)
  @Delete(':id')
  async deletePost(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.postsService.deletePostById(id, user);
  }

  @Roles(RoleName.ADMIN, RoleName.EDITOR)
  @Patch(':id')
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePostDto,
    @CurrentUser() user: any,
  ) {
    return this.postsService.updatePostById(id, dto, user);
  }
}
