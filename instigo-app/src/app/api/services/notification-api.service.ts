import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class NotificationApiService {
  constructor(private readonly httpClient: HttpClient) {}

  notifications() {
    return this.httpClient.get('/server/notifications', { headers: { ignoreLoadingBar: '' } }).pipe(take(1));
  }

  bannerNotifications(): Observable<any[]> {
    return this.httpClient
      .get('/server/notifications/banner', { headers: { ignoreLoadingBar: '' } })
      .pipe(take(1)) as Observable<any[]>;
  }

  activity({ takeNo = 10 }: { takeNo?: number }) {
    return this.httpClient.get(`/server/activity?take=${takeNo}`, { headers: { ignoreLoadingBar: '' } }).pipe(take(1));
  }

  markAsRead({ notification }) {
    return this.httpClient.post('/server/notifications/markasread', { notification }).pipe(take(1));
  }
}
