import { EncryptionTransformerConfig } from '@api/database/database.config.service';
import { EncryptionTransformer } from '@api/database/encrypt/encrypt-transformer';
import { User } from '@api/user/data/user.entity';
import { CustomValidationError, IngoBaseEntity } from '@instigo-app/api-shared';
import { Resources } from '@instigo-app/data-transfer-object';
import { IsNotEmpty, IsOptional, MaxLength, validateSync } from 'class-validator';
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, ManyToOne } from 'typeorm';

function validate(instance: OauthTokensAccesstoken) {
  const errors = validateSync(instance, {
    validationError: { target: false },
  });
  if (errors.length > 0) {
    throw new CustomValidationError(errors);
  }
}

@Entity({ name: Resources.OAUTH_TOKENS_ACCESSTOKENS })
export class OauthTokensAccesstoken extends IngoBaseEntity {
  @Column({ length: 20 })
  @IsNotEmpty()
  @MaxLength(20)
  provider: string = undefined;

  @Column({ length: 200 })
  @IsNotEmpty()
  @MaxLength(200)
  providerClientId: string = undefined;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  grantedAt: Date = undefined;

  @Column({ length: 1000, transformer: new EncryptionTransformer(EncryptionTransformerConfig) })
  @IsNotEmpty()
  @MaxLength(1000)
  accessToken: string = undefined;

  @Column({ type: 'timestamptz', nullable: true })
  expiresAt: Date = undefined;

  @Column({ length: 1000, nullable: true, transformer: new EncryptionTransformer(EncryptionTransformerConfig) })
  @MaxLength(1000)
  @IsOptional()
  refreshToken: string = undefined;

  @Column({ type: 'timestamptz', nullable: true })
  @IsOptional()
  refreshTokenExpiresAt: Date = undefined;

  @Column({ length: 200, nullable: true })
  @MaxLength(200)
  @IsOptional()
  tokenType: string = undefined;

  @Column({ length: 512, nullable: true })
  @MaxLength(512)
  @IsOptional()
  scope: string = undefined;

  @Column({ length: 200, nullable: true })
  @MaxLength(200)
  @IsOptional()
  status: string = undefined;

  @ManyToOne((type) => User, { eager: true })
  @IsNotEmpty()
  user: User = undefined;

  @BeforeInsert()
  doBeforeInsertion() {
    validate(this);
  }

  @BeforeUpdate()
  doBeforeUpdate() {
    validate(this);
  }
}
