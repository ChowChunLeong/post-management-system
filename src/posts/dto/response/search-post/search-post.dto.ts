import { ApiProperty } from '@nestjs/swagger';
import { AuthorDto } from './author.dto';
import { TagDto } from './tag.dto';
import { PostStatus } from 'src/posts/posts.enum';

export class PostResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ enum: PostStatus })
  status: PostStatus;

  @ApiProperty({ type: AuthorDto })
  author: AuthorDto;

  @ApiProperty({ type: [TagDto] })
  tags: TagDto[];

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
