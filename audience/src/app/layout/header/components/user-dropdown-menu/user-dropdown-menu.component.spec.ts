import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { currentUserMock } from '@audience-app/auth/auth.mocks';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

import { UserDropdownMenuComponent } from './user-dropdown-menu.component';

@Pipe({ name: 'initialsFromUser' })
class MockInitialsFromUserPipe implements PipeTransform {
  transform(value: string) {
    return value;
  }
}

describe('UserDropdownMenuComponent', () => {
  let component: UserDropdownMenuComponent;
  let fixture: ComponentFixture<UserDropdownMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserDropdownMenuComponent, MockInitialsFromUserPipe],
      imports: [RouterTestingModule, NzDropDownModule, NzAvatarModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDropdownMenuComponent);
    component = fixture.componentInstance;
    component.user = currentUserMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
