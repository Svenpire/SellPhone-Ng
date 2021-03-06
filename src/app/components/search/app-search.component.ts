import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { SearchResults } from 'src/app/models/SearchResults';
import * as fromSearchActions from 'src/app/stores/search/search.actions';

export interface SearchText {
  searchText: string;
}

@Component({
  selector: 'app-search',
  templateUrl: './app-search.component.html',
  styleUrls: ['./app-search.component.scss']
})
export class AppSearchComponent {
  searchText: string;
  constructor(
    private store: Store<SearchResults>
  ) { }

  public onSearchRequested(): void {

    if (!this.searchText) {
      this.store.dispatch(fromSearchActions.clearSearch());
    } else {
      this.store.dispatch(fromSearchActions
        .submitSearch({ searchText: this.searchText }));

    }
  }
}
