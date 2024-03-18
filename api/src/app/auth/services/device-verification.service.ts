/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import {
  InstigoNotification,
  NotificationCodes,
  NotificationSupportedProviders,
  NotificationType,
  NOTIFICATION_EVENT,
} from '@instigo-app/data-transfer-object';
import { WebServiceClient } from '@maxmind/geoip2-node';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserDeviceMetadataRepository } from '../../user/data/user-device-metadata.repository';
import { User } from '../../user/data/user.entity';

@Injectable()
export class DeviceVerificationService {
  private readonly logger = new Logger(DeviceVerificationService.name);

  @Inject(UserDeviceMetadataRepository)
  private readonly userDeviceMetadataRepository: UserDeviceMetadataRepository;

  @Inject(MailerService)
  private readonly mailerService: MailerService;

  private readonly webServiceClient: WebServiceClient;

  constructor(private eventEmitter: EventEmitter2) {
    this.webServiceClient = new WebServiceClient('513788', '9uOYQJHfxm5Yd4cz', { host: 'geolite.info' });
  }

  async deviceMetadata({ request }) {
    const parser = require('ua-parser-js');
    const ip = request?.clientIp === '::1' ? 'local' : request?.clientIp;
    const clientCity = (await this.webServiceClient.city(ip).catch((_) => {})) || null;
    const location =
      (clientCity
        ? `${clientCity?.country?.isoCode}/${clientCity?.postal?.code}/${clientCity?.traits?.userType}`
        : request.header('referrer')) || `unknown-location`;
    const deviceDetails = parser(request.header('user-agent'));
    return { deviceDetails, ip, location };
  }

  async verifyDevice({ request, user }): Promise<void> {
    const deviceMetadata = await this.deviceMetadata({ request });
    const device = { ...deviceMetadata, user };
    const existingDevice = await this.userDeviceMetadataRepository.findOne(device);
    if (!existingDevice) {
      this.eventEmitter.emit(
        NOTIFICATION_EVENT,
        new InstigoNotification({
          providerId: NotificationCodes.UNKNOWN_DEVICE_LOGIN,
          title: 'Unknown device login',
          description: 'Unknown device login',
          provider: NotificationSupportedProviders.INSTIGO,
          type: NotificationType.ERROR,
          user,
        }),
      );
      await this.notifyUserByEmail({ user, unknownIp: device.ip });
      await this.userDeviceMetadataRepository.save(device);
    } else {
      existingDevice.updatedAt = new Date();
      await this.userDeviceMetadataRepository.save(existingDevice);
    }
  }

  async notifyUserByEmail(options: { user: Partial<User>; unknownIp: string }): Promise<void> {
    try {
      const { user, unknownIp } = options;
      const mail = this.emailBody({ user, unknownIp });
      await this.mailerService.sendMail(mail);
    } catch (err) {
      this.logger.error(err);
    }
  }

  emailBody(options: { user: Partial<User>; unknownIp: string }): ISendMailOptions {
    const {
      user: { email, fullName },
      unknownIp,
    } = options;
    return {
      to: email,
      subject: 'Unknown device login - Instigo',
      template: 'unknown-device-login',
      context: {
        name: fullName,
        from: unknownIp,
      },
    };
  }
}
