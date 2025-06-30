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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
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
  @ApiOperation({ summary: 'create post. Only editor can create post' })
  @ApiCreatedResponse({
    description: 'Post created successfully',
    type: CreatePostResponseDto,
  })
  @ApiConflictResponse({ description: 'There are duplicate Post title.' })
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
  @ApiOperation({
    summary:
      'Get post by ID. An Admin can view all posts. An Editor can view all posts they own and posts that have been published. A Viewer can only view posts that have been published.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Post ID' })
  @ApiOkResponse({ description: 'Post found', type: CreatePostResponseDto })
  @ApiNotFoundResponse({ description: 'Post with ID not found' })
  @ApiForbiddenResponse({
    description: 'You are not allowed to view this post.',
  })
  async getPostById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.postsService.findOnePostById(id, user);
  }

  @Roles(RoleName.ADMIN, RoleName.EDITOR)
  @Delete(':id')
  @ApiOperation({
    summary:
      'Delete a post by ID. An Admin can delete all posts. An Editor can delete all posts they own',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the post to delete',
  })
  @ApiOkResponse({ description: 'Post soft-deleted  successfully' })
  @ApiNotFoundResponse({ description: 'Post with ID not found' })
  @ApiBadRequestResponse({ description: 'Post is already archived' })
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
    description:
      'ID of the post to update. An Admin can update all posts. An Editor can update all posts they own',
  })
  @ApiOkResponse({
    description: 'Post updated successfully',
    type: UpdatePostResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Post with ID not found' })
  @ApiConflictResponse({ description: 'There are duplicate Post title.' })
  @ApiBody({ type: UpdatePostDto })
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePostDto,
    @CurrentUser() user: any,
  ) {
    return this.postsService.updatePostById(id, dto, user);
  }
}
