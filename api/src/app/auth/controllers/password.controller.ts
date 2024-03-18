import { ResponseSuccess } from '@instigo-app/data-transfer-object';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  NotFoundException,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Redirect } from '@nestjsplus/redirect';
import { AuthService } from '../services/auth.service';
import { PasswordService } from '../services/password.service';
import { InstigoErrorCode } from '@instigo-app/data-transfer-object';

@ApiTags('auth/password')
@Controller('auth/password')
export class PasswordController {
  private readonly logger = new Logger(PasswordController.name);

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Inject(AuthService)
  private readonly authService: AuthService;

  @Inject(PasswordService)
  private readonly passwordService: PasswordService;

  @Get('reset')
  @Redirect()
  async redirectToResetPassword(@Query('token') token: string) {
    try {
      const { token: newToken } = await this.passwordService.verifyResetPasswordToken({ token });
      return {
        statusCode: HttpStatus.FOUND,
        url: `${this.configService.get('FRONTEND_HOST')}/auth/reset-password/${newToken}`,
      };
    } catch (error) {
      this.logger.error(error.message);
      return {
        statusCode: HttpStatus.TEMPORARY_REDIRECT,
        url: `${this.configService.get('FRONTEND_HOST')}/500?code=${InstigoErrorCode.EMAIL_NOT_VALID}`,
      };
    }
  }

  @Post('send')
  @HttpCode(HttpStatus.OK)
  async sendResetPasswordEmail(@Body() body: { user: { email: string } }) {
    const { user } = body;
    try {
      return new ResponseSuccess(await this.passwordService.sendResetPasswordMail({ user }));
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('reset')
  @HttpCode(HttpStatus.OK)
  async updatePassword(@Body() body: { email: string; password: string }): Promise<{ token: string }> {
    const user = await this.passwordService.resetPassword(body);
    return this.authService.createJwtToken({ user });
  }
}
