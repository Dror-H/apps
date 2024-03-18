import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resources } from '@instigo-app/data-transfer-object';
import { CrudService } from '../crud.service';

@Injectable()
export class PostApiService extends CrudService<any, string> {
  constructor(protected httpClient: HttpClient) {
    super(httpClient, 'server', Resources.POSTS);
  }
}
