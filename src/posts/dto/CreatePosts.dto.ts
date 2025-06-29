import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';

export class CreatePostsDto {
  @IsString()
  @MinLength(3)
  username: string;
}
