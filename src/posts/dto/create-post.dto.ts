import {
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export class CreatePostDto {
  @ApiProperty({ example: 'Understanding life' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'This post explains life cycle' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiPropertyOptional({
    enum: PostStatus,
    example: PostStatus.DRAFT,
    default: PostStatus.DRAFT,
    description: 'Status of the post',
  })
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus = PostStatus.DRAFT;

  @ApiProperty({
    type: [String],
    example: ['life', 'wisdom'],
    description: 'Array of tags (must be unique)',
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  @Type(() => String)
  tags: string[];
}
