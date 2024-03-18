import {
  ResponseSuccess,
  SupportedProviders,
  TokenIntrospectionDto,
  TokenRefreshDto,
} from '@instigo-app/data-transfer-object';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Redirect, RedirectOptions } from '@nestjsplus/redirect';
import { AuthService } from '../services/auth.service';
import { DeviceVerificationService } from '../services/device-verification.service';
import { EmailVerificationService } from '../services/email-verification.service';
import { FacebookService } from '../services/facebook.service';
import { SocialLoginService } from '../services/social-login.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  readonly logger = new Logger(AuthController.name);

  @Inject(AuthService)
  private readonly authService: AuthService;

  @Inject(SocialLoginService)
  private readonly socialLoginService: SocialLoginService;

  @Inject(EmailVerificationService)
  private readonly emailVerificationService: EmailVerificationService;

  @Inject(DeviceVerificationService)
  private readonly deviceVerificationService: DeviceVerificationService;

  @Inject(FacebookService)
  private readonly facebookService: FacebookService;

  @Get(':provider/:type/login')
  requestLoginRedirectUrl() {
    return new ResponseSuccess('Success');
  }

  @HttpCode(HttpStatus.CREATED)
  @Get(':provider/callback')
  @Redirect()
  async socialCallback(
    @Req() req,
    @Param('provider') provider: SupportedProviders,
    @Query('state') state: string,
  ): Promise<RedirectOptions> {
    return this.socialLoginService.socialCallback({ req, provider, state });
  }

  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.ACCEPTED)
  @Post('signin')
  async signIn(@Req() req): Promise<{ token: string }> {
    const { user } = req;
    const { token } = await this.authService.createJwtToken({ user });
    void this.deviceVerificationService.verifyDevice({ request: req, user });
    return { token };
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signUp(@Body() options: { email; password; username; firstName?; lastName? }): Promise<{ token: string }> {
    const user = await this.authService.signUp(options);
    const { token } = await this.authService.createJwtToken({ user });
    this.emailVerificationService
      .sendRegisterMail({ email: options.email })
      .then((res) => {
        this.logger.log(res);
      })
      .catch((err) => {
        this.logger.error(err);
      });
    return { token };
  }

  @ApiResponse({
    status: 201,
    description: `Get current state of a specific provider's token`,
    type: TokenIntrospectionDto,
  })
  @Post('inspect-token')
  async inspectToken(
    @Body() body: { provider: SupportedProviders; accessToken: string },
  ): Promise<TokenIntrospectionDto> {
    return this.authService.inspectToken(body);
  }

  @ApiResponse({ status: 201, description: `Refresh specific provider's token`, type: TokenRefreshDto })
  @Post('refresh-token')
  async refreshToken(
    @Body() body: { provider: SupportedProviders; accessToken: string; refreshToken?: string },
  ): Promise<TokenRefreshDto> {
    return this.authService.refreshToken(body);
  }

  @Post('handle-facebook-login')
  async handleFacebookLogin(
    @Body()
    body: {
      profile;
      auth;
    },
  ) {
    const { profile, auth } = body;
    return this.facebookService.handleFacebookLogin({ profile, auth });
  }

  @Post('handle-facebook-data-deletion')
  handleFacebookDataDeletion(@Body() body, @Query('id') confirmationCode) {
    if (!body || !body.signed_request) {
      throw new BadRequestException('Bad request');
    }
    return this.facebookService.handleFacebookDataDeletion({ signedRequest: body.signed_request, confirmationCode });
  }

  @Get('check-deletion-status/:id')
  checkDeletionStatus(@Param('id') id: string) {
    return this.facebookService.checkDeletionStatus(id);
  }
}
