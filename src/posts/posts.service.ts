import { ConflictException, Injectable } from '@nestjs/common';
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
}
