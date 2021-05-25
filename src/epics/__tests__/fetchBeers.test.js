import { TestScheduler } from "rxjs/testing";
import {search,setStatus,cancel,reset,fetchFailed,fetchFulfilled} from "../../reducers/beersActions";
//import { setStatus,fetchFulfilled } from "../../reducers/beersReducer;
import { initialState } from "../../reducers/configReducer";
import { fetchBeersEpic } from "../fetchBeers";
import { of } from "rxjs";

it("produces correct actions (success)", function(){

  const testScheduler = new TestScheduler((actual, expected)=> {

    expect(actual).toEqual(expected);
  } )

  testScheduler.run((helpers) => {
    const {hot, cold, expectObservable} = helpers;

    const action$ = hot ('a',{
      a:search("ship")
    });
    const state$ =of({
      config:initialState
    }) ;
    const dependencies = {
      getJSON:(url)=>{
        return cold('-a', {
          a:[{name:'Beer 1'}]
        })
      }
    };


        const output$ = fetchBeersEpic(action$,state$,dependencies);
        expectObservable(output$).toBe('500ms ab', {
          a:setStatus('pending'),
          b:fetchFulfilled([{name:'Beer 1'}])
        })
  })
})


it("produces correct actions(error)", function(){

  const testScheduler = new TestScheduler((actual, expected)=> {

    expect(actual).toEqual(expected);
  } )

  testScheduler.run((helpers) => {
    const {hot, cold, expectObservable} = helpers;

    const action$ = hot ('a',{
      a:search("ship")
    });
    const state$ =of({
      config:initialState
    }) ;
    const dependencies = {
      getJSON:(url)=>{
        return cold('-#', null, {
          response:{
            message:"oops!"
          }
        })
      }
    };


        const output$ = fetchBeersEpic(action$,state$,dependencies);
        expectObservable(output$).toBe('500ms ab', {
          a:setStatus('pending'),
          b:fetchFailed("oops!")
        })
  })
})


it("produces correct actions(reset state)", function(){

  const testScheduler = new TestScheduler((actual, expected)=> {

    expect(actual).toEqual(expected);
  } )

  testScheduler.run((helpers) => {
    const {hot, cold, expectObservable} = helpers;

    const action$ = hot ('a 500ms -b',{
      a:search("ship"),
      b:cancel()
    });
    const state$ =of({
      config:initialState
    }) ;
    const dependencies = {
      getJSON:(url)=>{
        return cold('---a')
        }
      }
    


        const output$ = fetchBeersEpic(action$,state$,dependencies);
        expectObservable(output$).toBe('500ms a-b', {
          a:setStatus('pending'),
          b:reset()
        })
  })
})