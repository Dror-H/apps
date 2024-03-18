import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ValidationService {
  constructor(private http: HttpService) {}

  public async pingUrl(url: string): Promise<boolean> {
    try {
      (await this.http.get(url).toPromise()).data;
      return true;
    } catch (err) {
      return false;
    }
  }
}
