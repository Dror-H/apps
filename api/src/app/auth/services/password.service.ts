import { PrettyLinkService } from '@instigo-app/api-shared';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import * as jwt from 'jsonwebtoken';
import { User } from '../../user/data/user.entity';
import { UserRepository } from '../../user/data/user.repository';
import { AuthService } from './auth.service';

@Injectable()
export class PasswordService {
  readonly logger = new Logger(PasswordService.name);

  @Inject(MailerService)
  private readonly mailerService: MailerService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Inject(AuthService)
  private readonly authService: AuthService;

  @Inject(UserRepository)
  private readonly userRepository: UserRepository;

  @Inject(PrettyLinkService)
  private readonly prettyLinkService: PrettyLinkService;

  async sendResetPasswordMail(options: { user: any }): Promise<{ message: string }> {
    const user = await this.userRepository.findByEmail({ email: options.user.email });
    const token = jwt.sign({ ...{ user, scope: 'resetPasswordEmail' } }, user.password, {
      expiresIn: '30m',
    });
    const mailerOptions = await this.buildMailerOptions({
      userEmail: user.email,
      token,
      name: user.fullName,
    });
    try {
      await this.mailerService.sendMail(mailerOptions);
      const message = `Reset password email successfully sent: ${user.email}`;
      this.logger.log(message);
      return { message };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(`Could not send reset password email: ${user.email}`, 400);
    }
  }

  async resetPassword(options: { email: string; password: string }): Promise<User> {
    const { email, password } = options;
    const user = await this.userRepository.findByEmail({ email });
    return this.userRepository.save(await plainToClass(User, user).setPassword(password));
  }

  async buildMailerOptions(options: { userEmail: string; token: string; name: string }): Promise<ISendMailOptions> {
    const { userEmail, token, name } = options;
    return {
      to: userEmail,
      subject: 'Reset password email - Instigo',
      template: 'reset-password-email',
      context: {
        action_url: await this.prettyLinkService.passwordResetShortUrl(token),
        name,
      },
    };
  }

  async verifyResetPasswordToken(options: { token: string }): Promise<{ token: string }> {
    const { token } = options;
    const payload = jwt.decode(token);
    const { user, scope } = payload as any;
    const realUser = await this.userRepository.findByEmail({ email: user.email });
    jwt.verify(token, realUser.password);
    return this.authService.createJwtToken({ user, scope });
  }
}
