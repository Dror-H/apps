import { mkdir, removeDir, writeFile } from '@instigo-app/api-shared';
import { TimeIncrement, User } from '@instigo-app/data-transfer-object';
import { UploadUtilityService } from '@instigo-app/upload-utility';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { differenceInCalendarDays, format } from 'date-fns';
import * as fs from 'fs';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { spawnRelaxed } from './relaxed';

@Injectable()
export class ReportsService {
  readonly logger = new Logger(ReportsService.name);

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Inject(UploadUtilityService)
  private readonly uploadUtilityService: UploadUtilityService;

  @Inject(MailerService)
  private readonly mailerService: MailerService;

  sanitizeTimeIncrement(timeRange) {
    const diff = Math.abs(differenceInCalendarDays(new Date(timeRange.start), new Date(timeRange.end)));
    if (diff <= 90) return TimeIncrement.DAILY;
    if (diff > 90 && diff < 365) return TimeIncrement.MONTHLY;
    if (diff >= 365) return TimeIncrement.YEARLY;
  }

  async buildAndShipReport(options: {
    reportName: string;
    reportTemporaryFolder: string;
    reportPugPath: string;
    reportVariable: any;
    workspaceId: string;
    user: Partial<User>;
    charts: any[];
  }) {
    const { reportName, reportTemporaryFolder, reportPugPath, reportVariable, workspaceId, user, charts } = options;
    await mkdir(reportTemporaryFolder);

    const writeFilesPromises = charts.map((chart) => {
      console.log(`Write Chart ${chart.name}`);
      return writeFile(`${reportTemporaryFolder}/${chart.name}`, JSON.stringify(chart.data));
    });

    await Promise.all(writeFilesPromises);

    for (const chart of charts) {
      console.log(`Build Chart ${chart.name}`);
      await spawnRelaxed({ path: `${reportTemporaryFolder}/${chart.name}` });
    }

    console.log('Building Report');
    await spawnRelaxed({
      path: reportPugPath,
      out: `${reportTemporaryFolder}/${reportName}.pdf`,
      args: ['-t', reportTemporaryFolder, '--locals', JSON.stringify(reportVariable)],
    });

    const response = await this.uploadUtilityService.uploadFile({
      fileName: `public/${workspaceId}/reports/${reportName}-${format(new Date(), 'dd-MM-yyyy')}.pdf`,
      fileContent: fs.createReadStream(`${reportTemporaryFolder}/${reportName}.pdf`),
    });

    const location = response.data.location;
    return from(this.buildMailerOptions({ user, reportUrl: location })).pipe(
      switchMap((mailerOptions) => this.mailerService.sendMail(mailerOptions)),
      switchMap(() => removeDir(`${reportTemporaryFolder}`)), // clean up temporary folder
    );
  }

  async buildMailerOptions(options: { user: Partial<User>; reportUrl: string }): Promise<ISendMailOptions> {
    const { user, reportUrl } = options;
    return {
      to: user.email,
      subject: 'Your report is ready - Instigo',
      template: 'report-email',
      context: {
        action_url: reportUrl,
        name: user.firstName,
      },
    };
  }
}
