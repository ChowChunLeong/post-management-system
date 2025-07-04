import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { TagDto } from './tag.dto';
import { PostStatus } from 'src/posts/posts.enum';

export class UpdatePostResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ enum: PostStatus })
  status: PostStatus;

  @ApiProperty({ type: UserDto })
  author: UserDto;

  @ApiProperty({ type: [TagDto] })
  tags: TagDto[];

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
