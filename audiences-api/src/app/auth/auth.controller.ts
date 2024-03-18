import { ControllerDecoratorWithGuardsAndSwagger } from '@instigo-app/api-shared';
import { decodeUrlState, encodeState, ResponseSuccess } from '@instigo-app/data-transfer-object';
import { Get, Inject, Query, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { addDays } from 'date-fns';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

@ControllerDecoratorWithGuardsAndSwagger({ resource: 'auth', useGuards: false })
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Get(':provider/login')
  requestLoginRedirectUrl(): ResponseSuccess {
    return new ResponseSuccess('Success');
  }

  @Get(':provider/callback')
  async socialCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
    @Query('state') state: string,
  ): Promise<void> {
    try {
      const token = await this.authService.jwtToken({ user: req.user });
      const { redirect } = decodeUrlState(state);
      const path = redirect.includes('?')
        ? `${redirect}&state=${encodeState({ token, redirect })}`
        : `${redirect}?state=${encodeState({ token, redirect })}`;
      response
        .cookie('Authorization', token, {
          expires: new Date(addDays(Date.now(), 60).getTime()),
        })
        .redirect(302, `${this.configService.get<string>('FRONTEND_HOST')}/${path}`);
    } catch {
      response.redirect(302, `${this.configService.get<string>('FRONTEND_HOST')}`);
    }
  }

  @Get('/logout')
  logout(@Res({ passthrough: true }) response: Response): void {
    response
      .clearCookie('Authorization', {
        maxAge: -99999999,
        expires: new Date(Date.now()),
      })
      .cookie('Authorization', '', {
        maxAge: -99999999,
        expires: new Date(Date.now()),
      });
    response.redirect(302, `${this.configService.get<string>('FRONTEND_HOST')}`);
  }
}
