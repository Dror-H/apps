import { UploadUtilityService } from '@instigo-app/upload-utility';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Readable } from 'stream';
import { File } from '../data/file.entity';
import { FileRepository } from '../data/file.repository';

@Injectable()
export class FileNestCrudService extends TypeOrmCrudService<File> {
  @Inject(ConfigService) private readonly configService: ConfigService;

  @Inject(UploadUtilityService) private readonly uploadUtilityService: UploadUtilityService;

  constructor(@Inject(FileRepository) repo: FileRepository) {
    super(repo);
  }

  async save(options: { file: any; user: any; workspaceId: any }): Promise<File> {
    const { file, user, workspaceId } = options;
    const { mimetype, originalname, size } = file;
    const key = file.key || file.path;
    return this.repo.save({
      key,
      location: `https://instigo.ams3.digitaloceanspaces.com/${file.key}`,
      originalname,
      size,
      mimetype,
      owner: user,
      workspace: workspaceId,
    });
  }

  async download(id: string): Promise<Buffer> {
    const file = await this.repo.findOneOrFail(id);
    return this.uploadUtilityService.downloadFile(file.key);
  }

  async downloadStream(id: string): Promise<Readable> {
    const file = await this.repo.findOneOrFail(id);
    return this.uploadUtilityService.downloadStream(file.key);
  }

  async delete(id: string): Promise<string> {
    const file = await this.repo.findOneOrFail(id);
    await this.uploadUtilityService.deleteFile(file.key);
    await this.repo.remove(file);
    return id;
  }

  async update(file: File): Promise<File> {
    return this.repo.save(file);
  }
}
