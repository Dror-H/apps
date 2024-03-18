import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KnowledgebaseTopic, KnowledgebaseBanner } from '@instigo-app/data-transfer-object';

@Injectable()
export class KnowledgebaseApiService {
  constructor(private httpClient: HttpClient) {}

  getFaqsItems(): Observable<KnowledgebaseTopic[]> {
    return this.httpClient.get<KnowledgebaseTopic[]>('cms/wp-json/faqs/items', { headers: { ignoreLoadingBar: '' } });
  }

  getFaqsBanner(): Observable<KnowledgebaseBanner> {
    return this.httpClient.get<KnowledgebaseBanner>('cms/wp-json/faqs/banner', { headers: { ignoreLoadingBar: '' } });
  }

  updateCount(faqId: number, currentCount: number, action: string) {
    return this.httpClient.get(
      `cms/wp-json/update_faq/count?id=${faqId}&new_count=${currentCount + 1}&action=${action}`,
      { headers: { ignoreLoadingBar: '' } },
    );
  }
}
