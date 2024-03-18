import { CompositionDecorator } from '@api/shared/controller-composition.decorator';
import { CurrentUser } from '@api/shared/current-user.decorator';
import { Actions, MeDTO, Resources } from '@instigo-app/data-transfer-object';
import { Action } from '@nest-toolbox/access-control';
import { Body, Delete, Get, Inject, Put } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { User } from '../data/user.entity';
import { UserService } from '../services/user.service';
@CompositionDecorator({ resource: Resources.ME })
export class MeController {
  @Inject(UserService)
  private readonly userService: UserService;

  @Action(Actions.ReadOne)
  @ApiResponse({ type: () => MeDTO })
  @Get()
  async getMe(@CurrentUser() user: Partial<User>) {
    return this.userService.getDetailedUser({ id: user.id });
  }

  @Action(Actions.ReadOne)
  @Get('deviceLoginHistory')
  deviceLoginHistory(@CurrentUser() user: Partial<User>) {
    return this.userService.deviceLoginHistory({ user });
  }

  @Action(Actions.UpdateOne)
  @Put()
  async updateUser(@CurrentUser() user: Partial<User>, @Body() body: User) {
    return this.userService.updateUser({ id: user.id, user: body });
  }

  @Action(Actions.UpdateOne)
  @Put('change-password')
  async changePassword(
    @CurrentUser() user: Partial<User>,
    @Body() body: { previousPassword: string; password: string },
  ) {
    const { previousPassword, password } = body;
    return this.userService.changePassword({ id: user.id, previousPassword, password });
  }

  @Action(Actions.DeleteOne)
  @Delete()
  @ApiResponse({ status: 200, description: 'Deleted' })
  async deleteAccount(@CurrentUser() user: Partial<User>) {
    return await this.userService.deleteAccount(user);
  }
}
