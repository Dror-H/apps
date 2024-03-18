import { Component, OnDestroy, OnInit } from '@angular/core';
import { KnowledgebaseApiService } from '@app/api/services/knowledgebase.service';
import { catchError, map, share, take } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { combineLatest, concat, Observable, of } from 'rxjs';
import { ObservableType } from '@instigo-app/data-transfer-object';

@Component({
  selector: 'ingo-knowledgebase',
  templateUrl: './knowledgebase.component.html',
})
export class KnowledgebaseComponent implements OnInit, OnDestroy {
  private subSink = new SubSink();

  pageData$: Observable<any>;

  constructor(private knowledgebaseApiService: KnowledgebaseApiService) {}

  ngOnInit() {
    this.pageData$ = concat(
      of({ type: ObservableType.START }),
      combineLatest([this.knowledgebaseApiService.getFaqsBanner(), this.knowledgebaseApiService.getFaqsItems()]).pipe(
        take(1),
        map((value) => ({ type: ObservableType.FINISH, knowledgebaseBanner: value[0], knowledgebaseItems: value[1] })),
        catchError(() => of({ type: ObservableType.START })),
      ),
    ).pipe(share());
  }

  ngOnDestroy() {
    this.subSink.unsubscribe();
  }

  public updateFaqCount(faqId, currentCount, action) {
    return this.knowledgebaseApiService.updateCount(faqId, currentCount, action).toPromise();
  }

  public activeTopicUpdated(knowledgebaseItems, activeTopicId) {
    knowledgebaseItems?.forEach((topic, index) => {
      topic.active = index === activeTopicId;
    });
  }
}
