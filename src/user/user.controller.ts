import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CreateUserDTO } from '@app/user/dto/createUser.dto';
import { UserService } from '@app/user/user.service';
import { IUserResponse } from './types/userResponse.interface';
import { LoginUserDTO } from './dto/loginUser.dto';
import { User } from '@app/user/decorators/user.decorator';
import { UserEntity } from './user.entity';
import { AuthGuard } from './guards/auth.guard';
import { UpdateUserDTO } from './dto/updateUser.dto';
import { BackendValidationPipe } from '@app/shared/pipes/backendValidation.pipe';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  @UsePipes(new BackendValidationPipe())
  async createUser(
    @Body('user') createUserDTO: CreateUserDTO,
  ): Promise<IUserResponse> {
    const user = await this.userService.createUser(createUserDTO);
    return this.userService.buildUserResponse(user);
  }

  @Post('users/login')
  @UsePipes(new BackendValidationPipe())
  async login(
    @Body('user') loginUserDTO: LoginUserDTO,
  ): Promise<IUserResponse> {
    const user = await this.userService.login(loginUserDTO);
    return this.userService.buildUserResponse(user);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async currentUser(@User() user: UserEntity): Promise<IUserResponse> {
    return this.userService.buildUserResponse(user);
  }

  @Put('user')
  @UseGuards(AuthGuard)
  async updateUser(
    @User('id') userId: number,
    @Body('user') updateUserDTO: UpdateUserDTO,
  ): Promise<IUserResponse> {
    const user = await this.userService.updateUser(userId, updateUserDTO);
    return this.userService.buildUserResponse(user);
  }
}
