import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-users.dto';
import { Public } from './decorators/public.decorator';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LoginResponseDto } from './dto/response/login/login-response.dto';
import { CreateUserResponseDto } from './dto/response/signup/create-user-response.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @ApiOperation({
    summary: 'User sign up',
  })
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: CreateUserResponseDto,
  })
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Public()
  @Post('login')
  @ApiOperation({
    summary: 'User login to verified credential and get access token',
  })
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Login successful',
    type: LoginResponseDto,
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
