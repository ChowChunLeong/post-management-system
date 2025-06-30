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
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { RoleName } from 'src/roles/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UpdatePostDto } from './dto/update-post.dto';
import { SearchPostDto } from './dto/search-post.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePostResponseDto } from './dto/response/create-post/create-post-response.dto';
import { UpdatePostResponseDto } from './dto/response/update-post/post-response.dto';

@ApiTags('Posts')
@ApiBearerAuth('access-token') // 🔐 Enables Authorize button for this controller
@Controller('posts')
@UseGuards(RolesGuard) // Apply guards to entire controller
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Roles(RoleName.EDITOR)
  @Post('create')
  @ApiCreatedResponse({
    description: 'Post created successfully',
    type: CreatePostResponseDto,
  })
  async create(
    @Body() createPostsDto: CreatePostDto,
    @CurrentUser() user: any,
  ) {
    return this.postsService.createPost(createPostsDto, user.id);
  }

  @Roles(RoleName.ADMIN, RoleName.EDITOR, RoleName.VIEWER)
  @Get('search')
  @ApiOperation({ summary: 'search post with filter' })
  @ApiOkResponse({
    description: 'Post that matched with filter condition listed',
    type: SearchPostDto,
  })
  async searchPosts(@Query() dto: SearchPostDto, @CurrentUser() user: any) {
    return this.postsService.searchPosts(dto, user);
  }

  @Roles(RoleName.ADMIN, RoleName.EDITOR, RoleName.VIEWER)
  @Get(':id')
  @ApiOperation({ summary: 'Get post by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Post ID' })
  @ApiOkResponse({ description: 'Post found', type: CreatePostResponseDto })
  @ApiNotFoundResponse({ description: 'Post not found' })
  async getPostById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.postsService.findOnePostById(id, user);
  }

  @Roles(RoleName.ADMIN, RoleName.EDITOR)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the post to delete',
  })
  @ApiOkResponse({ description: 'Post deleted successfully' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  async deletePost(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.postsService.deletePostById(id, user);
  }

  @Roles(RoleName.ADMIN, RoleName.EDITOR)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a post by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the post to update',
  })
  @ApiOkResponse({
    description: 'Post updated successfully',
    type: UpdatePostResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @ApiBody({ type: UpdatePostDto })
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePostDto,
    @CurrentUser() user: any,
  ) {
    return this.postsService.updatePostById(id, dto, user);
  }
}
