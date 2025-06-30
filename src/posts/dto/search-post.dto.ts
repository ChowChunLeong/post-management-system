import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsArray, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchPostDto {
  @ApiPropertyOptional({
    description: 'Keyword to search in post title or content',
    example: 'nestjs',
  })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({
    description: 'Filter posts by multiple tags',
    example: ['nestjs', 'backend'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Start date for filtering posts (inclusive)',
    example: '2024-06-01',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date for filtering posts (inclusive)',
    example: '2024-06-30',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
