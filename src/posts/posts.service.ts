import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/CreatePost.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Post } from './posts.entity';
import { Tag } from 'src/tags/tags.entity';

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
}
