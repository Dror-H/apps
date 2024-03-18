import { Body, Controller, Get, HttpStatus, Inject, Logger, Post, Query, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Redirect, RedirectOptions } from '@nestjsplus/redirect';
import { AuthService } from '../services/auth.service';
import { EmailVerificationService } from '../services/email-verification.service';
import { InstigoErrorCode } from '@instigo-app/data-transfer-object';
@ApiTags('email-verification')
@Controller('auth/email-verification')
export class EmailVerificationController {
  private readonly logger = new Logger(EmailVerificationController.name);

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Inject(EmailVerificationService)
  private readonly emailVerificationService: EmailVerificationService;

  @Inject(AuthService)
  private readonly authService: AuthService;

  @UseGuards(AuthGuard('jwt'))
  @Post('send')
  async sendVerificationEmail(@Body() body: { email: string }): Promise<{ message: string }> {
    const { email } = body;
    return this.emailVerificationService.sendRegisterMail({
      email,
    });
  }

  @Get('verify')
  @Redirect()
  async mailVerification(@Query('token') token: string): Promise<RedirectOptions> {
    try {
      const user = await this.emailVerificationService.confirmEmail({ token });
      const { token: authToken } = await this.authService.createJwtToken({ user });
      return {
        statusCode: HttpStatus.FOUND,
        url: `${this.configService.get('FRONTEND_HOST')}/token/${authToken}`,
      };
    } catch (error) {
      this.logger.error(error.message);
      return {
        statusCode: HttpStatus.TEMPORARY_REDIRECT,
        url: `${this.configService.get('FRONTEND_HOST')}/500?code=${InstigoErrorCode.EMAIL_NOT_VALID}`,
      };
    }
  }
}
