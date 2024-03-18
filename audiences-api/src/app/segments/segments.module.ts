import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SegmentsService } from './segments.service';
import { SegmentDetailsService } from './segment-details.service';
import { AdAccountModule } from '../ad-account/ad-account.module';

@Module({
  imports: [PrismaModule, HttpModule, AdAccountModule],
  providers: [SegmentsService, SegmentDetailsService],
  exports: [SegmentsService, SegmentDetailsService],
})
export class SegmentsModule {}
