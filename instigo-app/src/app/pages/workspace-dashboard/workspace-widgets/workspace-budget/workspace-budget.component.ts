import { Component, Input, OnInit } from '@angular/core';
import { WorkspaceDashboardService } from '@app/pages/workspace-dashboard/workspace-dashboard.service';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

@Component({
  selector: 'instigo-app-workspace-budget',
  templateUrl: './workspace-budget.component.html',
  styleUrls: ['./workspace-budget.component.scss'],
})
export class WorkspaceBudgetComponent implements OnInit {
  @Input()
  workspaceInsights$: Observable<any>;

  budge$ = new BehaviorSubject<any>(0);

  @Input()
  budget = 1000;

  currentDatePreset$: Observable<any>;

  constructor(private service: WorkspaceDashboardService) {}

  ngOnInit(): void {
    this.currentDatePreset$ = this.service.currentDatePreset$;
  }

  summaryFormat = () => 'insights.value?.spend || 0;';
}
