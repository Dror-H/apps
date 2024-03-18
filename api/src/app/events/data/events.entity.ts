import { Page } from '@api/ad-account/data/page.entity';
import { Resources, SupportedProviders } from '@instigo-app/data-transfer-object';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: Resources.EVENTS })
export class EventsEntity {
  @PrimaryColumn({ name: 'provider_id' })
  providerId: string;

  @Column({ type: 'enum', enum: SupportedProviders })
  provider: SupportedProviders;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  place: any;

  @ManyToOne(() => Page, (page) => page.providerId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'page_provider_id' })
  page: Page;

  @Column({
    name: 'start_time',
    nullable: true,
  })
  startTime?: Date;

  @Column({
    name: 'end_time',
    nullable: true,
  })
  endTime?: Date;
}
