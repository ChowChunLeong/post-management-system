import { ApiProperty } from '@nestjs/swagger';
import { AuthorDto } from './author.dto';
import { PostStatus } from '../../CreatePost.dto';
import { TagDto } from './Tag.dto';

export class PostResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'happy2' })
  title: string;

  @ApiProperty({ example: 'rterte' })
  content: string;

  @ApiProperty({ type: AuthorDto })
  author: AuthorDto;

  @ApiProperty({ enum: PostStatus, example: PostStatus.DRAFT })
  status: PostStatus;

  @ApiProperty({ type: [TagDto] })
  tags: TagDto[];

  @ApiProperty({ example: '2025-06-29T14:05:20.352Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-06-29T14:05:20.352Z' })
  updatedAt: string;
}
