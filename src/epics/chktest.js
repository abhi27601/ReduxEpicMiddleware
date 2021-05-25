// import { TestScheduler } from "rxjs/testing";
// import {search,setStatus,fetchFulfilled} from "../../reducers/beersActions";
// //import { setStatus,fetchFulfilled } from "../../reducers/beersReducer;
// import { initialState } from "../../reducers/configReducer";
// import { fetchBeersEpic } from "../fetchBeers";
// import { of } from "rxjs";

// it("produces correct actions", function(){

//   const testScheduler = new TestScheduler((actual, expected)=> {

//     expect(actual).toEqual(expected);
//   } )

//   testScheduler.run((helpers) => {
//     const {hot, cold, expectObservable} = helpers;

//     const action$ = hot ('a',{
//       a:search("ship")
//     });
//     const state$ =of({
//       config:initialState
//     }) ;
//     const dependencies = {
//       getJSON:(url)=>{
//         return cold('-a', {
//           a:[{name:'Beer 1'}]
//         })
//       }
//     };


//         const output$ = fetchBeersEpic(action$,state$,dependencies);
//         expectObservable(output$).toBe('500ms ab', {
//           a:setStatus('pending'),
//           b:fetchFulfilled([{name:'Beer 1'}])
//         })
//   })
// })


// ///////////////////////

// import { ofType } from 'redux-observable';
// import { of,concat,forkJoin, fromEvent,merge,race } from 'rxjs';

// import {catchError, debounceTime,pluck, distinctUntilChanged, filter,ignoreElements, map, switchMap, tap,delay, takeUntil, mapTo , withLatestFrom} from 'rxjs/operators';
// import {fetchFulfilled,CANCEL,RANDOM, FETCH_DATA, setStatus,SEARCH, fetchFailed,reset} from '../reducers/beersActions';
// const API = "https://api.punkapi.com/v2/beers";

// const search = (apiBase,perPage,term) => `${API}?beer_name=${encodeURIComponent(term)}&per_page=${perPage}`

// const random = (apiBase) => `${apiBase}/random`;
// // export function fetchBeersEpic(action$) {

// //   return action$.pipe(
// //     ofType(FETCH_DATA),
// //     switchMap(() => {
// //       return concat(
// //         of(setStatus("pending")),
// //         ajax.getJSON(API).pipe(
// //           map(resp => fetchFulfilled(resp))
// //         )
// //       )
// //     })
// //   );
 
// // }
// //state.value is a property added to observable or epic by redux observale it gives access to complete store.
// // export function fetchBeersEpic(action$,state$ , { getJSON , document}) {

// //   return action$.pipe(
// //    // ofType(SEARCH),
// //     ofType(RANDOM),
// //     debounceTime(500),
// //    // filter(({payload}) => payload.trim() !== ''),
// //     distinctUntilChanged(),
// //     withLatestFrom(
// //       state$.pipe(pluck("config")),
// //       //state$.pipe(pluck("user","authToken")) you can extract authtoken value in this statement and pass it as argument to the below observable
// //       ), // it returns by adding(concatenating) , new value(observable in this case state) with the old observable. withLatest form will always give action and state
// //     switchMap(([{payload},config]) => {
     
// //      const reqs = [...Array(config.perPage)].map(() => {
// //        return getJSON(random(config.apiBase)).pipe(pluck(0));
// //      })

// // // we use getJSON method which ssumes we are in env wherre getJSON can be run.
// //  // similarly we use document which is a global variable.
     
// //      const ajax$ = forkJoin(reqs).pipe(
// //      //const ajax$ =  ajax.getJSON(search(config.apiBase,config.perPage,payload)).pipe(
// //           map(resp => fetchFulfilled(resp)),
// //          // delay(5000),
// //          // takeUntil(blocker$),//whenever cancel fired just unsubscribe the observable before this
// //           catchError(err => {
// //             return of(fetchFailed(err.response.message))
// //           })
// //         )
      

// //       const blocker$ = merge(
// //         action$.pipe(ofType(CANCEL)),
// //         fromEvent(document , "keyup").pipe(
// //           filter((evt) => evt.key === "Escape" || evt.key === "Esc")
// //         )
// //       ).pipe(mapTo(reset()))
// //   // we use race because we have to subscribe two both but getting value of one observable shld cancel the other.its possible with race.vid 11.
// //       return concat(
// //         of(setStatus("pending")),
// //         race(ajax$ , blocker$)
// //       )
// //     })
// //   );
 
// // }


// export function fetchBeersEpic(action$,state$ , { getJSON , document}) {

//   return action$.pipe(
//     ofType(SEARCH),
//    // ofType(RANDOM),
//     debounceTime(500),
//     filter(({payload}) => payload.trim() !== ''),
//     //distinctUntilChanged(),
//     withLatestFrom(
//       state$.pipe(pluck("config")),
//       //state$.pipe(pluck("user","authToken")) you can extract authtoken value in this statement and pass it as argument to the below observable
//       ), // it returns by adding(concatenating) , new value(observable in this case state) with the old observable. withLatest form will always give action and state
//     switchMap(([{payload},config]) => {
     
//     //  const reqs = [...Array(config.perPage)].map(() => {
//     //    return getJSON(random(config.apiBase)).pipe(pluck(0));
//     //  })

// // we use getJSON method which ssumes we are in env wherre getJSON can be run.
//  // similarly we use document which is a global variable.
     
//      //const ajax$ = forkJoin(reqs).pipe(
//      const ajax$ =  getJSON(search(config.apiBase,config.perPage,payload)).pipe(
//           map(resp => fetchFulfilled(resp)),
//          // delay(5000),
//          // takeUntil(blocker$),//whenever cancel fired just unsubscribe the observable before this
//           catchError(err => {
//             return of(fetchFailed(err.response.message))
//           })
//         )
      

//       const blocker$ = merge(
//         action$.pipe(ofType(CANCEL)),
//         fromEvent(document , "keyup").pipe(
//           filter((evt) => evt.key === "Escape" || evt.key === "Esc")
//         )
//       ).pipe(mapTo(reset()))
//   // we use race because we have to subscribe two both but getting value of one observable shld cancel the other.its possible with race.vid 11.
//       return concat(
//         of(setStatus("pending")),
//         race(ajax$ , blocker$)
//       )
//     })
//   );
 
// }