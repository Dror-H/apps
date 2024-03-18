import { PrettyLinkService } from '@instigo-app/api-shared';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { User } from '../../user/data/user.entity';
import { UserRepository } from '../../user/data/user.repository';
import { AuthService } from './auth.service';
@Injectable()
export class EmailVerificationService {
  readonly logger = new Logger(EmailVerificationService.name);

  @Inject(MailerService)
  private readonly mailerService: MailerService;

  @Inject(UserRepository)
  private readonly userRepository: UserRepository;

  @Inject(AuthService)
  private readonly authService: AuthService;

  @Inject(PrettyLinkService)
  private readonly prettyLinkService: PrettyLinkService;

  async sendRegisterMail(options: { email: string }): Promise<{ message: string }> {
    const { email } = options;
    const user = await this.userRepository.findByEmail({ email });
    const { token } = await this.authService.createJwtToken({ user, scope: 'emailVerification' });
    const mailerOptions = await this.buildMailerOptions({ userEmail: email, token, name: user.fullName });
    try {
      await this.mailerService.sendMail(mailerOptions);
      const message = `Verification email successfully sent: ${user.email}`;
      this.logger.log(message);
      return { message };
    } catch (error) {
      throw new Error(`Could not send verification email: ${user.email}`);
    }
  }

  async confirmEmail(options: { token: string }): Promise<User> {
    const { token } = options;
    const { user: userFromToken } = await this.authService.verifyToken({ token });
    const user = await this.userRepository.findByEmail({ email: userFromToken.email });
    if (user.emailVerification === true) {
      throw new UnauthorizedException('Email already verified!');
    }
    return this.userRepository.save({ ...user, emailVerification: true } as User);
  }

  async buildMailerOptions(options: { userEmail: string; token: string; name?: string }): Promise<ISendMailOptions> {
    const { userEmail, token, name } = options;
    return {
      to: userEmail,
      subject: 'Register email verification - Instigo',
      template: 'verification-email',
      context: {
        action_url: await this.prettyLinkService.emailVerificationShortUrl(token),
        name,
      },
    };
  }
}
