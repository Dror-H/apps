import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserApiService } from '@app/api/services/user.api.service';
import { WorkspaceApiService } from '@app/api/services/workspace.api.service';
import { DisplayNotification } from '@app/global/display-notification.service';
import { FakeTranslationLoader } from '@app/shared/shared/fake-translation-loader.helper';
import { WorkspaceDTO } from '@instigo-app/data-transfer-object';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxsSelectSnapshotModule } from '@ngxs-labs/select-snapshot';
import { NgxsModule, Store } from '@ngxs/store';
import * as faker from 'faker';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { of } from 'rxjs';
import { WorkspaceListComponent } from './workspace-list.component';

@Component({
  template: `<div></div>`,
  selector: 'ingo-account-workspace-card',
})
class MockAccountWorkspaceCardComponent {
  @Input() workspace: WorkspaceDTO;
  @Input() currentWorkspace: WorkspaceDTO;
}

@Component({
  selector: 'app-create-workspace-card',
  template: `<div></div>`,
})
export class MockCreateWorkspaceCardComponent {
  @Input() isInAccountControl: boolean;
  @Input() isDisabled: boolean;
  @Output() workspaceCreated = new EventEmitter<Partial<WorkspaceDTO>>();
}

describe('WorkspaceListComponent: ', () => {
  let component: WorkspaceListComponent;
  let fixture: ComponentFixture<WorkspaceListComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgxsModule.forRoot([]),
        NgxsSelectSnapshotModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeTranslationLoader },
        }),
        NzGridModule,
      ],
      declarations: [WorkspaceListComponent, MockAccountWorkspaceCardComponent, MockCreateWorkspaceCardComponent],
      providers: [
        { provide: DisplayNotification, useValue: {} },
        { provide: UserApiService, useValue: {} },
        {
          provide: WorkspaceApiService,
          useValue: {
            findAll: jest.fn().mockReturnValue(
              of([
                { id: faker.datatype.uuid(), name: faker.lorem.word() },
                { id: faker.datatype.uuid(), name: faker.lorem.word() },
              ]),
            ),
          },
        },
      ],
    }).compileComponents();
    store = TestBed.inject(Store);
    jest
      .spyOn(store, 'select')
      .mockReturnValue(of({ id: faker.datatype.uuid(), ownedWorkspace: [{ id: faker.datatype.uuid() }] }));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeTruthy();
  });

  it('can i create a workspace', (done) => {
    // Arrange
    store.select = jest
      .fn()
      .mockReturnValue(of({ id: faker.datatype.uuid(), ownedWorkspace: [{ id: faker.datatype.uuid() }] }));
    // Act
    component.isDisabledCreateWorkspace().subscribe((canICreate) => {
      expect(canICreate).toBe(true);
      done();
    });
  });

  it('can i create a workspace', (done) => {
    // Arrange
    store.select = jest.fn().mockReturnValue(of({ id: faker.datatype.uuid(), ownedWorkspace: [] }));
    // Act
    component.isDisabledCreateWorkspace().subscribe((canICreate) => {
      expect(canICreate).toBe(false);
      done();
    });
  });

  it('can i create a workspace', (done) => {
    // Arrange
    store.select = jest
      .fn()
      .mockReturnValue(of({ id: faker.datatype.uuid(), ownedWorkspace: [], subscriptionStatus: true }));
    // Act
    component.isDisabledCreateWorkspace().subscribe((canICreate) => {
      expect(canICreate).toBe(false);
      done();
    });
  });
});
