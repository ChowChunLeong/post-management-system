import { ApiProperty } from '@nestjs/swagger';

export class TagDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'painting' })
  name: string;
}
