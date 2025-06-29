// src/posts/dto/create-post.dto.ts
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

export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  // `author_id` should be inferred from JWT, so not included in DTO

  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus = PostStatus.DRAFT;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  @Type(() => String)
  tags: string[];
}
