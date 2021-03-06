import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, catchError, tap, concatMap } from 'rxjs/operators';
import { SearchService } from '../../services/search.service';
import * as fromSearchActions from './search.actions';
import { of } from 'rxjs';

@Injectable()
export class SearchEffects {
  getSearchResults$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromSearchActions.submitSearch),
      mergeMap(action =>
        this.searchService.getSearchResultsDB(action.searchText).pipe(
          map(results => fromSearchActions.returnSearchResultsSuccess({ results })),
          catchError(error =>
            of(fromSearchActions.returnSearchResultsFailure({ error }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private searchService: SearchService
  ) {}
}
