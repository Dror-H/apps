import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as passport from 'passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  @Inject(AuthService)
  private readonly authService: AuthService;

  constructor() {
    super({ usernameField: 'email' });
    passport.use(this);
  }

  async validate(email: string, password: string): Promise<any> {
    try {
      return await this.authService.localStrategy({ email, password });
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
