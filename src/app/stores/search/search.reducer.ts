import { state } from '@angular/animations';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import { SearchResult } from 'src/app/models/SearchResult';
import { SearchResults } from 'src/app/models/SearchResults';
import { clearSearch, returnSearchResultsFailure, returnSearchResultsSuccess, submitSearch } from './search.actions';

export const searchFeatureKey = 'siteSearchResults';

export interface SearchState extends EntityState<SearchResult> {
  error: any;
  selectedSearchResult: SearchResult;
}

export const adapter: EntityAdapter<SearchResult>
  = createEntityAdapter<SearchResult>();

export const initialState: SearchState = adapter.getInitialState({
  error: undefined,
  selectedSearchResult: null,
  results: []
});

export const searchReducer = createReducer(
  initialState,
  // ---- RETURN RESULTS[] ----
  on(returnSearchResultsSuccess, (state, action) =>
  adapter.setAll<SearchState>(action.results, state)
  ),
  on(returnSearchResultsFailure, (state, action) =>
  ({...state, error: action.error })
  ),
  on(clearSearch, () => initialState)
);

// export function searchStore(state: SearchState | undefined, action: Action) {
//   return searchReducer(state,action);
// }

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
