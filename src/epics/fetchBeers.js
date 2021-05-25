import {
  catchError,
  debounceTime,
  filter,
  map,
  mapTo,
  pluck,
  switchMap,
  withLatestFrom,
  distinctUntilChanged,
} from 'rxjs/operators';
import {
  SEARCH,
  RANDOM,
  fetchFulfilled,
  setStatus,
  fetchFailed,
  CANCEL,
  reset,
} from '../reducers/beersActions';
import { ofType } from 'redux-observable';
import { concat, fromEvent, of, merge, race, forkJoin } from 'rxjs';

const search = (apiBase, perPage, term) =>
  `${apiBase}?beer_name=${encodeURIComponent(term)}&per_page=${perPage}`;

const random = (apiBase) => `${apiBase}/random`;

export function fetchBeersEpic(action$, state$, { getJSON }) {
  return action$.pipe(
    ofType(SEARCH),
    debounceTime(500),
    filter(({ payload }) => payload.trim() !== ''),
    withLatestFrom(state$.pipe(pluck('config'))),
    switchMap(([{ payload }, config]) => {
      const ajax$ = getJSON(
        search(config.apiBase, config.perPage, payload)
      ).pipe(
        map((resp) => fetchFulfilled(resp)),
        catchError((err) => {
          return of(fetchFailed(err.response.message));
        })
      );

      const blocker$ = merge(
        action$.pipe(ofType(CANCEL)),
        fromEvent(document, 'keyup').pipe(
          filter((evt) => evt.key === 'Escape' || evt.key === 'Esc')
        )
      ).pipe(mapTo(reset()));

      return concat(of(setStatus('pending')), race(ajax$, blocker$));
    })
  );
}

export function fetchBeersEpicRandom(action$, state$, { getJSON, document }) {
  return action$.pipe(
    // ofType(SEARCH),
    ofType(RANDOM),
    debounceTime(500),
    // filter(({payload}) => payload.trim() !== ''),
    distinctUntilChanged(),
    withLatestFrom(
      state$.pipe(pluck('config'))
      //state$.pipe(pluck("user","authToken")) you can extract authtoken value in this statement and pass it as argument to the below observable
    ), // it returns by adding(concatenating) , new value(observable in this case state) with the old observable. withLatest form will always give action and state
    switchMap(([{ payload }, config]) => {
      const reqs = [...Array(config.perPage)].map(() => {
        return getJSON(random(config.apiBase)).pipe(pluck(0));
      });

      // we use getJSON method which ssumes we are in env wherre getJSON can be run.
      // similarly we use document which is a global variable.

      const ajax$ = forkJoin(reqs).pipe(
        //const ajax$ =  ajax.getJSON(search(config.apiBase,config.perPage,payload)).pipe(
        map((resp) => fetchFulfilled(resp)),
        // delay(5000),
        // takeUntil(blocker$),//whenever cancel fired just unsubscribe the observable before this
        catchError((err) => {
          return of(fetchFailed(err.response.message));
        })
      );

      const blocker$ = merge(
        action$.pipe(ofType(CANCEL)),
        fromEvent(document, 'keyup').pipe(
          filter((evt) => evt.key === 'Escape' || evt.key === 'Esc')
        )
      ).pipe(mapTo(reset()));
      // we use race because we have to subscribe two both but getting value of one observable shld cancel the other.its possible with race.vid 11.
      return concat(of(setStatus('pending')), race(ajax$, blocker$));
    })
  );
}
