import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { KeywordsSuggestionsComponent } from './keywords-suggestions.component';

describe('KeywordsSuggestionsComponent', () => {
  let component: KeywordsSuggestionsComponent;
  let fixture: ComponentFixture<KeywordsSuggestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KeywordsSuggestionsComponent],
      imports: [NzTagModule, NzTypographyModule, NzSkeletonModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeywordsSuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('emitSelectedSuggestion', () => {
    it('should remove selected keyword from keywordsSuggestions', () => {
      component.keywordsSuggestions = ['test 1', 'test 2'];
      component.emitSelectedSuggestion('test 1');
      expect(component.keywordsSuggestions).toEqual(['test 2']);
    });

    it('should call suggestionSelected.emit with suggestion', () => {
      const spy = jest.spyOn(component.suggestionSelected, 'emit');
      component.emitSelectedSuggestion('test');
      expect(spy).toBeCalledWith('test');
    });
  });

  describe('emitRefreshSuggestions', () => {
    it('should call refreshSuggestions.emit', () => {
      const spy = jest.spyOn(component.refreshSuggestions, 'emit');
      component.emitRefreshSuggestions();
      expect(spy).toBeCalled();
    });
  });
});
