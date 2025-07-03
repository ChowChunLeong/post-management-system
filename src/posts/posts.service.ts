import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { Brackets, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Post } from './posts.entity';
import { Tag } from 'src/tags/tags.entity';
import { PostStatus } from './posts.enum';
import { UpdatePostDto } from './dto/update-post.dto';
import { SearchPostDto } from './dto/search-post.dto';
import { RoleName } from 'src/roles/role.enum';
import { AuthUser } from 'src/auth/auth-user.interface';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async createPost(dto: CreatePostDto, userId: number): Promise<Post> {
    const existing = await this.postRepository.findOneBy({ title: dto.title });
    if (existing) {
      throw new ConflictException('There are duplicate Post title.');
    }
    const author = await this.userRepository.findOneByOrFail({ id: userId });

    // Ensure tags exist or create them
    const tags: Tag[] = await Promise.all(
      dto.tags.map(async (name) => {
        const existing = await this.tagRepository.findOneBy({ name });
        if (existing) return existing;

        // Create new tag if not found
        const newTag = this.tagRepository.create({ name });
        return this.tagRepository.save(newTag);
      }),
    );

    const post = this.postRepository.create({
      title: dto.title,
      content: dto.content,
      status: dto.status,
      author,
      tags,
    });

    return this.postRepository.save(post);
  }

  async findOnePostById(id: number, user: any): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author', 'tags'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found.`);
    }

    const isOwner = post.author.id === user.id;
    const isPublished = post.status === 'PUBLISHED';
    const role = user.role; // assuming user.role is loaded and has a `name` field
    // Admin can view all
    if (role === 'ADMIN') return post;

    // Editor can view own posts or published ones
    if (role === 'EDITOR') {
      if (isOwner || isPublished) return post;
      throw new ForbiddenException('You are not allowed to view this post.');
    }

    // Viewer can only see published posts
    if (role === 'VIEWER') {
      if (isPublished) return post;
      throw new ForbiddenException('You are not allowed to view this post.');
    }

    return post;
  }

  async deletePostById(
    postId: number,
    user: any,
  ): Promise<{ message: string }> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found.`);
    }

    const isOwner = post.author.id === user.id;
    const role = user.role; // 'ADMIN', 'EDITOR', etc.

    if (role === 'ADMIN' || (role === 'EDITOR' && isOwner)) {
      if (post.status === PostStatus.ARCHIVED) {
        throw new BadRequestException('Post is already archived.');
      }

      post.status = PostStatus.ARCHIVED;
      await this.postRepository.save(post);

      return { message: 'Post archived (soft-deleted) successfully.' };
    }

    throw new ForbiddenException(
      'You do not have permission to archive this post.',
    );
  }

  async updatePostById(
    id: number,
    dto: UpdatePostDto,
    user: any,
  ): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author', 'tags'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found.`);
    }

    const isOwner = post.author.id === user.id;
    const role = user.role; // assuming string like 'ADMIN', 'EDITOR'

    if (!(role == 'ADMIN' || (role == 'EDITOR' && isOwner))) {
      throw new ForbiddenException(
        'You do not have permission to update this post.',
      );
    }
    if (dto.title !== undefined) {
      const existing = await this.postRepository.findOneBy({
        title: dto.title,
      });
      if (existing && id != existing.id) {
        throw new ConflictException('There are duplicate Post title.');
      }
      post.title = dto.title;
    }
    if (dto.content !== undefined) post.content = dto.content;
    if (dto.status !== undefined) post.status = dto.status;

    if (dto.tags) {
      const tags = await Promise.all(
        dto.tags.map(async (name) => {
          const existing = await this.tagRepository.findOneBy({ name });
          return (
            existing ??
            this.tagRepository.save(this.tagRepository.create({ name }))
          );
        }),
      );
      post.tags = tags;
    }

    const updatedPost = await this.postRepository.save(post);

    // Step 1: Get orphan tag IDs
    const orphanTags = await this.tagRepository
      .createQueryBuilder('tag')
      .leftJoin('tag.posts', 'post')
      .where('post.id IS NULL')
      .select('tag.id')
      .getMany();

    // Step 2: Delete them by ID
    if (orphanTags.length > 0) {
      const orphanIds = orphanTags.map((tag) => tag.id);
      await this.tagRepository.delete(orphanIds);
    }

    return updatedPost;
  }

  async searchPosts(dto: SearchPostDto, user: AuthUser): Promise<Post[]> {
    const { keyword, tags, startDate, endDate } = dto;

    const query = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author');
    // 🔒 Role-based visibility
    if (user.role == RoleName.ADMIN) {
      // full access
    } else if (user.role == 'EDITOR') {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('post.author.id = :userId', { userId: user.id }).orWhere(
            'post.status = :published',
            { published: 'published' },
          );
        }),
      );
    } else if (user.role === 'VIEWER') {
      query.andWhere('post.status = :published', { published: 'PUBLISHED' });
    }

    // 🔍 Keyword search (title or content)
    if (keyword) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('post.title LIKE :kw', { kw: `%${keyword}%` }).orWhere(
            'post.content LIKE :kw',
            { kw: `%${keyword}%` },
          );
        }),
      );
    }
    // Tag filter (AND all tags)
    if (tags && tags.length > 0) {
      const tagList = Array.isArray(tags) ? tags : [tags]; // ensures it's a real array
      query
        .innerJoin('post.tags', 'filterTag')
        .andWhere('filterTag.name IN (:...tagList)', { tagList })
        .groupBy('post.id')
        .having('COUNT(DISTINCT filterTag.id) = :tagCount', {
          tagCount: tagList.length,
        });
    } else {
      query.leftJoinAndSelect('post.tags', 'tag');
    }

    // 📅 Date range filter
    if (startDate) {
      query.andWhere('post.createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('post.createdAt <= :endDate', { endDate });
    }
    return query.getMany();
  }
}
