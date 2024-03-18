import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { WorkspaceCardComponent } from './workspace-card.component';

describe('ReplaceWithYourComponent: ', () => {
  let component: WorkspaceCardComponent;
  let fixture: ComponentFixture<WorkspaceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule,
        NzCardModule,
        NzDropDownModule,
        NzProgressModule,
        NzAvatarModule,
        NzToolTipModule,
      ],
      declarations: [WorkspaceCardComponent],
      providers: [{ provide: 'ReplaceWithYourServiceToBeMocked', useValue: {} }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceCardComponent);
    component = fixture.componentInstance;
    component.workspace = {
      id: 'workspace',
      name: 'workspace name',
      adAccounts: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      members: [{ fullName: 'Admin' }],
      owner: { fullName: 'Admin' },
    } as any;
    component.currentWorkspace = {
      id: 'workspace2',
      name: 'workspace2 name',
      adAccounts: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      members: [{ fullName: 'Admin' }],
      owner: { fullName: 'Admin' },
    } as any;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
