import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDTO } from '@app/user/dto/createUser.dto';
import { UserService } from '@app/user/user.service';
import { IUserResponse } from './types/userResponse.interface';
import { LoginUserDTO } from './dto/loginUser.dto';
import { IExpressRequest } from '@app/types/expressRequest';
import { User } from '@app/user/decorators/user.decorator';
import { UserEntity } from './user.entity';
import { AuthGuard } from './guards/auth.guard';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body('user') createUserDTO: CreateUserDTO,
  ): Promise<IUserResponse> {
    const user = await this.userService.createUser(createUserDTO);
    return this.userService.buildUserResponse(user);
  }

  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async login(
    @Body('user') loginUserDTO: LoginUserDTO,
  ): Promise<IUserResponse> {
    const user = await this.userService.login(loginUserDTO);
    return this.userService.buildUserResponse(user);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async currentUser(@User() user: UserEntity | null): Promise<IUserResponse> {
    return this.userService.buildUserResponse(user);
  }
}
