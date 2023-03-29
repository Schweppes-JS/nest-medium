import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDTO } from '@app/user/dto/createUser.dto';
import { UserService } from '@app/user/user.service';
import { IUserResponse } from './types/userResponse.interface';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('users')
  async createUser(
    @Body('user') createUserDTO: CreateUserDTO,
  ): Promise<IUserResponse> {
    const user = await this.userService.createUser(createUserDTO);
    return this.userService.buildUserResponse(user);
  }
}
