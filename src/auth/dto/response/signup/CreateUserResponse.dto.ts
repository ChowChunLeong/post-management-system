import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './UserResponse.dto';

export class CreateUserResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}
