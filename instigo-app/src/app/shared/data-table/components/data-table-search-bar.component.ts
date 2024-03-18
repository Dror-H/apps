import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { debounce } from 'lodash-es';

@Component({
  selector: 'app-data-table-search-bar',
  template: `
    <div class="input-group-with-search text-md-left">
      <input
        #searchTerm
        class="form-control"
        type="text"
        name="searchTerm"
        placeholder="Search"
        (input)="onSearch(searchTerm.value)"
      />
      <i class="fas fa-search"></i>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableSearchBarComponent implements OnInit {
  @Output()
  searchTerm = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {
    this.onSearch = debounce(this.onSearch, 1000);
  }

  onSearch(searchTerm: string) {
    this.searchTerm.emit(searchTerm);
  }
}
