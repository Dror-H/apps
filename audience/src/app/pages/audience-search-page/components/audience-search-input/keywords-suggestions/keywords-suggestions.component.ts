import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'audi-keywords-suggestions',
  templateUrl: './keywords-suggestions.component.html',
  styleUrls: ['./keywords-suggestions.component.scss'],
})
export class KeywordsSuggestionsComponent {
  @Input() public keywordsSuggestions: string[] = [];
  @Input() public isLoading = false;
  @Output() public suggestionSelected = new EventEmitter<string>();
  @Output() public refreshSuggestions = new EventEmitter<undefined>();

  public emitSelectedSuggestion(suggestion: string): void {
    this.keywordsSuggestions = this.keywordsSuggestions.filter((s) => s !== suggestion);
    this.suggestionSelected.emit(suggestion);
  }

  public emitRefreshSuggestions(): void {
    this.refreshSuggestions.emit();
  }
}
