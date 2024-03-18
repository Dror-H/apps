import { IngoBaseEntity } from '@instigo-app/api-shared';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'user-device-metadata' })
export class UserDeviceMetadataEntity extends IngoBaseEntity {
  @ManyToOne(() => User)
  user: User;

  @Column({ type: 'simple-json', name: 'device_details', nullable: false })
  deviceDetails: any;

  @Column()
  ip: string;

  @Column()
  location: string;

  @Column({ default: false, nullable: false })
  safe: boolean;
}
