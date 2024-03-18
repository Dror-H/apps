import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AdTemplateActionService } from '../ad-template-actions.service';
import { AdTemplatePageService } from '../ad-template-page.service';

@Component({
  selector: 'app-ad-templates-page',
  templateUrl: './ad-templates-page.component.html',
  styleUrls: ['./ad-templates-page.component.scss'],
  providers: [AdTemplatePageService, AdTemplateActionService],
})
export class AdTemplatesPageComponent implements OnInit {
  public filters$: Observable<any>;

  constructor(private readonly adTemplatePageService: AdTemplatePageService) {}

  ngOnInit(): void {
    this.filters$ = this.adTemplatePageService.filters$;
  }

  updateFilterState(value): void {
    this.adTemplatePageService.updateFilters(value);
  }
}
