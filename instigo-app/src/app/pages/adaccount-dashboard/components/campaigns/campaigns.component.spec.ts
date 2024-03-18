import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CampaignApiService } from '@app/api/services/campaign.api.service';
import { CampaignApiServiceMock } from '@app/api/services/campaign.api.service.mock';
import { CampaignsTableComponent } from '@app/pages/workspace-dashboard/workspace-widgets/campaigns-table/campaigns-table.component';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-data-table',
  template: '',
})
class MockDataTableComponent {
  @Input() tableConfiguration: any;
  @Input() state: any;
  @Input() tableData: any;
  @Output() stateChange = new EventEmitter<any>();
  @Output() columnsChange = new EventEmitter<any[]>();
}

@Component({
  selector: 'app-data-table-templates',
  template: '',
})
class MockDataTableTemplatesComponent {
  @Input() state;
  @Input() config?: any = {};
}

@Component({
  selector: 'app-data-table-skeleton',
  template: '',
})
class MockDataTableSkeletonComponent {
  @Input() columns;
  @Input() isScroll?: boolean;
  @Input() isSelectable?: boolean;
}

const mocks = [MockDataTableComponent, MockDataTableTemplatesComponent, MockDataTableSkeletonComponent];

describe('Campaigns component', () => {
  let fixture: ComponentFixture<CampaignsTableComponent>;
  let component: CampaignsTableComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CampaignsTableComponent, ...mocks],
      imports: [CommonModule, RouterTestingModule, NgbTypeaheadModule, UiSharedModule, NzToolTipModule],
      providers: [
        {
          provide: CampaignApiService,
          useClass: CampaignApiServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CampaignsTableComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  }),
    xit('should get initialized', () => {
      expect(component).toBeTruthy();
    });
});
