import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Tag } from './tags.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagsService {
  @InjectRepository(Tag)
  private tagsRepo: Repository<Tag>;

  async findTagsByName(name: string): Promise<Tag | null> {
    return this.tagsRepo.findOneBy({
      name: name,
    });
  }

  async create(name: string): Promise<Tag> {
    const newTag = this.tagsRepo.create({ name });
    return this.tagsRepo.save(newTag);
  }

  async deleteOrphanTag() {
    // Step 1: Get orphan tag IDs
    const orphanTags = await this.tagsRepo
      .createQueryBuilder('tag')
      .leftJoin('tag.posts', 'post')
      .where('post.id IS NULL')
      .select('tag.id')
      .getMany();

    // Step 2: Delete them by ID
    if (orphanTags.length > 0) {
      const orphanIds = orphanTags.map((tag) => tag.id);
      await this.tagsRepo.delete(orphanIds);
    }
  }
}
